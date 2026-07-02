# 23 · Persistence, Migrations & End-to-End QA

*Addition to the spec pack. Guarantees that everything the app builds is actually saved, that the database matches what the code expects, and that every feature is tested together — no silent data loss, no conflicts. Critical for a government-grade system.*

## 1. Apply ALL migrations — no schema drift
The repo ships migrations that are **not yet applied** to the live database (tracked in `MIGRATIONS_TODO.md`), and migrations are split across `migrations/` and `supabase/migrations/`. The build MUST:
- Apply **every** migration in both folders **and** everything in `MIGRATIONS_TODO.md` (idempotent `IF NOT EXISTS`), then confirm the live schema matches what the code reads/writes.
- Consolidate migrations into **one ordered, timestamped folder** (`supabase/migrations/`) going forward; remove the ad-hoc `migrations/` split. Every future schema change ships as a migration — never an undocumented column.
- After Phase 0's tenancy work, re-check: every table the app touches exists, carries `org_id`, and is RLS-scoped.

## 2. Persistence is real — no localStorage fallback in production
Several features degrade to per-device `localStorage`/`sessionStorage` when their column/table is missing (e.g. slide masters, view modes, favourites). That is a **dev fallback only**. The build MUST ensure, in production:
- **Every** create/edit of a presentation, slide, scenario, master, template, asset, session or setting **persists to Supabase**, survives reload, and **syncs across devices/users in the org**.
- **Round-trip gate:** create X → reload → X is present and identical. **Dashboard gate:** creating a new presentation/scenario makes it **appear in the dashboard immediately**, owned by the org.
- **Save / Save As / Duplicate:** wire **Save As** in the editors (the backend `/api/presentations/[id]/duplicate` route already exists — surface it), alongside Save, autosave and a dirty indicator (file 20).

## 3. Integration & regression testing (test every function, no conflicts)
Each phase adds tests; the build must not break earlier phases:
- **Per phase:** unit + integration tests for the new functions, plus a quick regression run of prior phases' tests. A phase is not done if it breaks an earlier gate.
- **Wiring checks:** when a new feature connects to an existing one (e.g. masters ↔ slides, cards ↔ second screen, injects ↔ live), add a test that the connection works end-to-end and doesn't regress the other side.
- **Fixtures:** seed a test org + user so isolation and persistence can be asserted in CI.

## 4. Phase 9 — end-to-end hardening (final gate)
A dedicated final pass verifying the whole system works together:
- **Full user journeys** pass: build a deck/scenario → save → reopen → **Preview mode** → run a **live session** (join via QR, injects, multiviewer, second-screen cards) → **Debrief** → evidence export. No broken links, no lost data.
- **Persistence:** every artifact from those journeys is saved, backed up (PITR/daily backups), and visible on reload.
- **Security & abuse (government scrutiny):** re-run the Phase 0 org-isolation tests; confirm **Turnstile** on public forms/auth/join; confirm `.c360` import validation (no external fetches, size/zip-bomb caps); confirm no secrets in the client bundle; confirm rate-limiting on public endpoints; Cloudflare WAF/DDoS in front.
- **Cross-cutting:** desktop + tablet layouts verified (file 21); `npx tsc --noEmit` clean; a fresh verifier subagent signs off.
