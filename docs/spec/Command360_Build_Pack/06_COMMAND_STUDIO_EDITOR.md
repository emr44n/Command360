# 06 · Command Studio — The Editor

Command Studio is the **asset factory**. It is the only place anything is created. Studio creates → Library holds → Classroom & Live consume. One Konva canvas powers both **scenes** (multi-View scenarios) and **cards** (single-frame mode — file 09).

---

## 1. Editor shell (three panels + timeline + export bar)

```
┌ topbar: scenario name · Build mode · [Library][Looks][▶ Run] ┐
├──────────┬───────────────────────────┬──────────────────────┤
│ LIBRARY  │         CANVAS            │      INSPECTOR        │
│ panel    │   (the View / scene)      │   (Properties)        │
├──────────┴───────────────────────────┴──────────────────────┤
│ TIMELINE  (layers + audio waveform)                          │
├──────────────────────────────────────────────────────────────┤
│ EXPORT BAR  (seconds selector → MP4 / Still)                 │
└──────────────────────────────────────────────────────────────┘
```

A **full-screen edit mode** toggle hides the browser chrome so the whole editor fills the screen (borrowed from Figma Motion).

---

## 2. Library panel (left)

Canva-style side panel that slides in.

- **Tabs:** `Library` · `Placed (n)` · `Templates`
- **Search** box.
- **View toggle:** grid ⇄ list.
- **Hover-to-preview:** hovering a video asset autoplays a ~3-second preview (YouTube-style) **in a side preview-card at the top of the panel** — not full screen. The card scrolls.
- **Click** an asset → it shows in the side-card (details + bigger preview), then drag onto the canvas.
- **Categories → subcategories** (full list in file 07): People, Vehicles, Fire FX, Smoke FX, Weather, Props, Maps, Audio, Backdrops.

### "Placed" tab
Shows every asset already dropped into the current scene (like XVR's placed-items tree). Click one → jump to it, **edit or replace it without breaking the inject** that references it.

---

## 3. Canvas (centre)

- Renders the active **View** with all its **Layers** stacked (build order = z-order).
- **Free-transform** on every object: drag, scale (corner handles), rotate — not button-based (an improvement over Fire Studio/XVR).
- **Zoom** in/out on the canvas.
- **Add shapes** (rect, ellipse, line, arrow, text) for annotation/markup.
- **Resize and corner-place** any asset (e.g. drop a card into a corner of the screen).

---

## 4. Inspector / Properties (right)

Grouped like Figma Motion:
- **Transform:** X / Y, scale (%), rotation.
- **Layout:** alignment, W / H.
- **Appearance:** opacity, corner radius.
- **Fill / Blend:** blend mode (screen / multiply / normal — file 08), colour.
- **Looks:** which saved state of the asset is showing.

### Assign-to-canvas (two ways — support both)
1. **XVR way:** open a settings panel, then **"assign"** → click an object on the canvas → settings apply to it.
2. **Direct way (preferred, more intuitive):** select the object first → its settings appear → adjust → **Add/Apply**.

---

## 5. Layers

- Every event/asset is a **layer**. Whatever fires/builds first sits **underneath**; later ones stack on top.
- Layer order = z-order, editable (drag to reorder).
- Typical stack: backplate (View) at the bottom → fire/smoke (screen blend) → characters (true alpha) → cards on top.

---

## 6. Timeline (bottom)

A Canva/Figma-Motion-style timeline.
- A **track per layer**; a ruler across the top; a scrubbable playhead.
- **Trim handles** on each clip to set when it appears and how long.
- **Audio track** shows a **waveform**, with **fade in/out** handles.
- **Keyframe** position / scale / rotation / opacity independently; **auto-keyframe** records changes while the playhead moves (borrowed from Figma Motion).
- **Collapse/minimise** the timeline to just the layer list.

### Per-clip playback settings (also surfaced on the asset)
| Setting | Options |
|---|---|
| **Playback** | Play once · Loop · Ping-pong (forward then back) · Hold last frame |
| **Entrance / Exit animation** | On enter · On exit · Both — Fade / Slide / Pop / None |
| **Speed** | slider |
| **Delay** | before start |

> Rule of thumb: a clip that **grows** (small→big) should be **Play once** or **Hold last frame** (looping would pulse small-big-small). A drifting smoke clip can **Loop**.

---

## 7. Broken-event flag (sequence integrity)

Injects depend on assets. If an asset an inject needs is **deleted**, that inject **turns red / flags "MISSING ASSET"** so the chain doesn't silently break and skip. Surface this in the inject list and the Placed tab.

---

## 8. Templates

- Save a whole built scene (e.g. house + fire + crew + injects) as a **template** (lives in Library, tagged).
- Reload it, **swap the backplate image** (different property), and the scenario logic still runs — the hard work is reused.

---

## 9. Export

- **Choose seconds** (5 / 10 / 15 / 30) → the editor **plays the scene and captures it** via the browser's MediaRecorder → **MP4**. No server; real-time capture; browser quality is fine.
- Or export a **still image** with the effects set to loop (a "living" image).
- Exported assets feed Classroom/Live (e.g. a CCTV clip, a piece of mobile footage, a social card).

---

## 10. Reuse note

This same canvas + inspector + timeline is reused for the **Card / media creator** in single-frame mode (file 09) and hosts the **masking / BG-removal pop-up panel** (file 08). Don't build a second editor.
