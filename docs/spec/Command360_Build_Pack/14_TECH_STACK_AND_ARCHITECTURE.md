# 14 · Tech Stack & Architecture

## 1. Current stack (the repo as built)

The live repo (`command360.vercel.app`, ~42,000 lines) is built on:

| Layer | Tech |
|---|---|
| Framework | **Next.js 16** (App Router), React 19, TypeScript |
| Styling | **Tailwind 4**, **shadcn/ui** |
| State | **Zustand** (~6 stores) |
| Canvas | **Konva / react-konva** (KEEP) |
| Drag/drop | @dnd-kit |
| Charts | Recharts |
| Rich text | TipTap |
| QR | qrcode.react |
| AI | **@google/genai** (Gemini) |
| Exports | pptxgenjs, xlsx, jspdf, html2canvas |
| Backend | **Supabase** (Postgres / Auth / Realtime / Storage) |

Route groups: `(auth)` / `(dashboard)` / `(presenter)`; plus `join` / `participate` / `command-studio`.

## 2. What's already built (confirm & harden)

- **Command Studio** is substantially built (~9k component lines): `StudioEditor`, `StudioCanvas` (Konva), `StudioGallery`, `StudioProperties`, `StudioEvents`, `StudioTimeline` + libs `playback-engine`, `timeline-manager`, `event-playback`, `session-recorder`.
- DB tables: `presentations`, `slides`, `sessions`, `participants`, `responses`, `qna`.
- Slide types: poll / word_cloud / quiz / qna / survey / content / rating_scale / open_text / **studio**.
- Per-product mini-dashboards + QR join already exist.
- **Realtime** is wired: a typed `BroadcastEvent` union including **`STUDIO_EVENT_TRIGGERED`** with `layerStates` — the instructor → output loop is already in place (this powers "live cards").

## 3. Realtime event model (reuse it)

- The instructor's actions broadcast typed events; participant clients apply them.
- **`STUDIO_EVENT_TRIGGERED`** carries layer states → use this for live scene/card sync. **Do not build a new realtime channel** for live cards/scenes.

## 4. The blockers to fix (Phase 0–1)

1. **RLS:** replace all `USING (TRUE)` with `org_id` + role-scoped policies (file 05). *World-readable today = GDPR blocker.*
2. **Multi-tenancy:** add organisations / memberships / roles (file 05).
3. **Konva transform/rotation bugs:** fix free-transform + rotation.
4. **Scenario data model:** promote the `studio` slide-JSON to first-class `scenarios → views → layers/phases → injects → actions/hotspots` tables (file 04 §3), behind a stable interface during migration.

## 5. Hosting & residency (file 05)

- Supabase **London region (eu-west-2)**; Vercel functions region **London**.
- Sub-processors: Supabase, Vercel, Google Gemini. No personal data to Gemini; disable training-on-your-data.

## 6. New technical capabilities to add

| Capability | Approach | File |
|---|---|---|
| True alpha for solids | **packed-alpha MP4 + WebGL shader** | 08 |
| Background removal | **Transformers.js + RMBG** (in-browser, $0) | 08 |
| Polygon / lasso / magic-wand masking | **Konva clip masks** (in-browser, $0) | 08 |
| Erase/restore brushes | paint on the alpha **mask** (in-browser, $0) | 08 |
| Video export | **browser MediaRecorder** (play-and-capture → MP4) | 06 |
| Flow-map | **React Flow / xyflow** | 10 |
| AI asset pipeline | **Wan Alpha / Kling / SD+AnimateDiff** (own the output) | 08 |

## 7. Accessibility (gating)

Keyboard navigation, colour contrast, reduced-motion — public-sector buyers require it. Build in from the start.
