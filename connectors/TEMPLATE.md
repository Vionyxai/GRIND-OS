# Connector Template — [APP NAME]

Use this template when adding a new app to GRIND OS.
Fill in each section, then ask the GRIND OS Claude agent to build the integration.
The agent will generate a ready-to-use integration file for your other project's Claude agent.

---

## About This App

**What it does:**
<!-- One paragraph. What does this app do? What problem does it solve for the user? -->

**Stack:**
<!-- e.g. React + Vite + TypeScript, Next.js, Flutter, etc. -->

**Repo / URL:**
<!-- GitHub link or Vercel URL -->

---

## Data Model

<!-- Describe the key data structures in this app. What are the things the user "completes"? -->

**Example: things a user can complete (tasks, lessons, workouts, sessions...):**
```
[paste your types or describe the shape here]
```

**How completions are identified:**
<!-- e.g. task IDs look like 'p1t3', project IDs look like 'project-abc123' -->

**What date field exists:**
<!-- e.g. task.completedAt, session.date, log.createdAt -->

---

## Which GRIND OS Pillar Should This Feed?

- [ ] Health & Body (`health`)
- [ ] Money & Business (`money`)
- [ ] Relationships (`relationships`)
- [ ] Mental / Spiritual (`mental`)
- [x] Skills & Learning (`skills`)  ← default
- [ ] Leisure & Play (`leisure`)

---

## Auth Setup

**Does this app already use Supabase?**
<!-- yes / no — if no, it needs to add @supabase/supabase-js and the shared env vars -->

**Where does Supabase get initialized?**
<!-- e.g. src/lib/supabaseClient.ts -->

**Where does the app know the current user's ID?**
<!-- e.g. supabase.auth.getUser(), a React context, Redux store field -->

---

## Event Triggers

<!-- Where in the code should we call publishEvent()? -->

**On completion:**
<!-- e.g. "when the user checks off a task in TaskList.tsx around line 120" -->

**On uncompletion:**
<!-- e.g. "when the user unchecks the same task" -->

**On startup (for registerApp):**
<!-- e.g. "in App.tsx useEffect after auth check" -->

---

## Notes for the Integration Claude Agent

<!-- Anything else the agent building this integration should know -->
