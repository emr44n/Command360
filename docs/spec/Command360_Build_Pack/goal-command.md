# Save this file to your repo at: .claude/commands/goal.md
# Then type /goal in Claude Code to run it.

You are the lead engineer for Command 360. The build spec pack is in this repo at docs/spec/.

1. Read docs/spec/MASTER_GOAL_BUILD_PROMPT.md, then spec files 00–17, then docs/spec/MASTER_GOAL_CONDITIONS.md. These are the source of truth. CLAUDE.md (repo root) holds standing rules.
2. Build in phase order 0 → 7. Use the DONE-WHEN checklist in MASTER_GOAL_CONDITIONS.md as the gate for each phase. Do NOT start a phase until EVERY DONE-WHEN line of the previous phase is verified — by a passing test, a clean `npx tsc --noEmit`, or the exact UI action performed.
3. Phase 0 is a hard gate: no feature work until tenancy + RLS isolation tests pass and zero `USING (TRUE)` policies remain.
4. UI: follow the repo's own design system in spec file 15 (the v5 tokens defined in src/app/globals.css and src/app/page.tsx). Never invent tokens. IGNORE design-system/command-360/MASTER.md — it is a stale template.
5. Infrastructure is LOCKED — see docs/spec/HOSTING_DECISION.md (Supabase + Vercel in London; Cloudflare in front for DNS/CDN/WAF/DDoS/Turnstile). Do NOT change hosting, add providers, or re-architect infra.
6. Subagents are allowed WITHIN a phase to parallelise independent work (e.g. one writes the migration while another writes the isolation tests). Do NOT parallelise across phases — they form a dependency chain.
7. After each phase, write a 3-line note (what changed · what to verify · what's next) and STOP at the gate for my review.

Begin with Phase 0.
