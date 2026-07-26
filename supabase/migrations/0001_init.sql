-- GRIND OS <-> LearningAI shared integration schema.
-- Canonical copy lives in this repo; LearningAI's README links here.
-- Apply once against the shared Supabase project (SQL editor, or `supabase db push`).

create table public.grindos_snapshot (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,   -- exact shape of exportAllData()
  updated_at timestamptz not null default now()
);

create table public.learningai_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,   -- exact shape of ProgressState
  updated_at timestamptz not null default now()
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_app text not null check (source_app in ('learningai', 'grindos')),
  event_type text not null check (
    event_type in ('task_completed', 'task_uncompleted', 'project_completed', 'project_uncompleted')
  ),
  external_id text not null,              -- e.g. 'p1t1', 'p1pr1'
  pillar_id text not null default 'skills',
  xp_value integer not null default 0,    -- informational only, NOT authoritative
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,   -- { date, phaseId, title, hours }
  processed_at timestamptz,
  processed_by text,
  created_at timestamptz not null default now()
);

create index activity_events_unprocessed_idx
  on public.activity_events (user_id, processed_at)
  where processed_at is null;

create table public.integration_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  learningai_routine_ids text[] not null default array['learningai-sync'],
  bonus_xp_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

-- RLS: identical owner-row pattern everywhere. Nothing hardcodes a specific
-- user, so this extends to more users later without a schema change.
alter table public.grindos_snapshot enable row level security;
alter table public.learningai_progress enable row level security;
alter table public.activity_events enable row level security;
alter table public.integration_settings enable row level security;

create policy "own row" on public.grindos_snapshot
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own row" on public.learningai_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own row" on public.integration_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "select own" on public.activity_events
  for select using (auth.uid() = user_id);

create policy "insert own" on public.activity_events
  for insert with check (auth.uid() = user_id);

create policy "update own" on public.activity_events
  for update using (auth.uid() = user_id);
