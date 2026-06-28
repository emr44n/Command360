# Command 360 — Build Spec Pack

**One source of truth for building Command 360.** Hand this whole folder to a developer or to Claude Code with the `MASTER_GOAL_BUILD_PROMPT.md`.

This pack consolidates every product, naming, architecture, and UX decision locked during design. It supersedes scattered notes. Where the existing repo differs, **this pack wins** unless a decision here says "keep current behaviour".

---

## What Command 360 is (one line)

A **browser-based, 2D, AI-assisted incident-command training and assessment platform** for UK blue-light and regulated industries — a flat, fast alternative to 3D simulators like XVR On Scene. It is a **delivery and creation tool**, not a competency-marking system.

---

## The three products + the tool

| Thing | What it is | Unit of work |
|---|---|---|
| **Command 360** | The platform / brand | — |
| **Command Studio** | The **build / authoring** tool — the *asset factory*. Makes all imagery, video, effects, cards, scenarios. | Assets, Scenarios |
| **Command Classroom** | **Taught / group** delivery (Menti/Slido-style) | **TDE** (Tactical Decision Exercise) |
| **Command Live** | **Live / individual / crew** immersive assessment | **Scenario** |

**Operating modes (toggle):** `Build → Run → Debrief`

---

## File index — read in this order

| # | File | Covers |
|---|---|---|
| 00 | `00_README_AND_INDEX.md` | This file |
| 01 | `01_PRODUCT_OVERVIEW_AND_POSITIONING.md` | What it is, who it's for, positioning, scope |
| 02 | `02_NAMING_TAXONOMY_AND_GLOSSARY.md` | **Locked** vocabulary + XVR→Command360 mapping |
| 03 | `03_INFORMATION_ARCHITECTURE.md` | The 7-area IA + navigation |
| 04 | `04_DATA_MODEL.md` | Entities, hierarchy, relationships |
| 05 | `05_USER_ROLES_AND_TENANCY.md` | Orgs, roles, multi-tenancy, participants |
| 06 | `06_COMMAND_STUDIO_EDITOR.md` | The editor: canvas, library panel, inspector, timeline |
| 07 | `07_ASSET_LIBRARY_AND_CHARACTERS.md` | Categories, the Looks system, casualty workflow, admin upload |
| 08 | `08_VFX_TRANSPARENCY_AND_MASKING.md` | Blend modes, BG-removal, masking, effects-library strategy |
| 09 | `09_CARD_AND_MEDIA_CREATOR.md` | Social/news/message/phone cards + second screen |
| 10 | `10_COMMAND_CLASSROOM.md` | TDEs, groups, paths, decision blocks, plenary, flow-map |
| 11 | `11_COMMAND_LIVE_AND_INJECT_ENGINE.md` | Scenarios, views, the run-time inject engine + action catalogue |
| 12 | `12_MULTIVIEWER_AND_SECOND_SCREEN.md` | Vision-mixer, CCTV, participant phones |
| 13 | `13_DEBRIEF_AND_EVIDENCE.md` | Debrief mode, decision logs, evidence export |
| 14 | `14_TECH_STACK_AND_ARCHITECTURE.md` | Stack, hosting, realtime, repo state |
| 15 | `15_UI_DESIGN_SYSTEM_AND_EDITOR_UX.md` | Visual system, editor UX patterns |
| 16 | `16_BUILD_PHASES.md` | Phased build order |
| — | `MASTER_GOAL_BUILD_PROMPT.md` | The big `/goal` prompt for the agent |

---

## Core locked decisions (at a glance)

- **Naming is locked** (file 02). Never bolt "360" onto a module name.
- **Command Studio is the only thing that creates assets.** Studio creates → Library holds → Classroom (TDEs) & Live (Scenarios) consume.
- **IA = Home / Studio / Library / Classroom / Live / Debrief / Admin.**
- **One canvas** (Konva) powers scenes *and* cards (single-frame mode).
- **Transparency rule:** bright effects (fire/smoke/light) = **screen blend on black**; solid objects (people/vehicles/props/dark smoke) = **true alpha (packed-alpha MP4)**; white-bg assets = **multiply**.
- **Effects library = owned, not stock.** Premium stock (ActionVFX etc.) is legally barred from being embedded. Build via AI generation + commissioned work-for-hire.
- **Background removal = free, in-browser** (Transformers.js / RMBG). **Masking = free polygon clip** (Konva). **Erase/restore = brush-on-mask** in a pop-up panel.
- **Characters = one set, many Looks** (idle/walk-in/kneeling/injured + ethnicity/uniform variants). Voiced live over Teams. **No robotic talking-mouth.**
- **Decision capture:** Open (per-device) and Locked (one-per-group) modes; Plenary reveal; auto-wipe by default.
- **`distort` = fast-follow**, not launch.

---

## Pre-build blocker (do first — see file 05 & 14)

The existing repo has permissive RLS (`USING (TRUE)`) and no multi-tenancy. **This must be fixed before any customer data is held.** Org-scoped RLS + organisations/memberships/roles is Phase 0.
