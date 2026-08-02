# Connector: LearningAI → GRIND OS

**Status:** Integration ready — this file is the complete brief for the LearningAI Claude agent.

---

## What LearningAI Is

LearningAI is an AI-powered course app built by the same user as GRIND OS. Users work through structured learning phases with tasks and projects. Completing tasks/projects should automatically feed XP, streak, and momentum in GRIND OS.

**Pillar:** Skills & Learning (`skills`)  
**Supabase:** shared project — same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as GRIND OS.

---

## What the LearningAI Claude Agent Needs to Do

### Step 1 — Install the Supabase client (if not already present)
```bash
npm install @supabase/supabase-js
```

### Step 2 — Add env vars (same values as GRIND OS)
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
These must match the GRIND OS values exactly — they point to the same Supabase project.

### Step 3 — Copy the SDK file
Copy `src/lib/grindos-connector.ts` from the GRIND OS repo into LearningAI.
Suggested path: `src/lib/grindos-connector.ts`

The file is self-contained with no dependencies beyond `@supabase/supabase-js`.
Do NOT modify it — just copy as-is.

### Step 4 — Register on startup

After the user is authenticated, call `registerApp` once. It is idempotent — safe to call on every app load.

```ts
import { registerApp } from './lib/grindos-connector';

// Call this after supabase.auth.getUser() confirms the user is signed in
await registerApp(supabase, userId, {
  app_id: 'learningai',
  display_name: 'LearningAI',
  pillar_id: 'skills',
  linked_routine_ids: [],   // GRIND OS user picks the routine in Settings
});
```

### Step 5 — Publish events on task completion

When a user marks a **task** as complete:
```ts
import { publishEvent } from './lib/grindos-connector';

await publishEvent(supabase, userId, {
  source_app: 'learningai',
  event_type: 'task_completed',
  external_id: task.id,           // e.g. 'p1t3' or whatever your task ID is
  pillar_id: 'skills',
  metadata: {
    date: task.completedAt.slice(0, 10),   // 'YYYY-MM-DD'
    title: task.title,
    phaseId: task.phaseId,         // optional — include if available
  },
});
```

When a user **unchecks** a task:
```ts
await publishEvent(supabase, userId, {
  source_app: 'learningai',
  event_type: 'task_uncompleted',
  external_id: task.id,
  metadata: {
    date: task.completedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  },
});
```

When a **project** is completed:
```ts
await publishEvent(supabase, userId, {
  source_app: 'learningai',
  event_type: 'project_completed',
  external_id: project.id,
  pillar_id: 'skills',
  metadata: {
    date: new Date().toISOString().slice(0, 10),
    title: project.name,
  },
});
```

### Step 6 — (Optional) Push LearningAI stats to GRIND OS

This lets GRIND OS show LearningAI progress in future panels.

```ts
import { publishStats } from './lib/grindos-connector';

await publishStats(supabase, userId, 'learningai', {
  tasks_completed: totalTasksCompleted,
  projects_completed: totalProjectsCompleted,
  current_phase: currentPhase.name,
  active_project_name: activeProject?.name ?? null,
  total_hours_logged: totalHoursLogged,   // if you track time
});
```

Call this whenever progress changes (debounce by a second or two is fine).

### Step 7 — (Optional) Show GRIND OS stats inside LearningAI

```ts
import { readGrindOSStats } from './lib/grindos-connector';

const grindStats = await readGrindOSStats(supabase, userId);
if (grindStats) {
  // grindStats.level          → user's GRIND OS level
  // grindStats.current_streak → current streak in days
  // grindStats.today_completed / grindStats.today_total → today's progress
  // grindStats.total_xp       → all-time XP
}
```

---

## How GRIND OS Processes These Events

1. `useConnectorFeed` (in GRIND OS) subscribes to `activity_events` via Supabase Realtime.
2. When a new event arrives for `source_app = 'learningai'`, it looks up the `connector_registry` row for this user.
3. If the user has linked a routine (via Settings → Connected Apps), it calls `completeRoutine(linkedRoutineId, date)`.
4. Multiple task completions on the same day are collapsed into one routine completion (idempotent via daily count tracking).
5. XP, streak, and momentum flow through GRIND OS's existing engine automatically.

---

## What the User Still Needs to Do in GRIND OS

After LearningAI calls `registerApp`, the user goes to:
**GRIND OS → Settings → Connected Apps → LearningAI → picks a "Skills & Learning" routine to auto-complete**

That's it. From that point, every task completion in LearningAI triggers the linked routine.

---

## Supabase Tables Used

All tables already exist — the LearningAI agent does NOT need to run any SQL migrations.

| Table | Used by LearningAI |
|---|---|
| `connector_registry` | `registerApp` writes here (upsert) |
| `activity_events` | `publishEvent` inserts here |
| `connector_stats` | `publishStats` upserts here |
| `grindos_stats` | `readGrindOSStats` reads from here |

RLS policies ensure each user can only access their own rows. No admin access needed.

---

## Debugging Checklist

- [ ] `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` match GRIND OS values exactly
- [ ] User is authenticated (same account) in both apps before any SDK calls
- [ ] `registerApp` is called after auth — row should appear in Supabase → Table Editor → `connector_registry`
- [ ] `publishEvent` is called with `metadata.date` set to `'YYYY-MM-DD'` format
- [ ] In GRIND OS Settings → Connected Apps, the LearningAI row is enabled and a routine is selected
- [ ] After a task completion in LearningAI, check `activity_events` in Supabase — `processed_at` should fill in within a few seconds when GRIND OS is open
