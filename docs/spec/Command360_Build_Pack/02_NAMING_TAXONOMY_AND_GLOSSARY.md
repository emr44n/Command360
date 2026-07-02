# 02 · Naming Taxonomy & Glossary (LOCKED)

**This vocabulary is final. Use it everywhere — UI labels, code, docs.** Rule: brand-first naming (like *XVR On Scene* / *Microsoft 365*). **Never** bolt "360" onto a module ("Studio 360" is wrong; it's "Command Studio").

---

## 1. Products & tool

| Name | Meaning |
|---|---|
| **Command 360** | The platform / brand |
| **Command Studio** | The build/authoring tool — the asset factory |
| **Command Classroom** | Taught/group delivery |
| **Command Live** | Live individual/crew immersive assessment |

## 2. Operating modes

| Mode | Meaning |
|---|---|
| **Build** | Authoring (in Studio) |
| **Run** | Live delivery (chosen "Run" not "Live" to avoid colliding with the product *Command Live*) |
| **Debrief** | Review + evidence |

## 3. Units of work

| Term | Used in | Meaning |
|---|---|---|
| **TDE** (Tactical Decision Exercise) | Classroom | A taught exercise made of Blocks. Respected industry term — deliberately **not** "presentation". |
| **Scenario** | Live | A live immersive exercise made of Views → Phases → Injects → Actions. |
| **Block** | Classroom | A slide element in a TDE (poll, quiz, word-cloud, Q&A, survey, content, rating, open-text, **Decision**). |

## 4. Scenario structure

| Term | Meaning |
|---|---|
| **View** | A camera angle / "slide" — front, rear, side, cab, CCTV. Each View is its own self-contained ecosystem (its own layers, phases, hotspots). |
| **Layer** | A stacked element on a View. Build order = z-order (first built sits underneath). |
| **Phase** | A stage of the incident: Arrival / Develop / Escalate / Resolve. |
| **Inject** | An event the instructor fires (was XVR "Event"). |
| **Action** | A single thing an inject does (Reveal, Move, Switch Look, Sound…). Linked actions "play together"; **Wait** inserts a timed gap. |
| **Hotspot** | A clickable region on a View (was XVR "Trigger"). |
| **Look** | A saved visual state/variant of an asset (idle / developed / injured). Switchable live. (Was XVR "State".) |
| **Combo** | Multiple layers connected to behave as one object. (Was "connect as one".) |

## 5. Classroom structure

| Term | Meaning |
|---|---|
| **Group** | A self-named team within a cohort (Group 1 / 2 / 3). Joins via QR + short code. **Locked term** (rejected Cell/Room/Stream/Syndicate/Pod). |
| **Path** | The route a Group follows through the TDE. Set at Build time; can be same or different per Group (e.g. multi-agency perspectives). |
| **Decision block** | A drop-in block that captures a decision. Two modes: **Open** (every device submits, Menti-style) and **Locked** (one device per Group for a collective call). |
| **Plenary** | The reveal view: instructor pulls all Groups' decisions onto one screen to compare/discuss. |
| **Flow map** | A node-graph (React Flow) alternative build view for branching/path logic. |

## 6. Studio / asset terms

| Term | Meaning |
|---|---|
| **Library** | The asset shelf (categories → subcategories). A first-class section. |
| **Asset** | Any library item: character, vehicle, effect, prop, map, audio, backdrop, card. |
| **Card** | A media inject shown on the Stage (pop-up) or a participant phone (social / news / message / phone-call / plain image/video/map). |
| **Properties** | The inspector panel (settings for the selected object). |
| **FX** | Filters on an asset. |
| **Effects** | Live action effects. |
| **Thermal** | The TIC (thermal imaging camera) view of an asset. |
| **Weather** | Weather/time-of-day — the library category AND the whole-scene action. **Stays generic (rule: rename only where it adds meaning).** |
| **Tasking** | Variable crew assignment (was "Task"). |
| **Objectives** | Assessment criteria (was "Skills"). Optional. |

## 7. Action catalogue (the inject building blocks)

`Reveal · Hide · Move · Place · Rotate · Tween · Switch Look · Effects · Wait · Sound · Card · Question · Fire Hotspot · Chain · Weather · Thermal · Pin`

(Full behaviour in file 11.)

## 8. XVR → Command 360 mapping (renamed only where it adds meaning)

| XVR term | Command 360 |
|---|---|
| Event | **Inject** |
| Action / Step | **Action** |
| Event category | **Phase** |
| Task | **Tasking** |
| Trigger | **Hotspot** |
| State | **Look** |
| Connectors | Attachments |
| Locations | Positions |
| Change properties (panel) | **Properties** |
| Heat | **Thermal** |
| Connect-as-one | **Combo** |
| Show pop-up | **Card** |
| MC pop-up (branching) | **Question** |
| Weather | **Weather** (unchanged — generic stays generic) |
| Skills | **Objectives** |
| Completed | **Played** |

**Keep generic words generic** — Wait, Sound, Move, Library, Layers, Properties, FX stay plain.
