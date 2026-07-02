# MASTER /goal CONDITIONS — Command 360 (Phases 0–9)

> Use with `MASTER_GOAL_BUILD_PROMPT.md` and spec files `00`–`34`.
> **How:** paste **one phase block** as the active `/goal`. Advance to the next
> phase **only** when *every* DONE-WHEN line is independently verified (a passing
> test, a clean `npx tsc --noEmit`, or the exact UI action performed). After each
> phase, write a 3-line note: what changed · what to verify · what's next.
>
> **Standing rules (apply to every phase):** **Build on a `build/goal` branch —
> never commit to `main`; your live site stays untouched until you review the
> Vercel preview and merge.** **ADAPT the existing code, don't rebuild or duplicate
> (file 24 · Repo Reality Map): repo = truth for what exists, spec = truth for what
> it becomes.** **Trace downstream for every change (file 25): change a contract
> (`slide.ts`/`session.ts`/`realtime.ts`) → update every consumer, `tsc` clean, and
> flow-test author→preview→presenter→live→participant→debrief.** Phase 0 is a hard gate — no feature
> work until it passes. Use the repo's own design tokens/classes only (file `15`)
> — never invent values. Keep the locked naming (file `02`). Accessibility from
> the start. **Device targets (file 21): full authoring works on desktop +
> tablet; phone gets the limited set — verified in every phase that ships UI.**
> `npx tsc --noEmit` must be clean at the end of every phase.

---

## Phase 0 — Tenancy & security  *(BLOCKER — do first)*
**GOAL:** A lawful, isolated multi-tenant base. No world-readable data.
**DONE-WHEN:**
- **Reconciliation plan produced first** (file 24): each spec entity mapped to the existing table/route/component with an adapt / relabel / build decision — shown at this gate before feature code.
- `organisations` + `memberships` (user ↔ org with `role`, including `super_admin`) + **`teams`** tables exist; **org licence table + Licence Profiles skeleton** (file 30/31 — all pricing numbers in DB seed data, never hard-coded) created; migration applied.
- **Auth baseline (file 31):** Supabase Auth with TOTP MFA available, **passkeys** where supported, **Sign in with Microsoft (Entra ID)** OAuth enabled, session timeout, Turnstile + rate-limiting on auth; NO SMS OTP, NO Clerk.
- **`org_id` is ADDED to the EXISTING tables** (`presentations`, `slides`, `sessions`, `participants`, `responses`, `qna_*`) and backfilled — **no parallel/duplicate tables created**; existing data preserved (a test proves no row loss).
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
- **ALL migrations applied** (both `migrations/` + `supabase/migrations/` + everything in `MIGRATIONS_TODO.md`); schema matches what the code reads/writes; migrations consolidated into one ordered folder (file 23).
- **Persistence proven:** create a presentation/scenario → it saves to Supabase, appears in the dashboard, and survives reload (no localStorage-only path).
- `npx tsc --noEmit` clean.

## Phase 2 — Command Studio (the editor)
**GOAL:** A scene can be authored and exported in-browser.
**DONE-WHEN:** In Studio you can —
- **use action sequences & Looks (files 33/34):** ghost start/end-frame **Tween authoring** on canvas; **red-invalid Actions** (undefined or deleted target) are flagged, skipped at run-time, and repairable via **Replace target**; **Audio FX presets** (Radio/Telephone/Megaphone/Muffled/Echo/Distant + Pitch, volume separate) apply at playback; an event's actions show as an ordered list (Move / Change state / Show-Hide / Playback / Wait / Volume) with Start: after-previous | with-previous | delay; the **Change-state action** works via the existing `src` mechanic with crossfade; layers carry `assetId`/`currentStateId`; the worked example (walk on → idle → radio → leave) plays correctly;
- drop a backplate and add a layer from the Library panel (grid/list, search, hover-preview, Placed tab, broken-event flag);
- edit it in the inspector (Transform / Layout / Appearance / Fill / Looks) with two-way assign-to-canvas;
- scrub a timeline (tracks, trim handles, audio waveform, keyframe + auto-keyframe, collapse) and use layers / shapes / free-transform / zoom / full-screen;
- set playback (once / loop / ping-pong / hold + enter / exit / both + speed / delay);
- export an **MP4 + a still** via MediaRecorder.
- use the familiar **file menu** (New / Open / Save / Save As / Duplicate / Import / Export) with autosave + dirty indicator (file 20);
- **undo/redo via `zundo`** — document-only (`partialize`), rapid changes coalesced (a drag = one step), Ctrl+Z / Ctrl+Shift+Z / Ctrl+S wired (file 20);
- **export and re-import a `.c360` v2 package** (file 18): system assets by reference, custom assets bundled + deduped; round-trips correctly;
- panels/drawers **slide in/out** (not pop), respecting `prefers-reduced-motion` (file 20).
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
- **Library UX (file 34):** icon filter rail with combined filter+search and tags; three display modes; thumbnail size slider; **micro-loop previews** (auto ~2.5s from ~2s in, adjustable window) animating on hover; **Looks scrub** on thumbnails (cursor sweep / arrows / tablet swipe); inline audio play with waveform; one shared thumbnail-dropdown component in all pickers.
- **Stateful assets (file 33):** multiple uploads group into ONE asset with ordered, named states (auto-thumbnails); library shows one card with a state strip; states reorder/rename reliably; states travel in `.c360` exports.
- **System asset taxonomy (file 30 §3):** admin-editable category tree (characters, vehicles incl. damaged variants, machinery, street furniture, environment/trees, buildings, effects, signage, audio); admin asset manager (upload, tags, blend-mode default); **per-org storage quota metered + enforced** with usage bar (bands: 10/25/50/100 GB — file 30 §2).
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
- show the title/loading screen and drive run controls;
- use the same **file menu + `zundo` undo/redo + slide-in panels** as Studio — **replace the hand-rolled `undoStack` in `SlideEditor` with `zundo`** (file 20);
- **export and re-import a `.c360` v2 deck package** (file 18);
- **Save As / Duplicate** wired in the editor (surface the existing `/duplicate` route), plus Save + autosave + dirty indicator;
- **Classroom Scene works end-to-end (file 28):** `'click'` added to `StudioEvent.trigger`; a Studio-authored Classroom Scene plays its stacked effects **sequentially on click/space** (play once/N/loop + timers honoured); **multi-scene scenario** with bottom-left **jump grid** + next/back (**back = reset-to-step**); **CCTV run controls** (numbered grid, multi-select, number-key hotkeys); presenter **position indicator (green dot)** + push-live panel; **drag-reorder + double-click rename + group-move are rock solid** (explicit tests — xVR's known failure);
- **Video in Classroom (file 26):** `video` added to `CanvasElement.type` and rendered in ALL canvas renderers (editor/preview/presenter/participant) with image-parity treatments (feather/border/mask/opacity/blend) + playback settings (autoplay/controls/loop/mute); upload compresses client-side to 720p (1080p option), **≤~50MB per clip**, per-org GB quota enforced + shown; **WebM supported** with detect-and-hide contingency for unplayable clips; export shows total scenario+asset size;
- **News ticker element (file 27):** create via pop-up (brand block default C360 NEWS/red/logo, white bg/black text, multi-paragraph scrollable text), draggable/stretchable, continuous right→left loop starting full, speed control, editable in the properties panel, renders in all views;
- **Slide Masters are account/org-level** (not per-presentation), persist in the DB, with a **master editor pop-up** (background/boxes/add images) and a **page-number element**; new decks default to blank but can pick any account master (file 22).
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

## Phase 8 — Templates, Sharing & Community  *(post-launch)*
**GOAL:** Users can save, share and discover scenarios/decks/asset packs.
**DONE-WHEN:**
- **Accounts & teams (file 31):** super-admin creates orgs with full profile (logo/agency category/contacts) + assigned Licence Profile; org owner invites members by email (branded Resend invite → self-set password + MFA); teams + share scopes work; **Licence Profiles CRUD** (price/uplift/users/GB/features as editable DB data) with per-org overrides; **quote/licence-agreement generator** → branded PDF + shareable link, emailed via Resend, visible in the client's account settings, renewal reminders T-90/60/45.
- **PPTX export (file 32 §2):** decks export to real .pptx (text/images/masters native; interactive slides as static snapshots; scenes as poster-frame PNG or embedded MP4, size shown).
- **Licensing & trial (file 30 §1):** 14-day trial → **read-only lockout** (see work, can't create/edit/run/upload/export), banner + contact CTA, grace period + Resend reminders; super-admin sets trial/licence dates, band, quota; **enforcement is server-side** (RLS/route handlers), audit-logged.
- **Super-admin console (file 30):** licence management, org search, per-org usage/storage, platform analytics dashboards (MAU/WAU, scenarios created/run, sessions, most-active-clients ranking, renewals due), CSV export; GA4 setting for marketing pages only.
- **News CMS (file 30 §4):** `news_posts` table feeding the EXISTING News pages + RSS route; block editor (heading/text/image/video-embed/quote) with hero upload, draft→publish; **Gemini AI assist** (paste URL or subject → draft, human review, never auto-publish); optional RSS-ingest suggestions.
- **Community management (file 30 §5):** admin publishes official templates, features/pins, moderates shared content.
- Tables `templates`, `template_shares` (+ optional `template_installs`) exist, all `org_id`-scoped + RLS; community items are public-read to authenticated users, writes scoped to the caller's org (file 19).
- **Save as Template** from a scenario/deck; **Use/Import** creates an independent editable copy in the user's workspace (original untouched).
- **Share** to a chosen **user or organisation** (search/pick) → appears in their "Shared with me".
- **Share to Community** → item appears in a **grid/list** browse (reusing the existing toggle), filterable by **category** (Studio / Classroom / social assets / CCTV / …) and sector, each card showing **accreditation** (owner org, dates, title, description, version).
- Stored/transferred as a **`.c360` v2 package** (file 18); import security rules enforced.
- `npx tsc --noEmit` clean.

## Phase 9 — Integration, persistence & security hardening  *(final gate)*
**GOAL:** The whole system works together, saves everything, and withstands scrutiny.
**DONE-WHEN:**
- **Full journeys pass end-to-end:** build a deck/scenario → Save/Save As → reopen → **Preview** → **live session** (QR join, injects, multiviewer, second-screen cards) → **Debrief** → evidence export. No broken links, no lost data.
- **Every slide type renders correctly in editor, preview, presenter AND participant** views (all three renderers consistent), and the **slide-master snapshot renders in ALL views** (fix the presenter/participant gap, file 25) — ideally via one shared renderer.
- **Realtime chain verified:** every `BroadcastEvent` has a matching emitter + receiver; live sync works presenter↔participant.
- **Everything persists** and is visible on reload; backups/PITR on; no localStorage-only paths remain (file 23).
- **Integration + regression tests** green across all phases; new wiring (masters↔slides, cards↔second screen, injects↔live) tested and doesn't regress the other side.
- **Security/abuse (government-grade):** Phase 0 org-isolation tests still pass; **Turnstile** on public forms/auth/join; `.c360` import validation (no external fetches, zip-bomb/size caps); no secrets in the client bundle; rate-limiting on public endpoints; Cloudflare WAF/DDoS in front.
- **Standard-software basics checklist (file 32 §1) verified item-by-item:** Open/Recent, rename everywhere, trash+30-day restore, global search, notifications, audit log, profile management, offboarding `.c360`+CSV export, duplicate everywhere, announcements.
- **PPTX export verified:** exported file opens in PowerPoint with text/images/master intact; embedded scene video plays.
- **Licensing verified server-side:** writes attempted as an expired-trial org FAIL at the API; quota enforcement blocks over-quota uploads; CMS publish flow works end-to-end.
- **Marketing content update shipped (file 29):** home, product, command-studio, about, solutions pages describe the real feature set (Classroom Scene, video, ticker, effects, masters) — copy-only, v5 design untouched.
- Desktop + tablet layouts verified (file 21); `npx tsc --noEmit` clean; a fresh verifier subagent signs off.

---

### Fast-follow (not a launch gate)
- **Multi-instructor co-director:** a second logged-in instructor manipulates a running Classroom Scene/scenario live while the first presents. Feasible on the existing realtime channel, but requires a control-authority model first (director role token + presence + conflict rule). Role-gated; build only after single-operator scenes are solid.
`distort` action · objectives↔framework mapping + assessor scoring · LMS export
hooks · synthesised character voice · light theme · asset-production methodology.
