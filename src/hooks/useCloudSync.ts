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

function buildStats(
  session: Session,
  routines: Routine[],
  logs: DailyLog[],
  profile: UserProfile
) {
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = logs.find((l) => l.date === today);
  const activeCount = routines.filter((r) => r.isActive).length;

  // 7-day completion rate
  const last7: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today + 'T00:00:00');
    d.setDate(d.getDate() - i);
    last7.push(d.toISOString().slice(0, 10));
  }
  const totalDone = last7.reduce((sum, date) => {
    const log = logs.find((l) => l.date === date);
    return sum + (log?.completedRoutineIds.length ?? 0);
  }, 0);
  const weekRate = activeCount > 0 ? totalDone / (activeCount * 7) : 0;

  return {
    user_id: session.user.id,
    display_name: profile.name,
    level: profile.level,
    total_xp: profile.totalXP,
    current_streak: profile.currentStreak,
    best_streak: profile.bestStreak,
    streak_frozen: profile.streakFrozen,
    today_date: today,
    today_completed: todayLog?.completedRoutineIds.length ?? 0,
    today_total: activeCount,
    today_xp: todayLog?.xpEarned ?? 0,
    today_momentum_score: todayLog?.momentumScore ?? 0,
    week_completion_rate: parseFloat(weekRate.toFixed(4)),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Mirrors the full localStorage snapshot to `grindos_snapshot` and the
 * queryable flat metrics to `grindos_stats` (so LearningAI can read them)
 * whenever watched local state changes. localStorage remains the source of
 * truth — this hook only pushes/pulls, it never drives the UI.
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

  // Captures latest values for use inside stable callbacks
  const stateRef = useRef({ routines, logs, profile });
  stateRef.current = { routines, logs, profile };

  const pushSnapshot = useCallback(async () => {
    if (!supabase || !session) return;
    setStatus('syncing');

    const { routines: r, logs: l, profile: p } = stateRef.current;
    const state = JSON.parse(exportAllData());
    const stats = buildStats(session, r, l, p);

    const [snapshotRes, statsRes] = await Promise.all([
      supabase.from('grindos_snapshot').upsert({ user_id: session.user.id, state, updated_at: new Date().toISOString() }),
      supabase.from('grindos_stats').upsert(stats),
    ]);

    const err = snapshotRes.error ?? statsRes.error;
    if (err) {
      setError(err.message);
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

  // One-time reconcile per sign-in
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

  // Debounced push on local state change
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
      if (choice === 'local') pushSnapshot();
      else pullSnapshot();
    },
    [pushSnapshot, pullSnapshot]
  );

  return { status, error, conflict, lastSyncedAt, syncNow: pushSnapshot, pullFromCloud: pullSnapshot, resolveConflict };
}
