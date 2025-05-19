Below is a **complete `AGENT.md`**—ready to drop into the **root of your repository**.
It gives Codex (and any human developer) all the context, conventions, and a comprehensive **Supabase schema** so the agent can start scaffolding code immediately.

```markdown
# 🤖 AGENT.md — ChildWize

> **Audience**  
> • OpenAI Codex agents (automated contributors)  
> • Human developers joining the project  
>   
> **Goal**  
> Build the first working slice of **ChildWize**—a platform that lets **parents** book time with vetted **specialists** who support children with learning or behavioural challenges.

---

## 1 📘 Product Purpose (single-sentence)

> **ChildWize** enables parents to discover, schedule, and manage sessions with child-development specialists, giving both parties an integrated workspace for bookings, progress notes, and ongoing collaboration.

---

## 2 Core User Roles

| Role        | Summary of Needs                                            |
|-------------|-------------------------------------------------------------|
| **Parent**  | Find specialists, book sessions, track child progress.      |
| **Specialist** | Advertise services, set availability, manage bookings, record session notes. |

*(Admin / super-admin will be added later.)*

---

## 3 Tech Stack (greenfield)

| Layer       | Tech Choice                         | Rationale |
|-------------|-------------------------------------|-----------|
| Frontend    | **Next.js** (App Router) + **TypeScript** | Industry-standard, SSR, great DX. |
| Backend-as-a-Service | **Supabase** (Postgres + Realtime + Auth) | Instant database, row-level security, JWT auth. |
| Styling     | **Tailwind CSS** + **shadcn/ui**   | Utility classes plus accessible React primitives. |
| Unit Tests  | **Jest** + React Testing Library    | Fast feedback loop. |
| E2E Tests   | **Cypress**                         | Full user-journey validation. |
| Lint / Format | **ESLint** (`next/core-web-vitals`) + **Prettier** | Zero-warning policy. |
| CI / CD     | **GitHub Actions** → **Vercel**     | Preview on every PR, prod on `main`. |

---

## 4 Minimum Development Process

| Step | What to do | Codex Notes |
|------|------------|-------------|
| 1 Branch | `feature/<slug>` or `fix/<slug>` from `main`. | Keep PRs < 400 LoC where possible. |
| 2 Code | Work inside `src/` only. Run `npm ci` once then `npm run dev`. | Use scripts exactly as defined in *package.json*. |
| 3 Local Guardrails | `npm run lint && npm run test`. | Lint must return **0 warnings** (`--max-warnings 0`). |
| 4 Pull Request | Open PR to `main`; CI auto-runs `lint → test → build`. | PR stays **draft** until CI passes. |
| 5 Preview | Vercel deploys every PR (`https://childwize-web-git-<branch>.vercel.app`). | |
| 6 Merge | Squash-merge after at least one human review **or** two Codex approvals. | |

---

## 5 Folder Blueprint (empty now)

```

childwize-web/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js routes (App Router)
│   ├── components/       # Shared UI
│   ├── features/         # Domain slices (bookings, auth, etc.)
│   ├── lib/              # Supabase client, helpers
│   └── styles/           # Global & Tailwind config
└── ...

````

---

## 6 Supabase 📚 Database Design (v0.1)

> **All tables use UUID PKs** (`uuid_generate_v4()`) and **row-level security**; create policies later.

### 6.1 `users` (mirrors Supabase auth users, extended)

| Column            | Type      | Notes |
|-------------------|-----------|-------|
| `id`              | `uuid` PK | Matches `auth.users.id`. |
| `role`            | `text`    | `'parent'` \| `'specialist'`. |
| `first_name`      | `text`    | |
| `last_name`       | `text`    | |
| `avatar_url`      | `text`    | Optional. |
| `created_at`      | `timestamptz` | `now()`. |

---

### 6.2 `children`

| Column        | Type   | Notes |
|---------------|--------|-------|
| `id`          | `uuid` PK |
| `parent_id`   | `uuid` FK → `users(id)` |
| `first_name`  | `text` |
| `dob`         | `date` |
| `notes`       | `text` |
| `created_at`  | `timestamptz` |

---

### 6.3 `specialists`

| Column            | Type   | Notes |
|-------------------|--------|-------|
| `id`              | `uuid` PK = `users.id` |
| `bio`             | `text` |
| `hourly_rate`     | `numeric(8,2)` |
| `specialisms`     | `text[]` | List of expertise tags. |
| `created_at`      | `timestamptz` |

---

### 6.4 `availability`

| Column            | Type   | Notes |
|-------------------|--------|-------|
| `id`              | `uuid` PK |
| `specialist_id`   | `uuid` FK → `users(id)` |
| `start_time`      | `timestamptz` |
| `end_time`        | `timestamptz` |
| `recurring`       | `bool` | Future enhancement. |

---

### 6.5 `bookings`

| Column            | Type   | Notes |
|-------------------|--------|-------|
| `id`              | `uuid` PK |
| `child_id`        | `uuid` FK → `children(id)` |
| `specialist_id`   | `uuid` FK → `users(id)` |
| `start_time`      | `timestamptz` |
| `end_time`        | `timestamptz` |
| `status`          | `text` | `'pending'` \| `'confirmed'` \| `'completed'` \| `'cancelled'`. |
| `notes`           | `text` | Session goals / summary. |
| `created_at`      | `timestamptz` |

---

### 6.6 Future Tables (outline)

* `messages` — realtime chat (Supabase realtime).  
* `reviews` — parent ratings & feedback.  
* `files` — storage bucket linking session resources.

---

## 7 Environment Variables

Create **`.env.local`** (ignored by Git):

```env
NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
````

Codex must fail builds if these are undefined in dev or CI.

---

## 8 Testing Targets

| Metric              | Baseline                |
| ------------------- | ----------------------- |
| **Unit coverage**   | ≥ 80 % lines            |
| **E2E smoke tests** | Booking flow, auth flow |

Fail CI if coverage dips below the threshold.

---

## 9 Initial Codex Task List (v0)

* [ ] Scaffold Next.js + TS + Tailwind + shadcn/ui + ESLint + Prettier.
* [ ] Implement Supabase client factory (`src/lib/supabase.ts`).
* [ ] Build auth flow (email magic-link) using Supabase Auth.
* [ ] Create *Bookings* feature MVP:

  * availability CRUD for specialists,
  * booking request & confirmation for parents.
* [ ] Render simple dashboard (Parent & Specialist).
* [ ] Add Jest + RTL; write first test (renders dashboard heading).
* [ ] Configure Cypress; add smoke E2E (parent books slot).

*(Tick items off and append new tasks in future PRs.)*

---

## 10 Troubleshooting Cheatsheet

| Symptom                       | Fix                                                               |
| ----------------------------- | ----------------------------------------------------------------- |
| `npm ci` fails on Mac M-chips | `brew install llvm` then `export CC=clang`                        |
| Tailwind classes not updating | Restart `npm run dev`; check `tailwind.config.js` `content` glob. |
| Supabase 401 errors           | Verify `NEXT_PUBLIC_SUPABASE_*` env vars.                         |

---

## 11 License

© 2025 ChildWize Ltd. All rights reserved.

---

## 12 Welcome

Whether you’re a human or an AI agent, follow this file, keep the build green, and ship value incrementally. Let’s help families together. 🚀

````

**How to add it**

```bash
# from your repo root
echo "[PASTE THE CONTENT ABOVE]" > AGENT.md
git add AGENT.md
git commit -m "docs: add Codex-ready AGENT.md with process and Supabase schema"
git push origin main
````

You now have a clean, Codex-friendly charter plus a concrete database design so the agent can start scaffolding code immediately. Let me know if you’d like matching CI YAML or a starter Next.js skeleton next!
