-- ============================================================
-- GRIND OS  <->  LearningAI  —  shared Supabase schema
-- Run once in SQL editor of your shared Supabase project.
-- Both apps point at the SAME project (shared auth.users).
-- ============================================================

-- ── 1. GRIND OS full-state backup ────────────────────────────
-- One row per user. GRIND OS upserts here on every state change.
-- Used for cross-device restore and conflict resolution.
create table public.grindos_snapshot (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb        not null default '{}'::jsonb,
  updated_at timestamptz  not null default now()
);

-- ── 2. GRIND OS flat stats (what LearningAI reads) ───────────
-- Always-current, queryable metrics. Updated alongside the snapshot.
-- LearningAI does a simple SELECT on this — no JSON parsing needed.
create table public.grindos_stats (
  user_id              uuid     primary key references auth.users(id) on delete cascade,
  display_name         text,
  level                integer  not null default 1,
  total_xp             integer  not null default 0,
  current_streak       integer  not null default 0,
  best_streak          integer  not null default 0,
  streak_frozen        boolean  not null default false,
  today_date           text,                           -- 'YYYY-MM-DD'
  today_completed      integer  not null default 0,    -- routines done today
  today_total          integer  not null default 0,    -- active routines total
  today_xp             integer  not null default 0,
  today_momentum_score integer  not null default 0,    -- 0–100
  week_completion_rate numeric(5,4),                   -- 0.0000 – 1.0000
  updated_at           timestamptz not null default now()
);

-- ── 3. LearningAI full-state backup ──────────────────────────
-- Mirror of grindos_snapshot but for LearningAI's localStorage state.
-- GRIND OS can read this to show learning progress inside its UI.
create table public.learningai_progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb        not null default '{}'::jsonb,
  updated_at timestamptz  not null default now()
);

-- ── 4. LearningAI flat stats (what GRIND OS reads) ───────────
-- Queryable metrics from LearningAI, parallel to grindos_stats.
create table public.learningai_stats (
  user_id             uuid    primary key references auth.users(id) on delete cascade,
  tasks_completed     integer not null default 0,
  projects_completed  integer not null default 0,
  total_hours_logged  numeric(8,2) not null default 0,
  current_phase       text,
  active_project_name text,
  updated_at          timestamptz not null default now()
);

-- ── 5. Cross-app event feed ───────────────────────────────────
-- LearningAI writes a row when a task/project is completed.
-- GRIND OS reads unprocessed rows, fires completeRoutine/uncompleteRoutine,
-- then marks them processed. Both directions are supported via source_app.
create table public.activity_events (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  source_app   text        not null check (source_app in ('learningai', 'grindos')),
  event_type   text        not null check (
    event_type in ('task_completed', 'task_uncompleted', 'project_completed', 'project_uncompleted')
  ),
  external_id  text        not null,          -- e.g. 'p1t1', 'p1pr1'
  pillar_id    text        not null default 'skills',
  xp_value     integer     not null default 0, -- informational only, NOT authoritative
  occurred_at  timestamptz not null default now(),
  metadata     jsonb       not null default '{}'::jsonb,  -- { date, phaseId, title, hours }
  processed_at timestamptz,
  processed_by text,
  created_at   timestamptz not null default now()
);

-- Partial index: fast lookup of unprocessed events per user
create index activity_events_unprocessed_idx
  on public.activity_events (user_id, occurred_at)
  where processed_at is null;

-- ── 6. Integration settings ───────────────────────────────────
-- Stored server-side so settings survive app reinstalls.
create table public.integration_settings (
  user_id               uuid     primary key references auth.users(id) on delete cascade,
  learningai_routine_ids text[]   not null default array['learningai-sync'],
  bonus_xp_enabled      boolean  not null default false,
  updated_at            timestamptz not null default now()
);

-- ============================================================
-- ROW-LEVEL SECURITY
-- Every table uses the same "you can only see your own row"
-- pattern. Nothing hardcodes a specific user — extends to
-- multiple users without any schema changes.
-- ============================================================

alter table public.grindos_snapshot      enable row level security;
alter table public.grindos_stats         enable row level security;
alter table public.learningai_progress   enable row level security;
alter table public.learningai_stats      enable row level security;
alter table public.activity_events       enable row level security;
alter table public.integration_settings  enable row level security;

-- Full CRUD for own row on the snapshot/stats/settings tables
create policy "own row" on public.grindos_snapshot
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own row" on public.grindos_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own row" on public.learningai_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own row" on public.learningai_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own row" on public.integration_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- activity_events: own rows, scoped per operation
create policy "select own" on public.activity_events
  for select using (auth.uid() = user_id);

create policy "insert own" on public.activity_events
  for insert with check (auth.uid() = user_id);

create policy "update own" on public.activity_events
  for update using (auth.uid() = user_id);
