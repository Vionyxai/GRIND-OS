# GRIND OS — Architecture Reference

Read this file at the start of every session. It covers everything needed to work on this repo without asking the user to paste context.

---

## What It Is

GRIND OS is a mobile-first React PWA for habit tracking with XP/streak/momentum gamification. It's designed to be a **platform**: any external app can plug in via the Connector SDK and feed completions back to GRIND OS automatically.

**Live URL:** deployed on Vercel from the `main` branch.  
**Dev branch:** `claude/grind-os-adhd-routine-2i0ij0`  
**Push target:** both the dev branch and `main`.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 18 + Vite 4 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 + inline styles |
| Icons | lucide-react |
| Backend (optional) | Supabase (auth + DB) |
| Persistence | localStorage (primary source of truth) |
| Target | iOS Safari mobile-first PWA |

---

## Repo Layout

```
connectors/
  TEMPLATE.md                    # Fill this in for any new app, then ask Claude to build the integration
  LEARNINGAI.md                  # Ready-to-use integration brief for the LearningAI Claude agent
src/
  App.tsx                        # Root: state wiring, tab routing, hook composition
  types/index.ts                 # All shared TypeScript types
  pages/
    Today.tsx                    # Today tab — routine checklist
    Pillars.tsx                  # Pillars tab — manage routines by pillar
    Stats.tsx                    # Stats tab — weekly charts
    LevelUp.tsx                  # Level Up tab — XP/badges
    TimeDesign.tsx               # Time tab — 168h/week allocation
    Settings.tsx                 # Settings tab — account, sync, connected apps
  components/
    BottomNav.tsx                # 6-tab bottom nav (Today/Pillars/Time/Stats/Level Up/Settings)
    AuthGate.tsx                 # Magic-link sign-in prompt on first load
  hooks/
    useLocalStorage.ts           # Generic typed localStorage hook
    useDailyLog.ts               # Today's completions, XP, momentum
    useGamification.ts           # Level/streak/badge logic
    useAuth.ts                   # Supabase magic-link auth
    useCloudSync.ts              # Debounced push to grindos_snapshot + grindos_stats
    useConnectorFeed.ts          # Reads connector_registry, processes activity_events
  lib/
    supabaseClient.ts            # Returns null when env vars unset (fully optional)
    grindos-connector.ts         # Plug-and-play SDK — copy this into any external app
  data/
    pillars.ts                   # DEFAULT_PILLARS (6 pillars)
    defaultRoutines.ts           # DEFAULT_ROUTINES (starter set)
  utils/
    storage.ts                   # KEYS map + getItem/setItem/export/import/reset
    dates.ts                     # getTodayString()
supabase/migrations/
  0001_init.sql                  # 6 core tables
  0002_connectors.sql            # 3 connector platform tables + drop hardcoded CHECK
CLAUDE.md                        # This file
```

---

## localStorage Keys (`src/utils/storage.ts`)

| Key constant | localStorage key | Content |
|---|---|---|
| `KEYS.PILLARS` | `grindos_pillars` | `Pillar[]` |
| `KEYS.ROUTINES` | `grindos_routines` | `Routine[]` |
| `KEYS.LOGS` | `grindos_logs` | `DailyLog[]` |
| `KEYS.PROFILE` | `grindos_profile` | `UserProfile` |
| `KEYS.WEEK_SUMMARIES` | `grindos_week_summaries` | `WeekSummary[]` |
| `KEYS.INITIALIZED` | `grindos_initialized` | `'true'` |
| `KEYS.TIME_CATEGORIES` | `grindos_time_categories_v2` | `TimeCategory[]` |
| `KEYS.INTEGRATION_SETTINGS` | `grindos_integration_settings` | legacy (unused) |
| `KEYS.LEARNINGAI_DAILY_COUNTS` | `grindos_learningai_daily_counts` | `Record<"app_id:date", number>` — idempotency counter |

---

## Supabase Schema

### `0001_init.sql` — Core tables

| Table | Purpose |
|---|---|
| `grindos_snapshot` | Full localStorage JSON backup per user — cloud sync source of truth |
| `grindos_stats` | Flat queryable metrics (level, xp, streak, today numbers) — for external apps to SELECT |
| `learningai_progress` | LearningAI's JSON backup (written by LearningAI) |
| `learningai_stats` | LearningAI's flat metrics (kept for backwards compat) |
| `activity_events` | Cross-app event bus — connectors INSERT, GRIND OS reads + marks processed |
| `integration_settings` | Legacy per-user settings (superseded by connector_registry) |

### `0002_connectors.sql` — Connector platform (RUN THIS SECOND)

| Table | Purpose |
|---|---|
| `connector_registry` | `(app_id, user_id)` PK — registered apps, their pillar, linked routine IDs, enabled flag |
| `connector_snapshots` | Full-state backup per app per user (generalises `learningai_progress`) |
| `connector_stats` | Flat metrics per app per user, flexible JSON shape |

Also drops the `activity_events.source_app` CHECK constraint so any connector can write events.

All tables use `auth.uid() = user_id` RLS — no changes needed as user count grows.

---

## How the Connector System Works

1. **External app calls `registerApp()`** (once, on startup, idempotent):
   - Writes a row to `connector_registry` with `app_id`, `display_name`, `pillar_id`, `linked_routine_ids: []`
   - GRIND OS user then uses Settings → Connected Apps to pick which routine to link

2. **External app calls `publishEvent()`** when something is completed:
   - Inserts a row in `activity_events` with `source_app`, `event_type`, `external_id`, `metadata.date`
   - GRIND OS's `useConnectorFeed` picks it up via Supabase Realtime (live) or on next load (backfill)

3. **GRIND OS processes the event**:
   - Looks up the connector row in `connector_registry` for this `source_app`
   - Calls `completeRoutine(linkedRoutineId, date)` — same function the UI uses
   - XP/streak/momentum flow through the existing engine untouched
   - Marks the event `processed_at` so it's never double-counted
   - Multiple completions from the same app on the same day collapse to one routine completion via `dailyCounts`

4. **External app can call `readGrindOSStats()`** to show GRIND OS progress in its own UI.

### SDK file for external apps

Copy `src/lib/grindos-connector.ts` into any app. It exports:
- `registerApp(supabase, userId, { app_id, display_name, pillar_id, linked_routine_ids })`
- `publishEvent(supabase, userId, { source_app, event_type, external_id, pillar_id, metadata })`
- `publishStats(supabase, userId, appId, stats)`
- `readGrindOSStats(supabase, userId)` → `GrindOSStats | null`

External app needs: same `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`, shared Supabase auth.

---

## Key Patterns

### localStorage is the source of truth
Supabase is a mirror/backup. `useCloudSync` debounces 2500ms then upserts to `grindos_snapshot` (full JSON) and `grindos_stats` (flat metrics) in parallel. Pull overrides localStorage then reloads the page.

### Stale closure fix — `stateRef`
Stable `useCallback`s (like `pushSnapshot`) capture current values via a ref that's updated every render:
```ts
const stateRef = useRef({ routines, logs, profile });
stateRef.current = { routines, logs, profile };
// Inside callback:
const { routines: r, logs: l, profile: p } = stateRef.current;
```

### Optional Supabase
`src/lib/supabaseClient.ts` returns `null` when `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are unset. Every hook that uses Supabase guards with `if (!supabase || !session) return;`. App runs fully offline with zero changes.

### `completeRoutine`/`uncompleteRoutine` with `targetDate`
`useDailyLog` accepts an optional `targetDate: string` so connectors can credit past dates (e.g. LearningAI task completed yesterday).

### Daily counts idempotency
`KEYS.LEARNINGAI_DAILY_COUNTS` stores `Record<"source_app:date", number>`. First completion → call `completeRoutine`. Subsequent completions same day → just increment counter. When counter drops to 0 on uncompletion → call `uncompleteRoutine`. Prevents double-completing/uncompleting routines.

---

## Pillars

| id | name |
|---|---|
| `health` | Health & Body |
| `money` | Money & Business |
| `relationships` | Relationships |
| `mental` | Mental / Spiritual |
| `skills` | Skills & Learning |
| `leisure` | Leisure & Play |

Routine `activityType` options for health: `gym`, `outdoor`, `sport`, `steps`, `nutrition`, `hydration`.  
Routine `timeOfDay` options: `morning`, `afternoon`, `evening`, `night`, `allday`, `anytime`.

---

## Env Vars

Both GRIND OS and any connector app need these (same values = same Supabase project):
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Set in Vercel dashboard for production. Create `.env.local` for local dev.

---

## Connecting LearningAI (what to tell the LearningAI Claude agent)

1. `npm install @supabase/supabase-js`
2. Add `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` env vars (same values as GRIND OS)
3. Copy `src/lib/grindos-connector.ts` from this repo into LearningAI
4. After user signs in: `await registerApp(supabase, userId, { app_id: 'learningai', display_name: 'LearningAI', pillar_id: 'skills', linked_routine_ids: [] })`
5. On task complete: `await publishEvent(supabase, userId, { source_app: 'learningai', event_type: 'task_completed', external_id: taskId, metadata: { date: 'YYYY-MM-DD', title } })`
6. On task unchecked: same but `event_type: 'task_uncompleted'`
7. Optional: `publishStats(...)` for stats panel, `readGrindOSStats(...)` to show GRIND OS progress

No schema changes in LearningAI's own DB — it's purely a consumer of the shared Supabase project.
