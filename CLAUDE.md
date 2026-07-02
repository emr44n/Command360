# CLAUDE.md — Command 360 build rules

Standing rules for any Claude Code / Antigravity session in this repo. Read this first, every session.

## What this is
Command 360 — a browser-based 2D incident-command training platform for UK blue-light services.
Stack: Next.js 16, Supabase (Postgres/Auth/Storage), Konva/react-konva, Zustand, shadcn/Tailwind, Google Gemini.

## Source of truth
The full build spec is in **docs/spec/** (inside the `Command360_Build_Pack` folder). Before building, read:
1. `MASTER_GOAL_BUILD_PROMPT.md` — the build method.
2. Spec files `00`–`34` (start with **24 · Repo Reality Map** and **25 · Data Flow & Change-Impact Map**).
3. `MASTER_GOAL_CONDITIONS.md` — the per-phase DONE-WHEN gates.

## Working on a LIVE codebase — ADAPT, don't rebuild (read `24_REPO_REALITY_MAP.md`)
This repo already exists and partly works. Most breakage comes from the agent inventing new tables/APIs or duplicating features that exist under a different name.
- **Golden rule:** the **repo** is the truth for what EXISTS and what it's NAMED; the **spec** is the truth for what it should BECOME. When they differ on a name, do NOT invent a third thing — adapt in place.
- **Build on a branch, never commit to `main`.** Create a `build/goal` branch; commit each green phase there. `main` stays deployable and your live site is untouched until YOU review the Vercel preview and merge. This is your safety net — nothing ships to production without your say-so.
- **No duplicate tables.** Never create `scenarios`/`decks` that duplicate `presentations`. If new tables are truly needed, they must reference + migrate existing rows — never orphan `presentations`/`slides`.
- **Never rename a table/column without a data-preserving migration** + updating all references + a test proving no data loss. Prefer changing only the UI label. Terminology (Command Studio/Classroom/Live, Group, join code) is UI-layer; storage keeps its names.
- **Grep before you build.** Many features are partially built (slide masters, templates, duplicate route, `.c360`, live via `sessions`). Check what's there and adapt — don't rebuild.
- **Trace downstream for every change (file 25).** The contracts are `types/slide.ts`, `types/session.ts`, `types/realtime.ts`. Each slide type has THREE renderers (editor form / presenter display / participant input) + shared canvas/master renderers + realtime emitter/receiver. When you change a field: grep every consumer, update them together, get `npx tsc --noEmit` clean (it flags type-level breaks), and **flow-test the item end-to-end** (author→save→preview→presenter→live→participant→debrief) — `tsc` won't catch a missing renderer. Prefer extracting ONE shared renderer over editing four. (Known gap to fix: the master snapshot isn't rendered in presenter/participant.)
- **FIRST TASK, before any coding:** produce a written **reconciliation plan** — for each spec entity, name the existing table/route/component and state adapt / relabel / build — and show it to me at the Phase 0 gate.

## How to build (best practice — keep quality high, avoid drift)
- **One phase per working session.** Build in order 0 → 9. Performance degrades as context fills, so do NOT try to build everything in one giant context — finish a phase, commit, then start the next fresh.
- **Plan before coding.** At the start of each phase, write a short plan of how you'll meet the DONE-WHEN gate, then implement. Don't jump straight to code (it solves the wrong problem).
- **Show evidence, never assert.** For every DONE-WHEN line, show the proof — the test output, the command you ran and what it returned, the clean `npx tsc --noEmit`, or a screenshot. "Done" without evidence is not done.
- **Verify with a fresh subagent.** After building a phase, spin up a separate **verifier subagent** (fresh context) to check the work against the gate and try to refute it — the agent that built it must not be the one that grades it. For **Phase 0**, use a **security-reviewer subagent** for the tenancy/RLS isolation specifically.
- **Scope reviews to correctness.** The verifier flags only gaps that affect correctness or the stated requirements — do not over-engineer or add defensive code for cases that can't happen.
- **Persistence & migrations (file 23):** apply ALL migrations (both migration folders + `MIGRATIONS_TODO.md`); every create/edit must save to Supabase, survive reload, and appear in the dashboard — **no localStorage-only fallback in production.**
- **Test every function (file 23):** each phase adds unit + integration tests and a quick regression run of earlier phases; new wiring between features must be tested end-to-end and must not regress the other side.
- **Commit after each green phase** (a rollback point), then write a 3-line note (changed · verify · next) and **STOP at the gate for my review.**
- **If the spec is ambiguous or you're unsure, STOP and ask — do not guess or invent.**

## Non-negotiables
- **Phase 0 is a hard gate.** No feature work until tenancy + RLS isolation tests pass and zero `USING (TRUE)` policies remain.
- **Design system:** follow the repo's OWN tokens — defined in `src/app/globals.css` and shown on `src/app/page.tsx` (documented in spec file 15). NEVER invent tokens, colours, or fonts. **IGNORE `design-system/command-360/MASTER.md` — it is a stale auto-generated template; `globals.css` wins.**
- **Commercials are DATA, not code (file 31):** all pricing/bands/uplift live in Licence Profiles seed data, editable in super-admin — never hard-code prices. PPTX export and the file-32 basics (trash/restore, search, audit log, notifications, offboarding export) are DAY-ONE launch items, not fast-follows.
- **Auth is Supabase (LOCKED)** — do NOT introduce Clerk or any other auth provider; the `super_admin` role and org licence model live on Supabase Auth + RLS (file 30). **Licence enforcement is server-side** (RLS/route handlers), with the 14-day-trial read-only lockout per file 30.
- **Infrastructure is LOCKED** — see `docs/spec/.../HOSTING_DECISION.md` (Supabase + Vercel in London; Cloudflare in front for DNS/CDN/WAF/DDoS/Turnstile). Do NOT change hosting, add providers, or re-architect infra.
- **Naming is LOCKED** — follow spec file `02` (Command 360 / Command Studio / Command Classroom / Command Live; Build → Run → Debrief; Views → Phases → Injects → Actions).
- **Editors feel like familiar software** (file 20): consistent file menu (New/Open/Save/**Save As**/Duplicate/Import/Export — the `/duplicate` route already exists, surface it), real **undo/redo via `zundo`** (document-only via `partialize`, rapid changes coalesced), autosave + dirty indicator, panels that slide in/out (not pop).
- **Classroom Scene (file 28):** Studio-authored, click/space-driven sequential playback in Classroom — add `'click'` to `StudioEvent.trigger` and a shared run-time controller; do NOT embed the live event engine or bake scenes to video. Back = reset-to-step. Reorder/rename/group must be rock solid (tested).
- **Video (file 26):** add `video` to `CanvasElement.type` (update ALL canvas renderers); client-side compression to 720p, ≤~50MB/clip, per-org quota; WebM supported with detect-and-hide fallback; Chrome/Chromium is the stated requirement.
- **Slide Masters (file 22):** account/org-level master library (not per-presentation), DB-persisted, with a master editor pop-up + page-number element; build on the existing `slide-masters.ts` snapshot model, don't rewrite it.
- **Portable format** (file 18): export/import is the **`.c360` v2 ZIP package** — system assets by reference, custom assets bundled + deduped by hash; treat every import as untrusted (validate, no external fetches).
- **Device targets** (file 21): full authoring on desktop + tablet; phone gets a limited set, with a "best on tablet/desktop" notice on authoring screens.
- **Accessibility** from the start; honour `prefers-reduced-motion`.
- `npx tsc --noEmit` must be clean at the end of every phase.

## Multi-agent
Subagents are allowed WITHIN a phase to parallelise independent work (e.g. one writes the SQL migration while another writes the RLS isolation tests) and to verify gates (above). Do NOT run different phases in parallel — they form a dependency chain.

## Security
Never stage or commit `.env*` files or any secret/key. Secrets live in `.env.local` (local) and Vercel env (prod) only. Validate and sandbox all imported `.c360` files.
