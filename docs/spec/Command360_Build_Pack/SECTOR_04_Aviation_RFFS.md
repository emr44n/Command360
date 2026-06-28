# Sector 04 — Aviation: Airport Rescue & Fire Fighting (RFFS)

*Priority cold market. Private operators (fast sales), no employer-conflict, a named buyer, and a regulator that demands documented, recurring training. XVR has already proven airports buy command simulation (Heathrow via Redkite; Changi, Auckland, Ottawa, Airservices Australia).*

---

## 1. Snapshot
- **Target universe:** ~40 UK commercial airports, each legally required to run an in-house Rescue & Fire Fighting Service (RFFS); plus NATS, the International Fire Training Centre (Teesside), and military aerodrome RFFS (Defence).
- **Procurement:** Mostly **private** — direct sales, fast, no public-tender marathon.
- **Buyer / contact:** RFFS Station / Watch Manager · Airport Fire Training Officer · Head of Airside Operations / Safety · Aerodrome Safeguarding.
- **Edge over incumbent:** airports run frequent, mandated recurrent training with small teams; a browser tool that runs command/tabletop exercises with no hardware and produces the proficiency evidence is a strong, cheap fit.

## 2. The mandate (the rigid guidelines)
Aviation is one of the most prescriptive training environments in the country:
- **ICAO Annex 14** (international standard) — requires RFFS and that all personnel be properly trained and take part in regular drills.
- **CAA CAP 168 — Licensing of Aerodromes** (Ch. 8 RFFS, Ch. 9 emergency plan) — mandates the RFFS, equipment, personnel, **training programme** and the aerodrome emergency plan, which must be tested and reviewed.
- **CAA CAP 699 — Framework for the Competence of RFFS Personnel** — defines competence, role maps, the **Structured Level of Proficiency (SLP)**, and an ongoing **proficiency-check programme at adequate intervals**.
- **Re-qualification:** airport firefighters re-qualify periodically (commonly cited as every four years) and drill continuously — they attend far fewer real incidents than local-authority crews, so *training is how competence is maintained*. That makes recurring exercise tooling essential, not optional.
- **EASA Reg (EU) 139/2014** applies to EASA-certificated aerodromes; CAP 168 to national ones.

## 3. Competencies to develop (worked backwards from CAP 699 / Annex 14)
- **Aircraft incident command** — incident assessment, declaring the aerodrome emergency, command of the RFFS response within the 3-minute response standard.
- **Tactical firefighting decisions** — application of foam/agents, securing the fuselage, protecting escape routes, rescue path creation.
- **Task & Resource Analysis (TRA) execution** — deploying the right appliances/personnel to the assessed tasks for the aircraft category.
- **Mass-casualty & rescue** — passenger evacuation support, triage handover, working with the local authority FRS and ambulance at category limits.
- **Aerodrome emergency plan activation** — coordination of airport, ATC, partner agencies, off-airport response (the 6-degree cone), and recovery.
- **Multi-agency / JESIP** — handover and joint working with local blue-light services beyond the airport boundary.
- **Communication & control-room** — alerting, crash alarm procedures, comms discipline.
- **Specialist hazards** — fuel fires, engine/APU fires, dangerous goods on board, water/RFF where applicable, alternative fuels / urban air mobility (emerging CAA topic).

## 4. What they train on (scenarios)
Aircraft ground fire (engine, APU, fuel spill, brake) · aborted take-off with fire · aircraft on stand adjacent to terminal · wide-body multi-deck / high-density narrow-body evacuation · gear collapse / runway excursion · dangerous goods incident · off-airport crash within the response cone · terminal/building incident · fuel-farm fire (often a COMAH overlap — see Sector 06).

## 5. How Command360 helps (competency → capability — SEO copy seed)
- **Aircraft incident command** → build the apron/runway scene, place the aircraft, trigger the fire, and let the RFFS manager command the response live; re-run for every aircraft type and category.
- **TRA / resource deployment** → position appliances and crews on the 2D aerodrome; practise the task allocation the TRA demands.
- **Aerodrome emergency plan** → multi-participant exercise pulling ATC, ops, and external blue-light partners into one browser session; perfect for the mandated plan test.
- **Proficiency evidence** → auto-generated exercise record (timeline, decisions, performance vs CAP 699 competencies) exportable to PDF/spreadsheet for the CAA file. *This is the feature that closes airport deals.*
- **Recurrent / re-qualification** → reusable scenario bank means a station can run varied, fresh exercises without rebuilding — directly supports the proficiency-check cycle.

## 6. Asset library required (`library/aviation/`)
- `backplate/` — runway, taxiway, apron/stand, terminal frontage, fuel farm, grass/cone off-airport area, control tower, night/low-vis variants.
- `asset/` — aircraft by type (narrow-body, wide-body, regional, GA, helicopter), fuselage sections, engines, landing gear, airport fire appliances (major foam tenders, RIV), snozzle/HRET.
- `hazard/` — fuel-pool fire, engine/APU fire, wheel/brake fire, fuselage fire & smoke, fuel spill, dangerous-goods release.
- `casualty/` — passengers at exits, on slides, on ground, crew; varying severity.
- `responder/` — airport firefighters (proximity suits), local-authority FRS, ambulance/HART at boundary.
- `prop/` — crash alarm/comms props, cordons, muster points, DG placards, aircraft RFF charts overlay.
- `effect/` — fuel-fire flame, jet-fuel smoke, foam application, blue-light. *(Shared.)*

## 7. Training landscape (providers, awarding bodies, courses)
- **Training centres:** International Fire Training Centre (Teesside) — major RFFS approved training provider · Serco / airport-operator in-house schools · fire training colleges offering aviation modules.
- **Standards:** CAP 699 role maps & SLP; CAP 1150 Task & Resource Analysis; NFPA 403 (international reference).
- **Incumbent simulation:** XVR (used by Airservices Australia, Changi, Auckland, Ottawa) and Redkite (Heathrow, major UK airports). *Command360's lane: cheap, browser, recurrent command & tabletop exercising + the CAA evidence pack.*

## 8. SEO page targets
- Hub: `/sectors/aviation-rffs` — "airport fire command & RFFS training software".
- Spokes: `/scenarios/aviation/aircraft-fire`, `/scenarios/aviation/aerodrome-emergency-plan`, `/scenarios/aviation/mass-casualty-evacuation`, `/scenarios/aviation/fuel-farm-fire`, `/sectors/aviation-rffs/recurrent-training`, `/compliance/cap-699`, `/compliance/cap-168`.
- Keyword themes: "RFFS training software", "airport fire incident command", "aerodrome emergency plan exercise", "CAP 699 proficiency training", "aircraft fire scenario simulation", "airport tabletop exercise tool".
