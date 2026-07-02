# 28 · Command Studio Classroom Scene / Scenario

*Addition (standalone for now). A Studio-authored scene that runs like PowerPoint — click/space-triggered sequential animations — for teaching inside Command Classroom (and usable in Command Live). NOT the live event engine, NOT baked video.*

> **The decision:** don't embed the live Studio engine into Classroom, and don't flatten to video (too big). Instead add a **Classroom Scene** mode: build it in Studio, but it **plays by click** — stacked effects fire one after another, like PowerPoint animations. Reuses the existing Studio layers/effects/CCTV; only the **trigger model + a run-time controller** are new.

## 1. Repo reality — reuse, don't rebuild (files 24/25)
Already present: `StudioLayer` (image/video/text/shape/audio, blendMode, feather, mask, `loop/autoplay/muted`), `StudioAction` (`property/from/to/delay/duration/easing/endBehaviour: stay|fadeOut|reset`), `StudioEvent` (`trigger: 'manual' | 'vote'`), `studioTimelineStore` / `studioPlaybackStore`, `StudioCctvEditor`, presenter `LiveDirectorView`, `sessions.live_scene_ids` + `current_slide_id` (select-then-push-live).
**New:** add `'click'` to `StudioEvent.trigger`; a **sequential run-time controller**; a **multi-scene jump grid**; **CCTV run-mode controls**; a **presenter position indicator**.

## 2. Authoring a Classroom Scene (in Studio)
- A scene marked as **Classroom Scene** type. Effects are **stacked** in the right-hand list; the stack order **is** the play order.
- Each stacked step keeps its settings: **trigger = click** (default for this type), plus the existing **play once / play N times / loop**, optional **timer/delay**, easing, and end-behaviour.
- Example the user builds: house image → drag "smoke", set loop, trigger click → drag "flames", set fade-in + loop, trigger click → stack more. On run, each click plays the next step.
- **Reliability (hard requirement — xVR failed here):** drag-to-reorder and **double-click-to-rename** steps/layers must be **rock solid**; **grouped items move/trigger together** (grouping logic); no lost/duplicated steps. This gets explicit tests (evidence).

## 3. Multi-scene "Classroom Scenario"
- One scenario can hold **multiple scenes/views** (e.g. 4 perspectives of a building fire; or "house intact" → "house devastated"). Author names each.
- **Jump grid** in the **bottom-left corner** shows how many scenes/sectors exist; click a cell to **jump** to any scene. Plus **next/back** to step through the click-sequence.
- Navigation is user-driven: linear next/next/next, back a step, or dynamic jump (e.g. explosion happens → jump straight to the "devastated" scene).
- **Back button = reset-to-step (LOCKED):** pressing back does NOT reverse animations; it **resets the scene to the end-state of the previous step** (simple, predictable, the standard for this class of tool). Jumping to a scene resets it to its start unless it was already in progress.

## 4. CCTV in the classroom (run mode)
- Carry Studio CCTV into Classroom: a **numbered grid of camera buttons** along the bottom of run mode; click to switch to view 1–5 (however many); **multi-select** to show several; **number-key hotkeys** (press 1/2/3…) to switch. Reuse `StudioCctvEditor` for authoring.

## 5. Running it (delivery)
- Runs through the **existing code-based session/presenter mode**: instructor enters the code, goes full-screen, sees notes, advances slides. When a Classroom Scene appears, the bottom bar shows the **run controls** (CCTV buttons, jump grid, next/back); the instructor **clicks/space** to advance the stacked effects — participants see it live on screen.

## 6. Presenter / back-end mode
- Position indicator: a **green dot on a tactical-style grid** shows which scene/sector is live (lead-software feel).
- The presenter can **jump** via a panel, or use the existing **select-a-slide → push-live** model (reuse `LiveDirectorView` + `current_slide_id`) to control what the room sees.

## 7. Labelling & intent
- Call the type **Classroom Scene**; a multi-scene one is a **Classroom Scenario**. Distinct from a live Studio scenario (which keeps the event/vote engine). Same asset library, same `.c360` packaging (file 18).

## 8. Change-impact (file 25 — trace it)
Touches: `StudioEvent.trigger` (+`'click'`) and consumers; a new run-time controller shared by presenter + participant renderers; the run-mode bottom bar (CCTV/jump/next-back); presenter position panel. `tsc` clean + flow-test author→preview→presenter→live→participant for a click scene, a multi-scene jump, and CCTV switching.
