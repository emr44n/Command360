# CLAUDE.md — Command 360 build rules

Standing rules for any Claude Code / Antigravity session in this repo. Read this first, every session.

## What this is
Command 360 — a browser-based 2D incident-command training platform for UK blue-light services.
Stack: Next.js 16, Supabase (Postgres/Auth/Storage), Konva/react-konva, Zustand, shadcn/Tailwind, Google Gemini.

## Source of truth
The full build spec is in **docs/spec/** (inside the `Command360_Build_Pack_v6` folder). Before building, read:
1. `MASTER_GOAL_BUILD_PROMPT.md` — the build method.
2. Spec files `00`–`17`.
3. `MASTER_GOAL_CONDITIONS.md` — the per-phase DONE-WHEN gates.

## Non-negotiables
- **Build in phase order 0 → 7.** Use the DONE-WHEN checklist in `MASTER_GOAL_CONDITIONS.md` as each phase's gate. Do NOT start a phase until every DONE-WHEN line of the previous one is verified — a passing test, a clean `npx tsc --noEmit`, or the exact UI action performed. After each phase: a 3-line note (changed · verify · next), then STOP for my review.
- **Phase 0 is a hard gate.** No feature work until tenancy + RLS isolation tests pass and zero `USING (TRUE)` policies remain.
- **Design system:** follow the repo's OWN tokens — defined in `src/app/globals.css` and shown on `src/app/page.tsx` (documented in spec file 15). NEVER invent tokens, colours, or fonts. **IGNORE `design-system/command-360/MASTER.md` — it is a stale auto-generated template; `globals.css` wins.**
- **Infrastructure is LOCKED** — see `docs/spec/.../HOSTING_DECISION.md` (Supabase + Vercel in London; Cloudflare in front for DNS/CDN/WAF/DDoS/Turnstile). Do NOT change hosting, add providers, or re-architect infra.
- **Naming is LOCKED** — follow spec file `02` (Command 360 / Command Studio / Command Classroom / Command Live; Build → Run → Debrief; Views → Phases → Injects → Actions).
- **Accessibility** from the start; honour `prefers-reduced-motion`.
- `npx tsc --noEmit` must be clean at the end of every phase.

## Multi-agent
Subagents are allowed WITHIN a phase to parallelise independent work (e.g. one writes the SQL migration while another writes the RLS isolation tests). Do NOT run different phases in parallel — they form a dependency chain.

## Security
Never stage or commit `.env*` files or any secret/key. Secrets live in `.env.local` (local) and Vercel env (prod) only.
