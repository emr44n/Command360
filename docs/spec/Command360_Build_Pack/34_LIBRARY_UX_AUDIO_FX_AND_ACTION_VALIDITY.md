# 34 · Library Browsing UX, Audio FX & Action Validity

*Day-one. How the Library looks/feels (the thing xVR users judge in a demo), audio treatments, the red-invalid action rule, and the on-canvas Tween authoring. Complements files 06/07 (library), 11 (inject engine), 33 (states/sequencing).*

## 1. Library browsing (extends files 06/07)
- **Icon filter rail** at the top of the Library panel (xVR-style function, our skin): category icons (People, Vehicles, Fire FX, Smoke FX, Weather, Props, Maps, Audio, Backdrops). Click = filter on (accent border), click again = off. **Filter + search combine** (scoped search); with no filter, search covers everything.
- **Tags:** every asset carries search tags (name + type + function, e.g. "van", "ambulance"); search matches names AND tags. Admin/user can edit tags on their own assets.
- **Three display modes:** thumbnails-only · thumbnails+names (default) · **names-only** (fast scrolling for power users).
- **Thumbnail size slider** (Pikbest-style): 4-across → 3 → 2 → 1; persists per user.
- **Collapsible category groups** in list view (+/− like xVR's groups); Placed tab keeps its existing behaviour (file 06).

## 2. Micro-loop previews (thumbnails that come alive)
- On upload of any video/VFX asset, auto-generate: a **static thumbnail** AND a **micro-loop** (muted, lightweight ~2.5s clip starting ~2s in; loops seamlessly).
- **Adjustable window:** in the asset editor (admin + user uploads), a small scrubber picks which seconds the micro-loop uses (a 3s clip just uses what it has; a long clip picks its best moment).
- **Hover = animate** (desktop); static thumbnail otherwise. Static images stay static. Audio assets show a waveform tile + duration.
- Same micro-loops appear EVERYWHERE assets are picked: library grid, Look dropdowns, Switch Look action picker — **one thumbnail-dropdown component reused** (grid/text toggle), so behaviour can't drift.

## 3. Looks on thumbnails (stateful assets, file 33)
- An asset with multiple **Looks** shows a small count badge; default thumbnail = first Look.
- **Scrub-to-preview:** moving the cursor left→right across the thumbnail steps through its Looks; corner ‹ › arrows do the same; **swipe on tablet**. Stop on any Look; drag places that Look.
- Expanded view: a Look strip (3–4 mini-thumbnails across, sized by the slider), each hover-animating.

## 4. Audio in the library & the Voice/Audio FX panel
- **Inline play:** audio tiles have a play/pause button + mini waveform + duration; preview without placing.
- Placed audio layers/Sound actions get **Volume** (always, separate slider) and an **Audio FX panel** — same reusable FX-panel pattern as visual FX (file 15 §3):
  | Preset | Sound |
  |---|---|
  | **Radio (Airwave)** | thin, crackly, band-limited |
  | **Telephone** | narrow, boxy |
  | **Megaphone / PA** | harsh, projected |
  | **Muffled / Behind door** | dull, distant |
  | **Echo / Large space** | reverberant |
  | **Distant / Outside** | quiet, thin |
  | **Pitch** | slider (±), quick voice variation |
- Implemented with the Web Audio API (filters/gain/delay) — applied live at playback; the original file is never altered. Presets combine with volume; FX stack is saved on the layer/action and travels in `.c360`.

## 5. Action validity — the RED rule (extends file 11; the xVR behaviour users expect)
- A newly added Action is **red until fully defined** (target + required params).
- An Action turns red if its **target layer/asset is deleted** (e.g. the video it referenced was removed from the canvas).
- **Red actions are skipped at run-time** and the Inject shows a warning badge; the scenario never crashes on a broken Action.
- **Replace target:** on any red (or valid) Action, one click → pick a new target (dropdown of on-canvas layers or click-to-pick on canvas) — repair without rebuilding the Action. (Manual's "Replace" function, ours.)
- Deleting a layer that Actions reference prompts: "N Actions target this layer — delete anyway? (They'll turn red.)"

## 6. Tween authoring — ghost start/end frames (the "walks into the distance" UX)
- Adding a **Move/Tween** Action to a layer shows a **ghost end-frame** of that layer on the canvas: drag it to the end position, resize/rotate it to the end scale — the tween runs from the layer's current frame to the ghost.
- Duration + easing on the Action; **Start: after previous / with previous / delay** (file 33). Off-screen start/end supported (place the ghost or the layer outside the canvas edge for drive-ins/walk-offs).
- Worked example: officer walk-clip plays (Look *walking*) → tween scale 100%→55% + move up-canvas over 2s (walks into the distance) → **Switch Look** to *idle-distant* (long loop, occasional radio) — each step one Action in the Inject, chained "after previous".
- Composes with sound: attach a **Sound** action (with FX preset) at start / end / after previous — e.g. car drive-in tween → Switch Look to *crashed* → Sound "impact" (play once).

## 7. Vocabulary corrections (LOCKED, updates file 02)
- **Weather stays "Weather"** — both the library category and the whole-scene action. The term **Atmosphere is dropped everywhere**. Rule of thumb (Imran's): *rename only where it adds meaning; generic words stay generic* (Weather, Properties, Wait, Sound, Move, Library, Layers).
- File 33's language aligns to file 02: **Inject** (not "event") in all UI; **Look / Switch Look** (not "state/Change state") in all UI. Repo code keeps internal names (`StudioEvent` etc.) per file 24 — labels change at the UI layer only.

## 8. Phasing & change-impact
- **Phase 2:** ghost-frame Tween authoring; red-action rule + Replace; Audio FX panel on layers/actions.
- **Phase 4:** icon rail, tags, display modes, size slider, micro-loop generation + adjustable window, Looks scrub, inline audio play.
- **Phase 9:** flow-test — break an action (delete its target) → red + skipped + repairable; micro-loops render in library AND pickers; FX presets audible in preview, presenter, participant.
- Change-impact (file 25): thumbnail component is shared — one component, all pickers; FX stack serialises into `.c360`.
