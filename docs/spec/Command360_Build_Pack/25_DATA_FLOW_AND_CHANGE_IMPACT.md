# 25 · Data Flow & Change-Impact Map

> **Read with file 24.** This maps how each item flows **downstream** — authored →
> saved → preview → presenter → live → participant → debrief — so that when you
> change something in one place, you know every place that must change with it and
> you TEST the whole chain. This is the map for "if I change this here, does it
> still work over there?"

## The contracts (single points of truth — change these and everything downstream is affected)
- **`src/types/slide.ts`** — `SlideContent` (a union), the per-type content shapes (`PollContent`, `WordCloudContent`, `QuizContent`, `QnAContent`, `SurveyContent`, `ContentSlideContent`, `RatingScaleContent`, `OpenTextContent`, `StudioContent` + Studio sub-types: `StudioLayer/Action/Event/Track/Clip/Keyframe/Branch/LayerState`), plus `CanvasElement` and `Slide`.
- **`src/types/session.ts`** — `Session`, `Presentation`, `SessionStatus`.
- **`src/types/realtime.ts`** — `BroadcastEvent` (the LIVE sync contract: `SLIDE_CHANGED`, `RESPONSE_SUBMITTED`, `LIVE_SCENES_UPDATED`, and the `STUDIO_*` family incl. `STUDIO_EVENT_TRIGGERED`).

**TypeScript is your automatic downstream checker.** Change a field on a contract and `npx tsc --noEmit` will flag **every** consumer that no longer matches. A green `tsc` after a contract change is the first proof the chain is consistent — but it does **not** catch missing *rendering* (see the master-snapshot gap below), so runtime flow tests are still required.

## Pattern 1 — three renderers per slide type (the fan-out)
Every slide type is rendered separately in three views, all bound to one content type:

| Slide type | Author (editor) | Presenter / Live | Participant |
|---|---|---|---|
| poll | `slide-forms/PollSlideForm` | `slide-displays/PollResultsDisplay` | `slide-inputs/PollInput` |
| quiz | `QuizSlideForm` | `QuizDisplay` | `QuizInput` |
| word_cloud | `WordCloudSlideForm` | `WordCloudDisplay` | `WordCloudInput` |
| survey | `SurveySlideForm` | `SurveyResultsDisplay` | `SurveyInput` |
| rating_scale | `RatingScaleSlideForm` | `RatingScaleDisplay` | `RatingScaleInput` |
| open_text | `OpenTextSlideForm` | `OpenTextDisplay` | `OpenTextInput` |
| qna | `QnASlideForm` | `QnADisplay` | *(n/a input)* |
| studio | `StudioSlideForm` | `StudioDisplay` | `StudioInput` |

**Rule:** change a content type (or add a slide type) → update **all three** files for it + the DB `slide_type` CHECK + the union in `slide.ts` → `tsc` clean → **test all three views**. Miss one and that view silently breaks.

## Pattern 2 — the canvas/master snapshot (rendered in MANY places)
Canvas elements + the slide-master snapshot are drawn by separate renderers per view:
`editor/SlideCanvas` + `editor/CanvasElementsLayer` (author) · `slides/SlideElementsView` (preview) · `presenter/PresenterSlideDisplay` (presenter/live) · `participant/RoomSceneView` (participant).

> **GAP FOUND (fix this):** the master snapshot is rendered in the **editor and preview** but **NOT in `PresenterSlideDisplay` (presenter) or `RoomSceneView` (participant)** — so masters set in the editor do **not** appear when presenting or on participants' screens. **Fix:** render the master snapshot in **all** views. **Best fix:** extract ONE shared canvas/master renderer used by editor, preview, presenter and participant, so future changes propagate automatically instead of needing 4+ edits.

## Pattern 3 — the live sync chain (realtime)
Presenter/Director **emits** `BroadcastEvent`s over the Supabase realtime channel; Participant **receives** them (and vice-versa for votes/responses). **Rule:** change any `BroadcastEvent` payload → update the **emitter** (`presenter/LiveDirectorView` / `PresenterView`) **and** the **receiver** (`participant/ParticipantView` / `RoomSceneView`) **and** the type — all three together. The spec's Command Live must keep reusing `STUDIO_EVENT_TRIGGERED` (don't add a parallel channel).

## The full lifecycle of an item (trace this for every change)
```
AUTHOR            SAVE                 CONSUME (must all still work)
editor slide-form → /api/slides       → Preview (PreviewMode / SlideElementsView)
SlideCanvas         (slides.content)   → Presenter/Live (PresenterView / LiveDirectorView / *Display)
                                       → Participant (ParticipantView / RoomSceneView / *Input)
                                       → Responses (/api/responses)
                                       → Debrief/Analytics (results/SessionResults, dashboard/reports)
```
Masters add a branch: master editor → `slide_masters` (org-level, file 22) → snapshot stamped on `slides.content._masterSnapshot` → rendered in **every** view above.

## The discipline (what the build MUST do for every change)
1. **Find the contract.** Is the change to `slide.ts` / `session.ts` / `realtime.ts`? If so, expect downstream fan-out.
2. **Grep every consumer** of the field/type before editing; list them.
3. **Update all consumers together** (all three renderers for a slide type; emitter+receiver for a realtime event; all canvas renderers for a master/element change).
4. **`npx tsc --noEmit` clean** — the type-level proof the chain matches.
5. **Runtime flow test** — exercise the item end-to-end (author → save → reload → preview → presenter/live → participant → debrief) and confirm it renders/works in each. `tsc` won't catch a missing renderer (e.g. the master gap); a flow test will.
6. **Prefer consolidation** — where a thing is rendered in 3–4 places, extract ONE shared renderer so the next change is one edit, not four.

## Per-change checklist (fill in before coding)
- Item / field: …
- Contract touched: slide.ts / session.ts / realtime.ts / (none)
- Consumers to update: [editor form] [presenter display] [participant input] [canvas renderers] [emitter+receiver] [API] [analytics]
- Proof: `tsc` clean + flow test through preview + presenter + participant + debrief ✅
