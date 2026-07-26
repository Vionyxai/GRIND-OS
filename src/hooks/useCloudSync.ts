import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Routine, DailyLog, Pillar, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { exportAllData, importAllData, KEYS } from '../utils/storage';

const DEBOUNCE_MS = 2500;

export type SyncStatus = 'disabled' | 'idle' | 'syncing' | 'synced' | 'error';

export interface CloudConflict {
  remoteUpdatedAt: string;
}

/**
 * Mirrors the full localStorage snapshot to `grindos_snapshot` whenever the
 * watched local state changes. localStorage remains the source of truth —
 * this hook only pushes/pulls a backup blob, it never drives the UI.
 */
export function useCloudSync(
  session: Session | null,
  routines: Routine[],
  logs: DailyLog[],
  pillars: Pillar[],
  profile: UserProfile
) {
  const [status, setStatus] = useState<SyncStatus>(isSupabaseConfigured() ? 'idle' : 'disabled');
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<CloudConflict | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconciledForUser = useRef<string | null>(null);

  const pushSnapshot = useCallback(async () => {
    if (!supabase || !session) return;
    setStatus('syncing');
    const state = JSON.parse(exportAllData());
    const { error: upsertError } = await supabase
      .from('grindos_snapshot')
      .upsert({ user_id: session.user.id, state, updated_at: new Date().toISOString() });
    if (upsertError) {
      setError(upsertError.message);
      setStatus('error');
    } else {
      setError(null);
      setStatus('synced');
      setLastSyncedAt(new Date().toISOString());
    }
  }, [session]);

  const pullSnapshot = useCallback(async () => {
    if (!supabase || !session) return;
    setStatus('syncing');
    const { data, error: selectError } = await supabase
      .from('grindos_snapshot')
      .select('state')
      .eq('user_id', session.user.id)
      .maybeSingle();
    if (selectError) {
      setError(selectError.message);
      setStatus('error');
      return;
    }
    if (data?.state) {
      importAllData(JSON.stringify(data.state));
      window.location.reload();
    } else {
      setStatus('idle');
    }
  }, [session]);

  // One-time reconcile per sign-in: decide whether to seed the cloud from
  // this device, pull the cloud down, or ask the user (both have real data).
  useEffect(() => {
    if (!supabase || !session) return;
    if (reconciledForUser.current === session.user.id) return;
    reconciledForUser.current = session.user.id;

    (async () => {
      const { data } = await supabase!
        .from('grindos_snapshot')
        .select('state, updated_at')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const localLogs = JSON.parse(localStorage.getItem(KEYS.LOGS) ?? '[]') as unknown[];
      const localHasData = localStorage.getItem(KEYS.INITIALIZED) === 'true' && localLogs.length > 0;

      if (!data) {
        await pushSnapshot();
      } else if (!localHasData) {
        await pullSnapshot();
      } else {
        setConflict({ remoteUpdatedAt: data.updated_at as string });
      }
    })();
  }, [session, pushSnapshot, pullSnapshot]);

  // Debounced push whenever local state changes.
  useEffect(() => {
    if (!supabase || !session || conflict) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushSnapshot();
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routines, logs, pillars, profile, session, conflict]);

  const resolveConflict = useCallback(
    (choice: 'local' | 'cloud') => {
      setConflict(null);
      if (choice === 'local') {
        pushSnapshot();
      } else {
        pullSnapshot();
      }
    },
    [pushSnapshot, pullSnapshot]
  );

  return { status, error, conflict, lastSyncedAt, syncNow: pushSnapshot, pullFromCloud: pullSnapshot, resolveConflict };
}
