# 08 · VFX, Transparency & Masking

This file is how visuals actually work on screen — and how to build the asset library **legally and cheaply**. Three parts: blend/transparency rules, the effects-library strategy, and the cut-out/masking tools.

---

## PART A — Blend modes & transparency (the rule that decides everything)

Plain MP4 cannot carry transparency. So how an asset is composited depends on what it is:

| Asset type | Method | Why |
|---|---|---|
| **Bright effects on black** — fire, flames, sparks, light, water spray | **Screen blend** (or **Add** for glows/sparks) | Black drops out; works everywhere incl. iPad; lightweight. Dark detail is lost (acceptable for bright FX). |
| **White-background effects** — some overlays, grain | **Multiply** | White drops out. |
| **Already-keyed alpha** (transparent PNG / packed-alpha MP4 / WebM-alpha) | **Normal** (no blend) | Composites cleanly. |
| **Solid objects** — people, vehicles, triage area, props, **dark smoke** | **True alpha** = **packed-alpha MP4 + WebGL shader** | These go faint/see-through under screen blend. Packed-alpha preserves all detail, works on iPad, GPU-light, no AI. **Not** plain MP4, **not** WebM (no iPad support). |

> **Critical:** people/vehicles are NOT bright-on-black — they must use **true alpha**, never screen blend.

### Upload source-type selection (drives the default)
On upload the user picks the source type → the system applies the right default blend and exposes sliders to fine-tune and **save**:
- bright-on-black → **screen / add**
- white-bg → **multiply**
- pre-keyed alpha → **normal**
- solid-needs-cutout → run cut-out (Part C)

**Sliders:** blend mode · opacity · brightness/contrast · **hue-shift** (colour-match the effect to the scene). Saveable per asset.

### Web efficiency
- **MP4 (H.264/H.265)** is the most compatible + compressed → use it.
- **Screen-blend MP4** is the lightest and most compatible → default for bright FX.
- **Packed-alpha MP4** = the balance for solids/dark smoke (alpha packed into the frame, un-packed by a shader).
- **WebM-alpha = avoid** (no iPad).

---

## PART B — Effects-library strategy (OWN it; stock is off the table)

> **Premium stock cannot be embedded in Command 360 — legally.** ActionVFX's licence (and the standard stock model) explicitly bars including the clips in any *software program* as a separate/reusable file, and bars using them to train AI. ProductionCrate, MyCreativeFX etc. carry the same redistribution restriction. **You may only use stock in your own finished marketing videos — never as the in-app asset shelf.** It's also expensive (the ActionVFX fire bundle alone is ~£2k; a full library $10–20k+).

**So Command 360 must OWN its library.** Routes (use a mix):

1. **AI-generate originals (cheapest, primary route).**
   - For **true-transparent** clips: **Alibaba Wan (Wan Alpha)** — open-source, native alpha, the leader for transparent VFX (potentially self-hosted → ~$0/clip). Or **Stable Diffusion + AnimateDiff + ControlNet** (open-source, pixel-level control, steeper).
   - For **bright-on-black** clips you screen-blend: Runway / Kling / Veo (no native alpha, but bright-on-black is fine). **Kling** = cheapest for volume.
   - For **stills** (scorch, static smoke, damage overlays, embers): any image model (Flux / Imagen / SDXL).
   - **You own the output** (confirm each tool's commercial terms — generally granted, and crucially redistributable inside your product).
   - **IP caveat:** don't feed others' clips into AI or clone a specific paid clip. Fire itself isn't copyrightable — generate **original** effects from text prompts.

2. **Commission a VFX artist (work-for-hire).** Pay once, **own it forever**, ship it. Best for a handful of "hero" assets (structure fire, window fire, smoke). Fiverr/Upwork.

3. **Make-your-own tools (you own the output):** **Particle Illusion** (now Boris FX, free version) · **EmberGen** (paid, fast, brilliant fire/smoke) · **Blender** (free).

**Recommended approach:** AI-generate for v1 (Wan Alpha for solids/transparent, generate-on-black + screen-blend for bright), commission a few hero assets, grow over time.

### Asset-production methodology (the how-to — a companion deliverable)
For consistency across a character's Looks and a sector's set: build **character sheets** (a fixed reference per character) and reusable **prompt templates**, then generate each Look against the same reference. (This methodology is its own document — flagged, not fully specified here.)

### Per-clip playback (Canva-confirmed) — set on every asset
Play once / Loop / Ping-pong / Hold last frame; entrance/exit/both animation + speed + delay; timeline with trim handles + audio waveform + fade in/out (file 06).

---

## PART C — Cut-out & masking (free, in-browser, $0 per use)

Two complementary tools — they do **different jobs**, keep **both**:

### 1. Auto background removal (cut the OUTSIDE away)
- Removes the outer background — e.g. a house from the sky.
- **Runs in the browser, on the user's device** → **$0 per image**, images never leave the device (privacy win), works on mobile.
- **Use the Transformers.js route** (Hugging Face) with an **RMBG** model — permissive licence, safe to ship.
  - Reference implementation: Addy Osmani's `bg-remove` (client-side, Transformers.js, permissive).
  - Live demo to test: `huggingface.co/spaces/Xenova/remove-background-web`
- ⚠️ **Avoid `@imgly/background-removal`** for production — it's **AGPL** (risky for a closed commercial product). Avoid remove.bg / Canva API — they charge per image.
- **Cannot** cut a hole in the middle — that's the polygon tool.

### 2. Polygon / point masking (cut a HOLE anywhere — e.g. a window)
- **Free, no AI** — vector masking, native to **Konva** (your canvas engine).
- Click points → polygon (3 = triangle, 4 = box…); **drag any vertex** to reshape (the Particle Illusion technique).
- The polygon becomes a **hole** → layers underneath (fire/smoke) show through.
- **The layer trick (window on fire):** original house at the **bottom** (frame, curtains visible) → fire/smoke in the **middle** → a **top copy with the window masked out** → fire shows through the window. (A clip-mask on the top layer.)
- Add **magic-wand** + **lasso** select too (also free, browser-side) for other ways to cut.

### Erase / restore — refine after auto-removal
The AI gives a mask; refining is just **painting on that mask** (no AI, $0):
- **Erase** brush (rub out leftover background) + **Restore** brush (bring back over-removed parts).
- **Brush-size slider** (default ~20); **Show original** before/after toggle; **Done → Apply**.

### The pop-up panel pattern (reuse it)
All of the above open in a **focused editing modal** (Photoshop-filter-dialog feel): opens over the canvas, has its own toolset, do the job, hit Apply, it closes. **One reusable modal shell**, different tools inside, used for:
- BG-removal refine (erase/restore brushes)
- Polygon masking (window cut)
- Filters / FX / colour-match
- Card editing
