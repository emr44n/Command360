# 07 · Asset Library & Characters

## 1. The Library — categories → subcategories

A clear, searchable, icon-led shelf (the structure can match XVR; the **skin must not** look like XVR — use a Canva-style sliding side panel).

| Category | Subcategories (examples) |
|---|---|
| **People** | Police · Fire · Ambulance/Paramedic · Public (man, woman, builder, plumber, passer-by) · Casualties (injured, on-floor, coughing) · Kids · Other (e.g. terrorist) |
| **Vehicles** | Fire appliance · Ambulance · Police car · Cars · HGV · Bus · Train · Aircraft |
| **Fire FX** | Structure fire · Window/door fire · Wall/ceiling fire · Ground fire · Body fire · Sparks/embers · Ignitions |
| **Smoke FX** | Light smoke · Dark smoke · Steam · Smoke-logging |
| **Weather / Atmosphere** | Rain · Snow · Fog · Flood · Night / low-light |
| **Props** | Bins on fire · Trees on fire · Triage area · First-aid kit · Cones · Cordon tape · Signage · Debris · Hazmat (placards, drums, spill, vapour/gas cloud) |
| **Maps** | Street map (postcode → OpenStreetMap), site plans, floor plans |
| **Audio** | Sirens · Alarms · Radio chatter · Coughing · Breaking glass · Structural creaks · Crowd · Screams |
| **Backdrops** | Building types, street scenes, sites (the base plates / Views) |

Each asset is a **thumbnail that is really a clip** (hover to preview). Items missing their underlying asset show a **red flag**.

> **Sector content packs:** the library is **sector-taggable**. A new account picks its sector and ships pre-stocked (aviation aircraft fires, COMAH tank farms, rail rolling stock…). Shared categories (effects, casualties, responders, generic props) are stored once and referenced by all sectors. (~80% of serving a new sector is content, handled by the AI-asset pipeline — file 08.)

## 2. Characters — one set, many Looks

A character is **not one file — it's a set**:

- **Variants** (swap the person): different faces / ethnicities, different uniforms, hi-vis, custom uniform.
- **Looks / States** (what they're doing — switchable live):
  - **Idle** — standing, looking around (LOOP)
  - **Walk in** (ONCE)
  - **Kneeling** — talking to casualty (LOOP)
  - **Close-up** (LOOP)
  - **Injured / coughing / holding arm** (LOOP + sound)
  - **Still** — most-likely image (IMG)
- **Voice:** the **instructor speaks live over Teams**. **No robotic talking-mouth** — use idle loops (blinking, breathing) only. (Pre-rendered transparent loops, *not* live avatar AI.)

Thumbnails are videos. Characters use **true alpha** (not screen blend — file 08), because a person is a solid object and would go see-through under screen blend.

## 3. The casualty / triage live workflow (worked example)

The instructor drives this live; the visuals just need to land (instructor voices it over Teams):

1. **Casualty appears** — fades in by the building; coughing **loop** + cough **sound** play.
2. **"Set up triage"** — triage-area asset (green sheet + kit) fades in where pointed.
3. **Move casualty** — walk-clip plays → casualty now stood at triage.
4. **"Speak to ambulance"** — paramedic **walk-in** plays → stands close → conversation (live voice).
5. **Dismiss** — "carry on" → paramedic walks off, fades out.

Each step is a drag-and-drop asset that fades in on the instructor's cue; each is a **layer** stacked on the View.

## 4. Admin upload flow (the back-end you live in)

The org admin grows the library here:

1. **Upload** the clip / PNG → pick **source type**: bright-on-black / white-bg / already-transparent / solid-needs-cutout (drives the default blend — file 08).
2. **Categorise** — category + subcategory (People ▸ Police).
3. **Add Looks** — attach variants + states (idle, walk-in, kneeling…).
4. **Set default playback** — once / loop / hold + blend mode.
5. **Save** → lands in the Library, ready to drag.

Asset path convention: `library/{sector}/{category}/{item}--{state}` (state variants surface as Looks).

## 5. Asset-system requirements (back-end)

- Sector-tagged library; account creation sets a sector → auto-provisions that sector's starter library + templates.
- Shared cross-sector categories stored once, referenced by all.
- `--state` variants surface as **Looks** for live switching.
- Fed by the **AI-asset pipeline** (file 08) to mass-produce transparent-layer images/loops per sector on demand.
