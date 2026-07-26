import { useCallback, useEffect, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { useLocalStorage } from './useLocalStorage';
import { KEYS } from '../utils/storage';

type LearningEventType = 'task_completed' | 'task_uncompleted' | 'project_completed' | 'project_uncompleted';

interface ActivityEventRow {
  id: string;
  event_type: LearningEventType;
  pillar_id: string;
  metadata: { date?: string } | null;
  processed_at: string | null;
}

/**
 * Consumes LearningAI's `activity_events` and reflects them onto the linked
 * GRIND OS routine(s) via the same completeRoutine/uncompleteRoutine the UI
 * uses, so XP/streak/momentum flow through the existing engine untouched.
 *
 * Multiple LearningAI completions on the same day collapse into a single
 * routine completion (completeRoutine is idempotent). Symmetrically, the
 * routine is only uncompleted once the net LearningAI completion count for
 * that day returns to zero, tracked in `dailyCounts` — this avoids
 * un-completing the routine just because one of several same-day LearningAI
 * items got unchecked while another is still done.
 */
export function useLearningActivityFeed(
  session: Session | null,
  linkedRoutineIds: string[],
  completeRoutine: (routineId: string, targetDate?: string) => void,
  uncompleteRoutine: (routineId: string, targetDate?: string) => void
) {
  const [, setDailyCounts] = useLocalStorage<Record<string, number>>(
    KEYS.LEARNINGAI_DAILY_COUNTS,
    {}
  );
  const linkedRoutineIdsRef = useRef(linkedRoutineIds);
  linkedRoutineIdsRef.current = linkedRoutineIds;

  const processEvent = useCallback(
    (row: ActivityEventRow) => {
      const date = row.metadata?.date;
      if (!date) return;
      const isCompletion = row.event_type === 'task_completed' || row.event_type === 'project_completed';
      const ids = linkedRoutineIdsRef.current;

      setDailyCounts((prev) => {
        const current = prev[date] ?? 0;
        const next = isCompletion ? current + 1 : Math.max(0, current - 1);

        if (isCompletion && current === 0) {
          ids.forEach((routineId) => completeRoutine(routineId, date));
        } else if (!isCompletion && next === 0) {
          ids.forEach((routineId) => uncompleteRoutine(routineId, date));
        }

        return { ...prev, [date]: next };
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

  // Catch up on anything that happened while GRIND OS was closed.
  useEffect(() => {
    if (!supabase || !session || linkedRoutineIds.length === 0) return;
    let cancelled = false;

    (async () => {
      const { data } = await supabase!
        .from('activity_events')
        .select('id, event_type, pillar_id, metadata, processed_at')
        .eq('user_id', session.user.id)
        .eq('pillar_id', 'skills')
        .is('processed_at', null)
        .order('occurred_at', { ascending: true });

      if (cancelled || !data) return;
      (data as ActivityEventRow[]).forEach(processEvent);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, linkedRoutineIds.length > 0]);

  // Live updates while both apps are open at once.
  useEffect(() => {
    if (!supabase || !session || linkedRoutineIds.length === 0) return;

    const channel = supabase
      .channel(`activity_events_${session.user.id}`)
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
          if (row.pillar_id === 'skills' && row.processed_at === null) {
            processEvent(row);
          }
        }
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, linkedRoutineIds.length > 0]);
}
