# 11 · Command Live & The Inject Engine

Live, individual/crew, immersive real-time assessment. The unit is a **Scenario** (Views → Phases → Injects → Actions). This is the On-Scene/Hydra analog — built in Studio, run in Live as the **same object** (file 04).

---

## 1. Scenario structure (recap)

```
Scenario → Views (camera angles) → Layers + Phases → Injects → Actions  (+ Hotspots)
```

- **View** = a camera angle / "slide" (front, rear, side, cab, CCTV). Each is self-contained.
- **Phase** = Arrival / Develop / Escalate / Resolve.
- **Inject** = an event the instructor fires.
- **Action** = a single thing an inject does.

## 2. The run-time inject engine

The instructor runs the Scenario live. Firing an **Inject** runs its **Actions** in order. Output pushes to participants over realtime (file 14).

### Timing rules (LOCKED)
- Actions run **top-to-bottom**.
- **Link** actions to make them **play together** (simultaneously).
- **Wait** inserts a **timed gap** between actions.

## 3. Action catalogue

| Action | Behaviour |
|---|---|
| **Reveal** | Fade/animate an asset in |
| **Hide** | Animate an asset out |
| **Move** | Move an asset to a position |
| **Place** | Drop an asset at a position |
| **Rotate** | Rotate an asset |
| **Tween** | Animate a property over time |
| **Switch Look** | Change an asset's Look/state (e.g. fire early → developed) |
| **Effects** | Apply a live action effect/filter |
| **Wait** | Insert a timed gap |
| **Sound** | Play an audio asset |
| **Card** | Show a Card (Stage pop-up or phone) |
| **Question** | Show a branching multiple-choice question |
| **Fire Hotspot** | Trigger a hotspot's behaviour |
| **Chain** | Fire another Inject |
| **Atmosphere** | Apply weather/time-of-day |
| **Thermal** | Switch to the TIC (thermal) view of an asset |
| **Pin** | Drop a map pin / marker |

## 4. Hotspots

- Clickable regions on a View (was XVR "Trigger").
- Firing a hotspot runs its actions (e.g. click a window → fire breaks out).

## 5. Looks (live state switching)

- An asset's saved visual states (idle / developed / injured / coughing) switch live via **Switch Look**.
- Casualty workflow (file 07) is built from Looks + Move + Sound + Reveal/Hide.

## 6. Live-edit during a run ("curveball")

- Run mode is **editable mid-delivery**: add a casualty, change a Look, drop a new inject.
- The data model permits **safe mutation of the running Scenario** while **recording** for Debrief and **pushing** changes to participants (file 04 §4).

## 7. Characters & voice

- Characters are **pre-rendered transparent loops** (idle: blinking/breathing). **No robotic talking-mouth.**
- The **instructor voices them live over Teams**. (Building synthesised voice is a later upgrade.)

## 8. Briefing & comms (simplifications)

- **Briefing** = just a **Card**.
- **Radio/comms** = audio/video **Cards** + **Sound** injects; **live voice via Teams** (outside the platform).
- **Team-vs-individual** is inherent in how Live is run.
- **Live objective scoring** is parked (optional later — file 13).
