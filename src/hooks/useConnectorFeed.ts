import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { useLocalStorage } from './useLocalStorage';
import { KEYS } from '../utils/storage';

type ConnectorEventType =
  | 'task_completed'
  | 'task_uncompleted'
  | 'project_completed'
  | 'project_uncompleted';

interface ActivityEventRow {
  id: string;
  source_app: string;
  event_type: ConnectorEventType;
  pillar_id: string;
  metadata: { date?: string } | null;
  processed_at: string | null;
}

interface ConnectorRow {
  app_id: string;
  pillar_id: string;
  linked_routine_ids: string[];
  enabled: boolean;
}

/**
 * Generic replacement for useLearningActivityFeed.
 *
 * Reads all enabled connectors from connector_registry and processes
 * activity_events for each one. Multiple completions from the same app on
 * the same day collapse into a single routine completion (idempotent).
 * Daily counts are keyed by `${source_app}:${date}` so completions from
 * different apps on the same day are tracked independently.
 */
export function useConnectorFeed(
  session: Session | null,
  completeRoutine: (routineId: string, targetDate?: string) => void,
  uncompleteRoutine: (routineId: string, targetDate?: string) => void
) {
  const [connectors, setConnectors] = useState<ConnectorRow[]>([]);
  const connectorsRef = useRef<ConnectorRow[]>([]);
  connectorsRef.current = connectors;

  const [, setDailyCounts] = useLocalStorage<Record<string, number>>(
    KEYS.LEARNINGAI_DAILY_COUNTS,
    {}
  );

  useEffect(() => {
    if (!supabase || !session) {
      setConnectors([]);
      return;
    }
    supabase
      .from('connector_registry')
      .select('app_id, pillar_id, linked_routine_ids, enabled')
      .eq('user_id', session.user.id)
      .eq('enabled', true)
      .then(({ data }) => {
        setConnectors((data as ConnectorRow[]) ?? []);
      });
  }, [session]);

  const processEvent = useCallback(
    (row: ActivityEventRow) => {
      const date = row.metadata?.date;
      if (!date) return;

      const connector = connectorsRef.current.find((c) => c.app_id === row.source_app);
      if (!connector || connector.linked_routine_ids.length === 0) return;

      const isCompletion =
        row.event_type === 'task_completed' || row.event_type === 'project_completed';
      const countKey = `${row.source_app}:${date}`;

      setDailyCounts((prev) => {
        const current = prev[countKey] ?? 0;
        const next = isCompletion ? current + 1 : Math.max(0, current - 1);

        if (isCompletion && current === 0) {
          connector.linked_routine_ids.forEach((id) => completeRoutine(id, date));
        } else if (!isCompletion && next === 0) {
          connector.linked_routine_ids.forEach((id) => uncompleteRoutine(id, date));
        }

        return { ...prev, [countKey]: next };
      });

      if (supabase) {
        supabase
          .from('activity_events')
          .update({ processed_at: new Date().toISOString(), processed_by: 'grindos-web' })
          .eq('id', row.id)
          .is('processed_at', null)
          .then(() => {});
      }
    },
    [completeRoutine, uncompleteRoutine, setDailyCounts]
  );

  // Catch up on anything that arrived while GRIND OS was closed
  useEffect(() => {
    if (!supabase || !session || connectors.length === 0) return;
    let cancelled = false;

    (async () => {
      const { data } = await supabase!
        .from('activity_events')
        .select('id, source_app, event_type, pillar_id, metadata, processed_at')
        .eq('user_id', session.user.id)
        .is('processed_at', null)
        .order('occurred_at', { ascending: true });

      if (cancelled || !data) return;
      (data as ActivityEventRow[]).forEach(processEvent);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, connectors.length]);

  // Live updates while both apps are open at the same time
  useEffect(() => {
    if (!supabase || !session || connectors.length === 0) return;

    const channel = supabase
      .channel(`connector_feed_${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_events',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const row = payload.new as ActivityEventRow;
          if (row.processed_at === null) processEvent(row);
        }
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, connectors.length]);
}
