# 22 · Slide Masters (account-level)

*Addition to the spec pack. Reusable branded slide layouts for Command Classroom decks — like PowerPoint slide masters / Google Slides layouts / Keynote masters. Some of this is already built; this spec fixes the gaps and sets the target.*

> **Builds on existing code.** The repo already has `src/lib/editor/slide-masters.ts`, `SlideMastersDialog.tsx`, a default master, and a snapshot model (a slide references a master by id in `content._masterId` and carries a `_masterSnapshot` so every renderer can paint it). **Do not rewrite that** — extend it to close these gaps.

## Gaps found in the current build (fix these)
1. **Masters are per-presentation; they must be per ACCOUNT/ORG.** Today masters live in `presentations.slide_masters`. Target: an **account/org-level master library** so a user's masters are available in *every* new deck they create — unique to their account/org.
2. **Masters don't persist server-side yet.** The `slide_masters` migration isn't applied, so masters fall back to per-device localStorage (see file 23). Masters must save to the **database** and sync across devices — no localStorage-only in production.
3. **Clicking a master does nothing / no editor.** The **master editor** must open a proper pop-up (the reusable panel, file 15 §8) to design a master: background, logo/text/image boxes, add images, move/resize.
4. **No page-number element.** Add a **page-number element** for masters (a macro-like field that renders each slide's number automatically), plus optional section/label fields.

## Target behaviour
- **Account/org master library:** `masters` are owned by the org; every deck can use any of them. A migration adds an org-scoped `slide_masters` table (id, org_id, owner_user_id, name, background, elements jsonb, is_default, created_at, updated_at), RLS org-scoped. Keep the per-slide **snapshot** so renderers stay simple.
- **New decks default to blank** (the built-in default master) but the author can pick **any of the account's masters** from the per-slide master selector — which already exists; wire it to the account library.
- **Master editor pop-up:** design/edit a master (background colour/image, branded boxes, add images, page-number/section fields, move + resize). On save, **re-stamp** the snapshot onto slides using that master (the existing `onMasterEdited` / `restampMasterOnSlides` path).
- **Page numbers:** a page-number element on a master auto-shows each slide's index; updates as slides are added/removed/reordered.
- **Portability:** masters travel inside the `.c360` package (file 18) and can be shared via Community (file 19) as part of a deck or as a master/asset pack.

## Phasing
Fold into **Phase 5 (Command Classroom)**: account-level master library + DB persistence + master editor pop-up + page-number element + per-slide selection. Reuse the existing snapshot renderer everywhere (editor, preview, presenter, live).
