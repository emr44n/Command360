# 16 · Build Phases

Build in this order. Each phase is shippable/testable before the next. The repo already has a lot (file 14) — much of this is **hardening + restructuring + filling gaps**, not greenfield.

---

## Phase 0 — Tenancy & security (BLOCKER, do first)
*Nothing can hold customer data until this is done.*
- Organisations / memberships / **roles** (file 05).
- Replace **all** `USING (TRUE)` RLS with `org_id` + role-scoped policies; add isolation tests.
- Participants: no accounts, no PII; join via link/QR + Group name; scoped session tokens.
- Supabase + Vercel in **London**; MFA on admins; audit logging; backups/PITR; retention/auto-wipe defaults; DPAs + sub-processor list.
**Delivers:** a lawful, multi-tenant base.

## Phase 1 — Data model & IA
- Promote Scenarios to first-class tables (`scenarios → views → layers/phases → injects → actions/hotspots`) behind a stable interface (file 04).
- Stand up the 7-area IA + unified "New" + per-org dashboards (file 03).
- Fix Konva transform/rotation bugs (file 14).
**Delivers:** the skeleton + clean scenario storage.

## Phase 2 — Command Studio (the editor)
- Editor shell: library panel | canvas | inspector + timeline + export bar (file 06).
- Library panel: grid/list, search, hover-preview, Placed tab, broken-event flag.
- Inspector: Transform/Layout/Appearance/Fill/Looks + assign-to-canvas (both ways).
- Timeline: tracks, trim handles, audio waveform, keyframe + auto-keyframe, collapse.
- Layers; shapes; free-transform; zoom; full-screen mode.
- Playback settings (once/loop/ping-pong/hold + enter/exit/both + speed/delay).
- Export (MediaRecorder → MP4 / still).
**Delivers:** the asset factory.

## Phase 3 — VFX, transparency & cut-out tools
- Upload source-type selection → default blend + sliders (file 08).
- Screen/multiply/normal blend + **packed-alpha MP4 shader** for solids.
- **BG removal** (Transformers.js + RMBG, in-browser).
- **Polygon / lasso / magic-wand masking** (Konva clip).
- **Erase/restore** brushes in the **pop-up panel** shell.
**Delivers:** legal, free, in-browser visual tooling.

## Phase 4 — Library, characters & cards
- Category/subcategory library; sector tagging; admin upload flow (source-type → categorise → Looks → playback → save) (file 07).
- Characters as one-set-many-Looks; casualty/triage workflow.
- Card / media creator (single-frame canvas): plain/social/news/message/phone-call; copyright-safe templates; audio+transcript; Stage/phone destinations (file 09).
**Delivers:** content tooling + a starter library.

## Phase 5 — Command Classroom
- TDE builder (blocks); Groups (QR join); Paths; Decision blocks (Open/Locked); Plenary; flow-map view (React Flow) (file 10).
- Title/loading screen; run controls.
**Delivers:** taught group delivery.

## Phase 6 — Command Live
- Run-time inject engine (action catalogue + timing: top-to-bottom, link, Wait) (file 11).
- Views, hotspots, Looks; live-edit during a run; realtime sync (reuse `STUDIO_EVENT_TRIGGERED`).
- Multiviewer + CCTV slide type + label set; second screen (file 12).
**Delivers:** immersive crew assessment.

## Phase 7 — Debrief & evidence
- Debrief mode: decision logs, timeline replay, analytics, AI summary.
- **Evidence export** (PDF + CSV/XLSX, branded) — the deal-closer (file 13).
**Delivers:** the regulator-ready record.

## Fast-follow (not launch)
- `distort` action.
- Optional objectives↔framework mapping + assessor scoring.
- LMS export hooks.
- Synthesised character voice.
- Light theme.
- Asset-production methodology rollout (AI prompts + character sheets — file 08).
