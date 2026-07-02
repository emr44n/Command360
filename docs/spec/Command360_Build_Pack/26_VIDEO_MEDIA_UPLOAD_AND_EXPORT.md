# 26 · Video: Upload, Compression, Playback & Export

*Addition (standalone for now). Lets users upload/use video in Command Studio AND Command Classroom, with compression, quotas, WebM support, the same visual treatments as images, and a metadata-rich MP4 export.*

> **Repo reality (file 24/25):** Studio **already** renders video layers (`StudioLayer.type` includes `video`, `StudioCanvas` has a DOM video overlay + drop). **Classroom does NOT** — `CanvasElement.type` is only `text | image`. The image style block already has `edgeFade` (feather), `borderRadiusPct` (circle/round mask), `borderWidth/Color`, `opacity`, `anim` (fade in/out). Extend all of this to video.

## 1. Upload (Studio + Classroom + dashboard Library)
- Accept **MP4 (H.264)** and **WebM (VP8/VP9)** plus common formats; ingest through the **Library** (user uploads sit beside the system library — file 07).
- **Compress on upload** to **720p default** (1080p option). Downscale **before** encoding (smaller + better perceived quality). Do it **client-side, $0**: **MediaBunny (WebCodecs)** as the primary encoder, **ffmpeg.wasm** as the fallback for unusual source formats. Cap clip length/size (browser tab memory ~4 GB; this tool is for short training clips, not 4K features).
- **Per-account/org storage quota:** each org gets an allocated GB budget; show usage; block/prompt when near the limit. Store in Supabase Storage (org-scoped, London).

## 2. WebM & transparency (ties to file 08)
- **Support WebM upload**, including alpha WebM. **But Safari can't play WebM alpha** — so for *transparent* video that must work cross-browser, convert to the **packed-alpha MP4** pipeline (file 08). Opaque video: WebM/MP4 both fine; keep an MP4 fallback source.
- The system's own transparent assets stay packed-alpha MP4 (reliable everywhere); WebM-with-alpha uploads are transcoded into it.

## 3. Video element = same capabilities as image
Add `video` to `CanvasElement.type` (Classroom) and keep parity with Studio. A video element supports the existing image treatments: **feather/edge-fade, border, circle/rounded mask (`borderRadiusPct`), opacity, blend modes** (file 08), transform/resize.

## 4. Playback settings (properties panel — the "normal software" options)
- **Autoplay on slide** (on/off), **show controls / play button** (on/off), **loop** (on/off), **muted** (on/off), start time/trim, and volume. Research parity with PowerPoint/Canva/Google Slides video options.
- In a live session the presenter controls play/pause; participants see the same state (realtime, file 25).

## 5. Export media player (Studio → MP4)
Studio already has `ExportDialog` + MediaRecorder. Extend it into an **export preview/player** where, before exporting, the user can:
- name the clip, set date, add **tags** (incl. a **CCTV** tag), and pick resolution;
- drop a **draggable text/label overlay layer** on top (e.g. a caption, timestamp, "CCTV") and position it;
- preview the timeline playback, then **Export MP4** (+ still).
Metadata/tags are written to the asset record (and where feasible embedded in the file), so exported clips are searchable in the Library.

## 6. Change-impact (file 25 — do NOT skip)
Adding `video` to `CanvasElement` means updating **every** canvas renderer: `editor/SlideCanvas`, `editor/CanvasElementsLayer`, `slides/SlideElementsView` (preview), `presenter/PresenterSlideDisplay`, `participant/RoomSceneView` — plus upload/library, quota, and the video controls in the properties panel. `tsc` clean + flow-test author→preview→presenter→live→participant.

## 7. Concrete limits, Chrome-only & sharing (added)
- **Chrome/Chromium is a stated requirement** for the web app (video + WebCodecs). **WebM contingency:** detect on load; if a clip is WebM the current browser can't play (e.g. WebM alpha on Safari), **show a warning and simply don't render that clip** — handled in back-end/detection code so a scene never breaks.
- **Per-video size cap ~50 MB** (Canva-like) — compress on upload to hit it; reject/prompt if over.
- **Per-org GB quota** (costed in); show usage; block near limit.
- **Export size preview:** when building/exporting a scenario, **show the total size (scenario + assets)** — the customer hosts it on their allocated space, so the choice is theirs.
- **Sharing:** when a scenario is shared, the author's **custom** images/videos are bundled + uploaded with it (`.c360`, file 18); **system/generic** assets are referenced, not copied.
