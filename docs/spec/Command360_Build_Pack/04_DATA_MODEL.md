# 04 · Data Model

## 1. Containment hierarchy

```
Organisation
├── Users ── Roles
├── Branding (logo, colours, theme)
└── Library
    └── Assets  (Characters, Vehicles, Effects, Props, Maps, Audio, Backdrops, Cards)
        └── Looks  (saved visual states/variants of an asset)

Scenario  (built in Studio, run in Live — ONE object, not copied)
├── Briefing  (a Card)
├── Objectives  (optional assessment criteria)
└── Views  (the "slides": front / rear / side / cab / CCTV — each self-contained)
    ├── Layers  (stacked asset instances; build order = z-order)
    ├── Phases  (Arrival / Develop / Escalate / Resolve)
    │   └── Injects  (events the instructor fires)
    │       └── Actions  (Reveal, Move, Switch Look, Sound, Wait, Card…)
    └── Hotspots  (clickable regions)

TDE  (built + run in Classroom)
├── Blocks  (poll, quiz, word-cloud, Q&A, survey, content, rating, open-text, Decision)
├── Groups  (teams within a cohort)
└── Paths  (per-Group route through the blocks)

Session  (a run of a Scenario or TDE)
├── Participants  (minimal: a Group name; no accounts, no PII by default)
├── Decisions  (captured from Decision blocks)
└── Decision log / timeline  (auto-wiped by default)
```

## 2. Key entities

| Entity | Notes |
|---|---|
| **Organisation** | The tenant. Owns everything. `org_id` scopes all rows. |
| **User** | Belongs to an org via a **Membership** with a **Role**. Instructors/authors/admins only — not participants. |
| **Asset** | A library item. Has a type, category, subcategory, source-type (for blend handling), default playback. |
| **Look** | A child of an Asset — a named visual state (clip or still): idle, walk-in, kneeling, injured, developed. Switchable live. |
| **Scenario** | First-class object (see §3). Has Views. |
| **View** | A camera angle. Holds Layers, Phases, Hotspots. |
| **Layer** | An instance of an Asset placed on a View, with transform, blend, opacity, playback, Look. |
| **Inject / Action** | The run-time engine (file 11). |
| **TDE / Block / Group / Path** | Classroom (file 10). |
| **Session** | A run. Links to a Scenario or TDE; holds participants and decisions. |
| **Decision** | A captured choice (Open or Locked mode) with timestamp; exportable or auto-wiped. |

## 3. DECISION — promote Scenarios to first-class tables

**Current repo:** a Scenario is stored as one `studio` slide-type **JSON blob** (not normalised).

**Target:** promote to proper relational tables — `scenarios → views → layers / phases → injects → actions / hotspots`. Reasons:
- Query, branch, and version Views/Injects independently.
- Safe partial mutation **while the scenario is running** (live-edit / "curveball").
- Reuse assets by reference, not by copy.

Migration is a defined task (file 16, Phase 1). Until migrated, keep the JSON path working behind a stable interface.

## 4. Live-editable-while-running requirement

Run mode is **editable mid-delivery** (instructor throws a curveball: add a casualty, change a Look). The data model must allow:
- Safe mutation of a running Scenario's Views/Layers/Injects.
- Simultaneous **recording** of what happened (for Debrief).
- Realtime push of the change to participants (file 14, realtime).

## 5. Scenario = one object (not copied)

A Scenario is **built in Studio and run in Live as the same object** — not duplicated into a "live copy". Run mode reads and (optionally) mutates the live record. This keeps edits and recordings coherent.

## 6. Tenancy & privacy (summary — full detail file 05)

- Every row carries `org_id`; RLS scopes reads/writes to the caller's org.
- **Participants are not Users.** They join a Session with a Group name only. No accounts, no PII by default; name fields optional.
- Decision logs and timelines **auto-wipe at session end by default** (configurable to keep + export).
