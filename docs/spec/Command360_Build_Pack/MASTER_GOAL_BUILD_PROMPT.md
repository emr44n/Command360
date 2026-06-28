# MASTER /goal BUILD PROMPT — Command 360

> Paste this as your `/goal`. It assumes the 16 spec files (`00`–`16`) sit alongside it. Read them first; they are the source of truth.

---

## Role & objective

You are the lead engineer building **Command 360** — a browser-based, 2D, AI-assisted incident-command **training and assessment** platform for UK blue-light and regulated industries. It is a flat alternative to 3D simulators (XVR On Scene): an instructor builds a scene from a photo + transparent overlays and runs it live in a browser, voicing characters over a video call.

A substantial codebase already exists (`command360.vercel.app`, ~42k lines — see `14_TECH_STACK_AND_ARCHITECTURE.md`). **Your job is to harden, restructure, and complete it to match this spec — not to rewrite from scratch.** Reuse what's there (especially Command Studio, Konva canvas, the realtime event loop) unless the spec says otherwise.

## How to work

1. **Read all 16 spec files first** (`00`–`16`). `00_README_AND_INDEX.md` orients you.
2. Build in the **phase order** of `16_BUILD_PHASES.md`. Each phase must be shippable and tested before the next.
3. Keep the existing patterns where sound; refactor behind stable interfaces when migrating (e.g. the Scenario data model).
4. After each phase, write a short note of what changed and what to verify.

## Tech stack (keep)

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · shadcn/ui · Zustand · **Konva/react-konva** · @dnd-kit · Supabase (Postgres/Auth/Realtime/Storage) · @google/genai (Gemini) · exports via pptxgenjs/xlsx/jspdf/html2canvas · React Flow for the flow-map. Host Supabase + Vercel in the **London** region.

---

## NON-NEGOTIABLES (do not deviate)

1. **Phase 0 is a hard gate.** Before any feature work: organisations/memberships/roles + replace **every** `USING (TRUE)` RLS with `org_id`+role-scoped policies + isolation tests. World-readable data is a GDPR blocker. (`05`)
2. **Participants have no accounts and no PII by default.** They join via link/QR + a Group name. Name fields optional. Decision logs auto-wipe by default. (`05`, `13`)
3. **Naming is locked.** Use the exact taxonomy in `02` everywhere (UI + code). Never bolt "360" onto a module. Command Studio / Classroom / Live; Build/Run/Debrief; TDEs/Scenarios; Views/Phases/Injects/Actions; Groups/Paths; Looks/Combos/Hotspots.
4. **IA = Home / Studio / Library / Classroom / Live / Debrief / Admin.** One unified "New". Library is first-class. (`03`)
5. **Command Studio is the only creator.** Studio creates → Library holds → Classroom & Live consume. One Konva canvas powers scenes *and* cards (single-frame mode). Don't build a second editor. (`06`, `09`)
6. **Transparency rule (`08`):**
   - bright FX (fire/smoke/light/water) → **screen/add blend on black**
   - white-bg → **multiply**
   - pre-keyed → **normal**
   - **solid objects (people/vehicles/props/dark smoke) → true alpha = packed-alpha MP4 + WebGL shader** (never screen blend; they'd go see-through; never WebM — no iPad)
   - on upload, user picks source-type → system sets default blend + sliders (blend/opacity/brightness/hue) → save.
7. **No third-party stock embedded as the in-app library.** Premium stock (ActionVFX etc.) is legally barred from being shipped inside the product and from AI training. The library must be **owned** — AI-generated originals / commissioned work-for-hire / make-your-own (Particle Illusion, EmberGen, Blender). (`08`)
8. **Cut-out tools are free and in-browser, $0 per use (`08`):**
   - background removal = **Transformers.js + RMBG** (NOT `@imgly` AGPL; NOT paid APIs)
   - masking = **Konva polygon/lasso/magic-wand clip** (cut holes like windows)
   - erase/restore = paint on the alpha **mask**
   - all open in the **reusable pop-up panel** (Photoshop-filter-dialog pattern).
9. **Characters = one set, many Looks** (idle/walk-in/kneeling/injured + ethnicity/uniform variants), pre-rendered transparent loops, **voiced live over Teams**. **No robotic talking-mouth.** (`07`, `11`)
10. **Cards are copyright-safe** — generic-but-legible social/news templates with own iconography, no real logos/trade dress. (`09`)
11. **Reuse the realtime loop** (`STUDIO_EVENT_TRIGGERED` + layer states) for live scenes/cards — don't build a new channel. (`14`)
12. **Accessibility from the start** — keyboard nav, contrast, reduced-motion.
13. **`distort` is fast-follow, not launch.**

---

## Build order (summary — detail in `16`)

- **Phase 0** — Tenancy & security (BLOCKER)
- **Phase 1** — Data model (first-class Scenarios) & IA & dashboards; fix Konva transform bugs
- **Phase 2** — Command Studio editor (panels, timeline, layers, playback, export)
- **Phase 3** — VFX/transparency + BG-removal + masking + erase/restore pop-up
- **Phase 4** — Library, characters (Looks), card/media creator
- **Phase 5** — Command Classroom (TDEs, Groups, Paths, Decision blocks, Plenary, flow-map)
- **Phase 6** — Command Live (inject engine, multiviewer/CCTV, second screen, live-edit)
- **Phase 7** — Debrief & evidence export (PDF + CSV/XLSX, branded)

---

## Acceptance criteria (per area)

- **Tenancy:** a user in Org A cannot read/write any Org B row (proven by tests). No `USING (TRUE)` remains.
- **Studio:** can drop a backplate, add fire (screen blend) + a character (true alpha), set Looks + playback, scrub a timeline, and export an MP4.
- **Cut-out:** can auto-remove a background in-browser ($0), cut a window hole with a polygon mask so fire shows through, and erase/restore in a pop-up panel.
- **Classroom:** can build a TDE, split into Groups via QR, run a Decision block (Open + Locked), and reveal a Plenary.
- **Live:** can run a Scenario, fire injects (actions top-to-bottom, link to play together, Wait gaps), cut Views in the multiviewer, push Cards to participant phones, and live-edit mid-run.
- **Debrief:** can review the decision log/timeline and export a branded evidence PDF + spreadsheet.
- **Privacy:** participants never create accounts; decision logs auto-wipe unless the org opts to keep.

---

## Positioning guardrail (so the build stays true)

Command 360 is a **creation + delivery + record** tool — **not** a competency-marking system, **not** 3D, **not** a talking-avatar product. Keep that in every decision.
