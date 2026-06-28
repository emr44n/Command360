# Command360 — Master Software Feature Requirements

*Derived by aggregating the competencies every target sector is required to train (see the SECTOR files). The principle: each regulated competency implies a content need; the recurring ones imply a **feature**. This is the product backlog that makes Command360 sellable across sectors, not just fire.*

**The reassuring headline:** the 2D-overlay engine is sector-agnostic. ~80% of serving a new vertical is **content** (asset libraries + scenario templates), which the AI-asset pipeline handles cheaply. The genuine engineering additions below are bounded and most extend things already on the roadmap.

---

## A. Core engine — already built / in progress (confirm & harden)
These exist in Studio/Stage/Debrief; they're the foundation every sector relies on:
- Scenario builder with layered 2D scenes (backplate + transparent overlays).
- **Injects / Steps / Waits / Phases** triggering; branch manager; playback engine; session recorder; timeline.
- **Looks** (saved visual variants — e.g. fire `--early`→`--developed`), **Combos** (multi-layer objects), **Hotspots** (clickable regions), **Tasking** (variable crew assignment), **Library** (asset shelf), **Objectives** (assessment criteria).
- Modes: **Studio / Stage / Debrief**; **Drill** (self-led) and **Live Exercise / Hot Seat** (instructor-led).
- Mentimeter-style interaction: polls, quizzes, word clouds, Q&A; AI debrief summaries.

**Pre-commercial blockers to clear first (from project notes):** tighten Row-Level Security (no more `USING (TRUE)`), build the **multi-tenancy model** (organisations, memberships, roles), and fix the Konva transform/rotation bugs. Everything below assumes multi-tenancy exists.

---

## B. Cross-sector feature requirements (priority order)

### Tier 1 — wins deals (build first)
1. **Regulator-ready after-action / evidence export.**
   *Driver:* COMAH 3-yearly tested exercise, CAP 699 proficiency checks, Fire Standards maintenance of competence, NHS EPRR — every regulated buyer must *evidence* the exercise.
   *Spec:* auto-generate an exercise record — timeline of injects & decisions, participant performance vs objectives, attendance, notes — exportable to **PDF and spreadsheet (CSV/XLSX)**. Brandable with the org's logo. This is the single most important commercial feature.
2. **Sector content packs (asset libraries + scenario templates).**
   *Driver:* every sector needs its own imagery (aviation aircraft fires, COMAH tank farms, rail rolling stock…).
   *Spec:* asset library scoped and tagged by sector (see §D); a new account selects its sector and ships pre-stocked; starter scenario templates per sector. Mostly an AI-asset content effort, not deep code.
3. **Per-organisation branding / white-label.**
   *Driver:* every client wants their uniforms, crests, local scenes; bespoke onboarding pack is already the model.
   *Spec:* org-scoped theme (logo, colours) + org-scoped asset library; rides on multi-tenancy.

### Tier 2 — maps to the competency frameworks
4. **Command-role & level structure.**
   *Driver:* fire Levels 1–4 / bronze-silver-gold; police command; ambulance leadership; airport IC; site IC.
   *Spec:* assign participants to command roles/levels; role-appropriate views; tag objectives to a command level.
5. **JESIP / multi-agency exercise mode.**
   *Driver:* fire, police, ambulance and COMAH/LRF all train multi-agency joint working.
   *Spec:* multi-org / guest participants in one live session; a **METHANE/ETHANE** report builder; a **Joint Decision Model (JDM)** decision log captured automatically; optional IIMARCH briefing structure. (Note JESIP itself recommends a shared *digital* information platform — lean into this in copy.)
6. **Multi-participant live sessions with remote join.**
   *Driver:* the core differentiator vs single-site 3D — pull internal teams + external blue-light partners into one browser exercise.
   *Spec:* join via link / the planned **QR second-screen**; observer/assessor/participant roles; presence; per-participant capture.
7. **Objectives ↔ competency-framework mapping.**
   *Driver:* buyers must assess against published frameworks (THINCS command skills, CAP 699 competencies, COMAH process-safety, EPRR).
   *Spec:* attach objectives to a selectable framework; assessor scoring view; results flow into the evidence export (Tier 1 #1).

### Tier 3 — broadens applicability
8. **Control-room / dispatch scenario mode.**
   *Driver:* explicitly trained in fire, police, ambulance, rail and energy ("control room and dispatch decision-making").
   *Spec:* a lighter scenario type driven by incoming call/intel injects (text + audio) and evolving information feeds rather than a full visual scene.
9. **Dynamic risk & hazard-identification interactions.**
   *Driver:* fire DRA, COMAH consequence awareness, all-sector situational awareness.
   *Spec:* timed hazard reveals; "spot the hazard" hotspot tasks; shelter-vs-evacuate decision prompts; plume/escalation overlays as Looks.
10. **LMS / competency-system export hooks.**
    *Driver:* mirrors how incumbents cross-sell competency platforms; buyers want results in their system of record.
    *Spec:* export/integration so exercise outcomes can feed an external competency/LMS tool.

---

## C. Gating requirements (not features, but needed to sell)
- **Security & compliance posture:** Cyber Essentials (then aim for ISO 27001 to match XVR), SSO, audit logs, data-retention controls, clear UK data residency. Public bodies *and* large industrials will ask before signing.
- **Accessibility:** keyboard navigation, contrast, reduced-motion — public-sector buyers require it.
- **GDPR:** the RLS/multi-tenancy fix is the precondition for handling participant data lawfully.

---

## D. Asset-system requirements (back-end)
- Sector-tagged library with the path/convention in `00_SECTOR_KB_INDEX.md` (`library/{sector}/{category}/{item}--{state}`).
- Account creation sets a **sector** → auto-provisions that sector's starter library + templates.
- Shared cross-sector categories (`effect/`, `casualty/`, `responder/`, generic `prop/`) stored once, referenced by all sectors — keeps per-sector build cost low.
- `--state` variants surface as **Looks** for live switching.
- AI-asset pipeline to mass-produce transparent-layer images/loops per sector on demand (the planned approach).

---

## E. Competency → feature traceability (summary)

| Competency (cross-sector) | Feature(s) it requires |
|---|---|
| Command decision-making under pressure | Core branching engine; command-role structure (#4) |
| Dynamic risk assessment / hazard ID | Hazard interactions (#9); hotspots; Looks |
| Multi-agency / JESIP joint working | JESIP mode (#5); multi-participant live (#6) |
| Assessment against a published framework | Objectives↔framework mapping (#7); evidence export (#1) |
| Maintenance of competence / mandated exercises | Reusable templates (#2); evidence export (#1) |
| Control-room / dispatch decisions | Control-room mode (#8) |
| Site/sector-specific realism | Sector content packs (#2); branding (#3) |
| Evidencing to a regulator | Evidence export (#1); audit logs (§C) |

---

*Build order recommendation: clear the multi-tenancy/RLS blockers → Tier 1 (evidence export, sector packs, branding) → Tier 2 (command roles, JESIP/multi-agency, objectives mapping) → Tier 3. Tier 1 alone makes the platform sellable into the cold markets (aviation, COMAH) where the evidence pack is the deciding factor.*
