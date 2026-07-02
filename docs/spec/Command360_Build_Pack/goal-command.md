# The build kickoff prompt.
# Paste the block below into Claude Code / Antigravity to start.
# (Optional: save this file to .claude/commands/goal.md to run it as /goal.)

Read CLAUDE.md in the repo root, then read the spec pack in docs/spec/ — START WITH 24_REPO_REALITY_MAP.md and 25_DATA_FLOW_AND_CHANGE_IMPACT.md (what exists + how data flows downstream), then MASTER_GOAL_BUILD_PROMPT.md, spec files 00–34, and MASTER_GOAL_CONDITIONS.md.

Work on a NEW branch `build/goal` — never commit to main. My live site stays untouched until I review and merge.

FIRST, before any coding: produce a written reconciliation plan — for each spec entity, name the existing table/route/component and state whether you will adapt / relabel / build. ADAPT existing code; do NOT create duplicate tables or rename storage without a data-preserving migration (see file 24). Show me this plan at the Phase 0 gate.

Then build the app in phase order 0 → 9. Use the DONE-WHEN checklist in MASTER_GOAL_CONDITIONS.md as the gate for each phase. Plan before coding each phase. Do NOT start a phase until every DONE-WHEN line of the previous phase is verified WITH EVIDENCE (test output, a clean `npx tsc --noEmit`, or the exact UI action performed) and checked by a fresh verifier subagent — a security-reviewer subagent for Phase 0.

Phase 0 is a hard gate: no feature work until tenancy + RLS isolation tests pass and zero USING (TRUE) policies remain.

Use subagents within a phase to parallelise independent work and to verify gates, but never run different phases at the same time. Commit after each green phase, write a 3-line note (what changed · what to verify · what's next), and STOP for my review before starting the next phase.

Begin with the reconciliation plan, then Phase 0.
