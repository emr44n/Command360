# MASTER /goal CONDITIONS — Command 360 (Phases 0–7)

> Use with `MASTER_GOAL_BUILD_PROMPT.md` and spec files `00`–`16`.
> **How:** paste **one phase block** as the active `/goal`. Advance to the next
> phase **only** when *every* DONE-WHEN line is independently verified (a passing
> test, a clean `npx tsc --noEmit`, or the exact UI action performed). After each
> phase, write a 3-line note: what changed · what to verify · what's next.
>
> **Standing rules (apply to every phase):** Phase 0 is a hard gate — no feature
> work until it passes. Use the repo's own design tokens/classes only (file `15`)
> — never invent values. Keep the locked naming (file `02`). Accessibility from
> the start. `npx tsc --noEmit` must be clean at the end of every phase.

---

## Phase 0 — Tenancy & security  *(BLOCKER — do first)*
**GOAL:** A lawful, isolated multi-tenant base. No world-readable data.
**DONE-WHEN:**
- `organisations` + `memberships` (user ↔ org with `role`) tables exist; migration applied.
- Every data table carries `org_id`; **`grep -ric "using (true)"` across all SQL returns `0`.**
- All RLS policies scope reads/writes by `org_id` + role; an automated isolation test proves a user in Org A reads 0 rows and is write-denied for Org B data, and it passes in CI.
- Participants join via link/QR + Group name on a scoped session token — no account, no required PII columns.
- Supabase **and** Vercel in London (eu-west-2); admin MFA on; audit-log table writing; PITR/backups on; default decision-log retention/auto-wipe set.
- `npx tsc --noEmit` clean; app boots.

## Phase 1 — Data model & IA
**GOAL:** Scenarios are first-class; the 7-area shell exists.
**DONE-WHEN:**
- New tables `scenarios → views → phases → injects → actions` (+ `hotspots`/`layers`) with FKs, all `org_id`-scoped + RLS; migration applied.
- A stable data-access layer (service/repo) wraps them; the editor reads/writes **only** through it.
- Nav + routes exist for all 7 areas — Home / Studio / Library / Classroom / Live / Debrief / Admin — with one unified "New" and a per-org dashboard.
- Konva transform/rotation bug fixed: rotate a placed object, reload, geometry persists correctly.
- `npx tsc --noEmit` clean.

## Phase 2 — Command Studio (the editor)
**GOAL:** A scene can be authored and exported in-browser.
**DONE-WHEN:** In Studio you can —
- drop a backplate and add a layer from the Library panel (grid/list, search, hover-preview, Placed tab, broken-event flag);
- edit it in the inspector (Transform / Layout / Appearance / Fill / Looks) with two-way assign-to-canvas;
- scrub a timeline (tracks, trim handles, audio waveform, keyframe + auto-keyframe, collapse) and use layers / shapes / free-transform / zoom / full-screen;
- set playback (once / loop / ping-pong / hold + enter / exit / both + speed / delay);
- export an **MP4 + a still** via MediaRecorder.
- `npx tsc --noEmit` clean.

## Phase 3 — VFX, transparency & cut-out tools
**GOAL:** Legal, $0, in-browser visual tooling.
**DONE-WHEN:**
- On upload, choosing a source-type sets the correct default blend + sliders (blend/opacity/brightness/hue) per file `08` (FX→screen, white-bg→multiply, keyed→normal, solids→packed-alpha).
- A solid (person/vehicle) renders with **true alpha** via packed-alpha MP4 + WebGL shader — not see-through, no WebM.
- Background removal runs in-browser via **Transformers.js + RMBG** (no `@imgly`, no paid API), $0 per use.
- A polygon / lasso / magic-wand mask cuts a window hole so fire shows through (Konva clip).
- Erase/restore brushes paint the alpha mask inside the reusable pop-up panel.
- `npx tsc --noEmit` clean.

## Phase 4 — Library, characters & cards
**GOAL:** Content tooling + a starter library.
**DONE-WHEN:**
- Library has category/subcategory + sector tags; admin upload flow runs source-type → categorise → Looks → playback → save.
- A character is **one set, many Looks** (idle/walk-in/kneeling/injured + ethnicity/uniform variants); casualty/triage workflow selectable.
- Card/media creator (single-frame Konva mode) builds plain / social / news / message / phone-call cards from copyright-safe templates (own iconography, no real logos), with audio + transcript and Stage/phone destinations.
- `npx tsc --noEmit` clean.

## Phase 5 — Command Classroom
**GOAL:** Taught group delivery runs end-to-end.
**DONE-WHEN:** You can —
- build a TDE from blocks; participants join and self-name **Groups** via QR + short numeric code;
- assign **Paths** (same or different content per group);
- run a **Decision block** in both **Open** (individual) and **Locked** (one device per group) modes;
- reveal the **Plenary** (one-at-a-time or grid) and view branch logic in the **flow-map** (React Flow);
- show the title/loading screen and drive run controls.
- `npx tsc --noEmit` clean.

## Phase 6 — Command Live
**GOAL:** Immersive crew assessment runs live.
**DONE-WHEN:** You can —
- run a Scenario and fire injects (actions top-to-bottom, linked actions play **together**, **Wait** inserts a timed gap);
- switch **Views** and trigger **hotspots/Looks**;
- cut Views in the **multiviewer**, including a **CCTV** slide type + label set;
- push **Cards** to participant phones (second screen) and **live-edit mid-run**;
- realtime sync reuses the existing `STUDIO_EVENT_TRIGGERED` loop (no new channel).
- `npx tsc --noEmit` clean.

## Phase 7 — Debrief & evidence
**GOAL:** The regulator-ready record ships (the deal-closer).
**DONE-WHEN:**
- Debrief mode shows the decision log + timeline replay + analytics + AI summary.
- You can export a **branded evidence PDF** and a **CSV/XLSX**.
- Decision logs **auto-wipe by default** unless the org opts to retain.
- `npx tsc --noEmit` clean.

---

### Fast-follow (not a launch gate)
`distort` action · objectives↔framework mapping + assessor scoring · LMS export
hooks · synthesised character voice · light theme · asset-production methodology.
