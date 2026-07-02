# 33 · Asset Looks & Action Sequences

*Day-one. Stateful assets (xVR-style "faces/Looks") + a human action-sequencing UI on Injects. Grounded in the repo: `StudioEvent.actions[]` (code name stays; UI says **Inject**) and `StudioAction` (with `property:'src'`, `delay`, `duration`, `endBehaviour`) already exist — ADAPT them, don't rebuild.*

## 1. Asset Looks (library)
- An **asset** may hold multiple **Looks**: ordered variants of the same thing (fire: *small → growing → large → large+dark smoke*; character: *walking / idle / radio-talk / walk-away*; vehicle: *intact / damaged / burnt-out*). Each state = its own media file + name + auto-thumbnail (file 30 §3 thumbnails, ~2s frame, adjustable).
- **Library UI:** ONE card per asset; a Look strip/count badge expands to show Looks. Search matches Look names too.
- **Creating:** upload multiple files and group as one asset; add a state to an existing asset; reorder/rename Looks (file 28 reliability rule: drag-reorder + double-click rename rock solid). Users (org-scoped) and super-admin (system library) both can.
- **Data:** `assets` (id, org_id|system, name, category, tags…) + `asset_Looks` (id, asset_id, name, position, media_url, thumb_url, default). Single-file assets are just one-Look assets — no special casing.

## 2. Canvas & layers
- Dragging a stateful asset places ONE layer bound to the asset with `currentLookId` (default Look). Properties panel shows a **Look dropdown** with thumbnails. Swapping state preserves position/size/mask/blend/loop settings.
- `StudioLayer` gains `assetId` + `currentLookId` (keep `src` as the resolved file for playback — downstream renderers unchanged, file 25).

## 3. "Switch Look" action (the star)
- New action kind in the Inject editor: **Switch Look** — target layer (dropdown of on-canvas layers **or click-to-pick on canvas**), choose target Look (thumbnail dropdown), **transition = crossfade** (duration, default ~400ms) | cut.
- Under the hood it drives the EXISTING `property:'src'` swap mechanic + opacity crossfade — adapt in place.

## 4. Action sequencing UI (PowerPoint model)
- An Inject's actions render as an **ordered list** in the side panel. Each action row: target layer · kind (**Move / Switch Look / Show–Hide / Playback (play·pause·loop N) / Wait / Volume**) · params · duration/easing · **Start: after previous | with previous | after delay (ms)**.
- "After previous" computes the chain from prior durations (maps onto existing `delay` — the UI does the maths, the engine stays as-is). Add/duplicate/reorder/rename actions; grouped items move together.
- **Worked example:** Inject "Commander arrives" → A1 Move on-screen (state *walking*); A2 (after previous) Switch Look → *idle*. Inject "Radio call" → Switch Look → *radio-talk*. Inject "Leaves" → A1 Switch Look → *walk-away*; A2 (with previous) Move off-screen; end: fadeOut.
- Composes with **Classroom Scene** (file 28): each click fires the next Inject; its action chain runs.

## 5. Change-impact (file 25)
Touches: `slide.ts` (StudioLayer fields, action kind), Inject editor panel, canvas drag/properties, library (asset grouping, upload, thumbnails), `.c360` bundling (Looks travel with the asset, file 18), all Studio renderers + Classroom Scene runner. `tsc` clean + flow-test: author stateful asset → place → Inject chain (move→state→state) → preview → presenter/live → participant.

## 6. Phasing
- **Phase 2 (Studio):** layer `assetId/currentStateId`, Switch-Look action, sequencing UI.
- **Phase 4 (Library):** asset grouping/Looks, upload+thumbnails, Look strip UI, `.c360` bundling.
- **Phase 9:** flow-test the worked example end-to-end in every view.

> **Vocabulary note (file 34 §7):** UI = Inject / Action / Look / Switch Look. Code keeps `StudioEvent` etc. (file 24). Generic words stay generic.
