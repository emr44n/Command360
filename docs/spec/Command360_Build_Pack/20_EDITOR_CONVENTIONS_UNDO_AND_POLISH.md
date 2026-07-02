# 20 · Editor Conventions, Undo/Redo & UI Polish

*Addition to the spec pack. Make every editor feel like familiar software (Canva / PowerPoint / Google Slides) — consistent file operations, real undo/redo, and smooth micro-animations. Applies across Command Studio, Command Classroom and the Card/Media creator.*

## 1. Familiar file operations (identical in every editor)
Same labels, same placement, in Studio AND Classroom: **New · Open / Recent · Save · Save As · Duplicate · Rename · Delete · Import (.c360) · Export (.c360)**. This consistency is the point — users already know this menu from other software.

- **Save model:** debounced **autosave** to the DB **plus** an explicit Save; a clear dirty/saved indicator ("Saving…" / "All changes saved"). **Save As** clones to a new item. Import/Export use the `.c360` v2 package (file 18).

## 2. Undo / Redo — use `zundo` (research-backed for this stack)
The repo already uses **Zustand**, and has a **hand-rolled `undoStack` in `SlideEditor` only**. Replace it with one consistent system: **`zundo`**, the `temporal` middleware for Zustand (production-used by Stability AI, Yext, and others), wrapped around the Studio + editor document stores.

- **`partialize` to snapshot only DOCUMENT state** (objects, transforms, blend/opacity, timeline, playback, looks) — **not** ephemeral UI state (selection, open panels, zoom). Otherwise undo wrongly toggles panels.
- **Coalesce rapid changes** with a throttle/equality function so a single drag = **one** history entry, not hundreds. (Konva's own guidance: drive the canvas from store state and snapshot the state — don't rely on `node.toJSON()` serialization in a large app.)
- **Shortcuts + buttons:** Ctrl/Cmd+Z undo · Ctrl/Cmd+Shift+Z (or Ctrl+Y) redo · Ctrl/Cmd+S save. Undo/Redo buttons enable/disable from `pastStates`/`futureStates` length. A "Reset/Clear" clears history.

## 3. Micro-animations & polish (consistent, calm)
- Panels and side-drawers **slide in/out** — never just appear/disappear. Inspector, library and pop-up panels animate open/close.
- Animate labels, hover/press states, and add/remove of canvas/timeline items; brief, consistent easing + timing tokens across the whole app.
- Use the **v5 motion utilities already in `globals.css`** (file 15) — don't invent new ones. All decorative/looping motion respects `prefers-reduced-motion`.

## 4. Consistency principle
Every create/edit surface shares the same file menu, the same undo/redo, the same import/export, and the same panel/animation conventions. A user who learns one editor knows them all.

## 5. Phasing
Fold into the editor phases: **Phase 2 (Command Studio)** and **Phase 5 (Command Classroom)** each include the file menu + zundo undo/redo + the `.c360` import/export + the slide-in panel polish as DONE-WHEN items. The Card/Media creator (Phase 4) inherits the same conventions.
