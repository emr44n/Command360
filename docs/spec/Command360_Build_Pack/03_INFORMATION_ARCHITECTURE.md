# 03 · Information Architecture

## 1. Top-level sections (LOCKED)

```
Home  ·  Studio  ·  Library  ·  Classroom  ·  Live  ·  Debrief  ·  Admin
```

Decisions baked in:
- **Library is a first-class section** (XVR has one). All assets and starter templates live here, tagged.
- **Templates is NOT its own section** — starters live in Library, tagged "template".
- **Reports + analytics merged into Debrief.**
- **One unified "New" entry point** (see §3).

## 2. What each section is

| Section | Purpose | Key contents |
|---|---|---|
| **Home** | Org dashboard / landing | Recent items, "New", what's scheduled, usage at a glance |
| **Studio** | The build tool (asset factory) | Editor: canvas, library panel, inspector, timeline. Builds Scenarios, Cards, assets. |
| **Library** | The asset shelf | Categories → subcategories of assets; templates; grid/list; hover-preview; search |
| **Classroom** | Build + run TDEs | TDE list, TDE builder (blocks/groups/paths/flow-map), live run, plenary |
| **Live** | Build + run Scenarios | Scenario list, run controls, multiviewer/CCTV, second-screen |
| **Debrief** | Review + evidence | Decision logs, timeline replay, analytics, evidence export |
| **Admin** | Org management | Users, roles, branding, library uploads, asset Looks, billing |

## 3. The unified "New"

One "New" button → choose what to create:
- **Scenario** (opens Studio, scene canvas)
- **TDE** (opens Classroom builder)
- **Card / asset** (opens Studio, single-frame canvas)

No separate per-section "new" flows that fragment the model.

## 4. Per-organisation dashboards

Every product surface a customer touches (Home, Studio, Classroom, Live) carries a **mini dashboard scoped to that organisation**. Each org sees only its own data (enforced by tenancy — file 05).

**Dashboard best-practice content (each shows the relevant subset):**
- **Recent** — last opened/edited items, resume where you left off
- **New** — the unified create entry
- **Scheduled / upcoming** — sessions booked
- **Usage at a glance** — sessions run, assets created, participants reached (no participant PII)
- **Quick access** — pinned scenarios/TDEs/templates

Keep dashboards calm and scannable: a few clear cards, not a data dump.

## 5. Navigation model

- Persistent left or top nav for the 7 sections.
- Inside Studio: a **full-screen edit mode** toggle that hides chrome (see file 15).
- Inside Library/Studio: a **Canva-style side panel** that slides in with categories and a preview side-card.

## 6. Page plan (per section, high level)

- **Home:** dashboard grid.
- **Studio:** editor shell (library panel | canvas | inspector) + timeline + export bar.
- **Library:** category sidebar | asset gallery (grid/list) | preview side-card; tabs: Library / Placed / Templates.
- **Classroom:** TDE list → TDE builder (slide/block view **or** flow-map view) → run controls + plenary.
- **Live:** scenario list → run console (views, inject list, multiviewer, second-screen QR).
- **Debrief:** session list → timeline replay + decision logs + export.
- **Admin:** users/roles, branding, library admin (upload + Looks), billing.
