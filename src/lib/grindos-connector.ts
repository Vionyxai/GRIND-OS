/**
 * GRIND OS Connector SDK
 *
 * Drop this file into any app to connect it to GRIND OS.
 *
 * Requirements:
 *   - @supabase/supabase-js installed in your project
 *   - Same VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY env vars as GRIND OS
 *   - User authenticated against the shared Supabase project
 *
 * Quick-start for any external app (e.g. LearningAI):
 *
 *   // 1. On startup after auth — idempotent, safe to call every time
 *   await registerApp(supabase, userId, {
 *     app_id: 'learningai',
 *     display_name: 'LearningAI',
 *     pillar_id: 'skills',
 *     linked_routine_ids: [],   // GRIND OS fills this in via the Settings UI
 *   });
 *
 *   // 2. When a task / project is completed
 *   await publishEvent(supabase, userId, {
 *     source_app: 'learningai',
 *     event_type: 'task_completed',
 *     external_id: 'p1t3',
 *     pillar_id: 'skills',
 *     metadata: { date: '2026-08-02', title: 'Module 3', hours: 1.5 },
 *   });
 *
 *   // 3. When a task is unchecked
 *   await publishEvent(supabase, userId, {
 *     source_app: 'learningai',
 *     event_type: 'task_uncompleted',
 *     external_id: 'p1t3',
 *     metadata: { date: '2026-08-02' },
 *   });
 *
 *   // 4. Update your app's stats row (optional — shows in future GRIND OS panels)
 *   await publishStats(supabase, userId, 'learningai', {
 *     tasks_completed: 42,
 *     current_phase: 'Phase 2',
 *     total_hours_logged: 18.5,
 *   });
 *
 *   // 5. Read GRIND OS stats to display in your app (optional)
 *   const grindStats = await readGrindOSStats(supabase, userId);
 *   // → { level, total_xp, current_streak, today_completed, today_total, ... }
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export type GrindOSEventType =
  | 'task_completed'
  | 'task_uncompleted'
  | 'project_completed'
  | 'project_uncompleted';

export interface ConnectorEvent {
  source_app: string;
  event_type: GrindOSEventType;
  external_id: string;
  pillar_id?: string;
  xp_value?: number;
  metadata?: Record<string, unknown>;
}

export interface ConnectorRegistration {
  app_id: string;
  display_name: string;
  pillar_id?: string;
  linked_routine_ids?: string[];
}

export interface GrindOSStats {
  level: number;
  total_xp: number;
  current_streak: number;
  best_streak: number;
  streak_frozen: boolean;
  today_date: string;
  today_completed: number;
  today_total: number;
  today_xp: number;
  today_momentum_score: number;
  week_completion_rate: number;
  display_name: string | null;
  updated_at: string;
}

/**
 * Register your app with GRIND OS. Idempotent — safe to call on every startup.
 * Does not overwrite linked_routine_ids if the user has already configured them
 * via GRIND OS Settings.
 */
export async function registerApp(
  supabase: SupabaseClient,
  userId: string,
  registration: ConnectorRegistration
): Promise<void> {
  await supabase.from('connector_registry').upsert(
    {
      app_id: registration.app_id,
      user_id: userId,
      display_name: registration.display_name,
      pillar_id: registration.pillar_id ?? 'skills',
      linked_routine_ids: registration.linked_routine_ids ?? [],
    },
    { onConflict: 'app_id,user_id', ignoreDuplicates: true }
  );
}

/**
 * Publish a completion/uncompletion event. GRIND OS picks this up in real-time
 * and auto-completes the linked routine, feeding XP/streak/momentum.
 *
 * metadata.date (YYYY-MM-DD) tells GRIND OS which day to credit.
 * If omitted, today is assumed on the GRIND OS side.
 */
export async function publishEvent(
  supabase: SupabaseClient,
  userId: string,
  event: ConnectorEvent
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('activity_events').insert({
    user_id: userId,
    source_app: event.source_app,
    event_type: event.event_type,
    external_id: event.external_id,
    pillar_id: event.pillar_id ?? 'skills',
    xp_value: event.xp_value ?? 0,
    metadata: event.metadata ?? {},
    occurred_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

/**
 * Update your app's flat metrics row in connector_stats.
 * Shape is flexible — define whatever makes sense for your app.
 * GRIND OS will surface these in future connector detail panels.
 */
export async function publishStats(
  supabase: SupabaseClient,
  userId: string,
  appId: string,
  stats: Record<string, unknown>
): Promise<void> {
  await supabase.from('connector_stats').upsert(
    {
      app_id: appId,
      user_id: userId,
      stats,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'app_id,user_id' }
  );
}

/**
 * Read GRIND OS stats to display inside your app.
 * Returns null if the user hasn't synced from GRIND OS yet.
 */
export async function readGrindOSStats(
  supabase: SupabaseClient,
  userId: string
): Promise<GrindOSStats | null> {
  const { data, error } = await supabase
    .from('grindos_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as GrindOSStats;
}
