-- ============================================================
-- GRIND OS — Connector Platform
-- Run in Supabase SQL editor AFTER 0001_init.sql.
-- Transforms the hardcoded LearningAI integration into a
-- generic plug-and-play connector system.
-- ============================================================

-- ── 1. Drop the hardcoded source_app CHECK constraint ────────
-- Any registered connector app can now write activity_events.
alter table public.activity_events
  drop constraint if exists activity_events_source_app_check;

-- ── 2. Connector registry ────────────────────────────────────
-- Each external app registers once per user. GRIND OS reads
-- this to know which apps are linked, what pillar they feed,
-- and which routines to auto-complete on their events.
create table if not exists public.connector_registry (
  app_id              text        not null,
  user_id             uuid        not null references auth.users(id) on delete cascade,
  display_name        text        not null,
  pillar_id           text        not null default 'skills',
  linked_routine_ids  text[]      not null default '{}',
  enabled             boolean     not null default true,
  registered_at       timestamptz not null default now(),
  primary key (app_id, user_id)
);

-- ── 3. Connector snapshots ───────────────────────────────────
-- Full-state JSON backup per app per user.
-- Generalizes learningai_progress (which is kept for backwards compat).
create table if not exists public.connector_snapshots (
  app_id     text        not null,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  state      jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (app_id, user_id)
);

-- ── 4. Connector stats ───────────────────────────────────────
-- Flat queryable metrics per app per user. Each app defines its own JSON shape.
-- Generalizes learningai_stats (which is kept for backwards compat).
create table if not exists public.connector_stats (
  app_id     text        not null,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  stats      jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (app_id, user_id)
);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

alter table public.connector_registry  enable row level security;
alter table public.connector_snapshots enable row level security;
alter table public.connector_stats     enable row level security;

create policy "own row" on public.connector_registry
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own row" on public.connector_snapshots
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own row" on public.connector_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
