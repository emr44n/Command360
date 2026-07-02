# 27 · News Ticker / Lower-Third Marquee Element

*Addition (standalone for now). A draggable, configurable "news channel" ticker for Command Classroom slides (and Studio scenes) — like a BBC/Sky News lower-third.*

## 1. What it is
A new **element type** (a specialised text layer) that renders a continuous right-to-left scrolling ticker with a coloured brand block on the left. Users create it, configure it in a pop-up, then drag/stretch it (usually across the bottom of the slide).

## 2. Create → configuration pop-up
Clicking "Add ticker" opens the reusable pop-up panel (file 15 §8) with:
- **Brand block:** label text (default **"C360 NEWS"**), optional **logo** (default the Command 360 logo), block **background colour** (default red `#C9241A`) and text colour.
- **Ticker text:** a large, **scrollable multi-paragraph text box** — user pastes several paragraphs; separated by a dash/space when rendered (e.g. `… — … — …`).
- **Styling:** ticker **background** (default white), **text colour** (default black), **font + size**.
- **Speed:** default normal tick speed (also editable later).
On **OK**, it's placed on the slide as a draggable element.

## 3. Behaviour
- **Draggable + resizable**, keeps its long marquee aspect; typically stretched to the **full slide width** at the **bottom** (or top).
- **Continuous scroll:** text is **pre-filled** so the strip is full at start, then scrolls **right→left** and loops seamlessly.
- **Speed control** in the properties panel (default normal).
- Layout: brand block left, ticker text vertically centred with padding above/below (Sky/BBC style).

## 4. Editing afterwards (properties panel — same as any element)
Select it → the right-hand **properties panel** shows the full detail section: edit label, logo (upload or URL — same image handling as everywhere), colours, font/size, the scrollable text box, and speed. Same create-then-tweak model as all elements.

## 5. Notes
- It's a **layer**, so it travels in the `.c360` package (file 18) and works in preview/presenter/live like any element (render it in all views — file 25).
- Reuse existing text/image handling; don't build a parallel system.
