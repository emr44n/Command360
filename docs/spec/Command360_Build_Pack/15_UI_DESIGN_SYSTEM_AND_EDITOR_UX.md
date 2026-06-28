# 15 · UI Design System & Editor UX

> **Ground truth is the repo, not this file.** The live system is defined in
> `src/app/globals.css` (tokens + utility classes) and demonstrated on
> `src/app/page.tsx` (canonical reference). The recipe lives in the repo-root
> `DESIGN_SYSTEM.md`. **Use the repo's own tokens/classes everywhere — never
> invent values, never hardcode hex on app surfaces.**
>
> ⚠️ **IGNORE `design-system/command-360/MASTER.md`.** It is a stale
> auto-generated template (blue/green "cybersecurity", Poppins/Open Sans,
> rounded corners, drop-shadows, "cyberpunk" style). It does **not** describe
> this product. If anything ever conflicts with `globals.css`, `globals.css`
> wins.

## 1. Visual direction — v5 "regimental grid"

Rigid, line-based, tactical, broadcast/operations feel — not toy-like.
**No rounded corners on surfaces** (`rounded-*` is banned in v5; every token
radius is forced to `0px`). Structure is drawn with **1px borders and bordered
grids**, never cards-with-radius, never shadows-as-decoration, never gradient
text. The app is **dark throughout**; marketing pages add **cream "shout-out"
bands**. Depth comes from film grain, a faint square grid, and soft radial
colour glows in corners — never gloss. Accessibility: keep contrast, support
`prefers-reduced-motion`, keyboard nav.

## 2. Tokens

### 2a. App surfaces — shadcn CSS variables (`:root` === `.dark`, identical dark tokens)
Used by dashboard, Studio, editor, presenter, participant, auth. Reference via
Tailwind utilities (`bg-background`, `text-foreground`, `border-border`,
`bg-primary`, `text-muted-foreground`…) — **never** hardcoded hex.

| Token | Value |
|---|---|
| `--background` | `#0F1216` |
| `--foreground` | `#ececea` |
| `--card` / `--popover` | `#16191E` |
| `--primary` / `--destructive` / `--ring` | `#C9241A` |
| `--primary-foreground` / `--accent-foreground` | `#ffffff` |
| `--secondary` / `--muted` / `--accent` | `#1b1f25` |
| `--muted-foreground` | `#9aa0a8` |
| `--border` / `--input` | `#262b32` |
| `--sidebar` | `#0A0C0F` |
| `--radius` (and every `--radius-*`) | `0px` — square |

**Charts / agency colours** (token + meaning):
`--chart-1 #C9241A` red · `--chart-2 #3E6DC4` police blue ·
`--chart-3 #2E9E63` ambulance green · `--chart-4 #c98a2a` armed/S&R ·
`--chart-5 #6a5ea8` prison/LA. Extra agency hues (from `DESIGN_SYSTEM.md`):
fire `#D94B3D`, coastguard `#2592a3`, S&R secondary `#8a7d3a`.

### 2b. Marketing / home — v5 hex (the `.v5` scope, hardcoded by design)
| Token | Value | Use |
|---|---|---|
| `--v5-ink` | `#0F1216` | dark hero / dark bands |
| `--v5-panel` | `#16191E` | dark panel / stat band |
| `--v5-deep` | `#0A0C0F` | footer |
| `--v5-paper` / `--v5-paper-2` | `#EFECE4` / `#E7E3DA` | cream light bands |
| `--v5-accent` | `#C9241A` | primary red |
| `--v5-accent-hi` / `--v5-accent-press` | `#d10a00` / `#a91d14` | vivid / pressed red |
| `--v5-line-d` / `--v5-line-l` | `rgba(255,255,255,.10)` / `rgba(20,25,30,.16)` | hairline (dark / light) |

## 3. Fonts (loaded via `next/font/google` in `src/app/layout.tsx`)

| Helper class | Family | CSS var | Use |
|---|---|---|---|
| `.ff-display` | **Archivo** (extrabold / black) | `--font-archivo` | headings |
| `.ff-body` | **IBM Plex Sans** | `--font-plex-sans` | body |
| `.ff-mono` | **IBM Plex Mono** | `--font-plex-mono` | all labels / eyebrows — UPPERCASE, tracked |

White bold numbers/words stand out against gray (`#9aa0a8`) supporting text.
(The shadcn tokens `--font-sans`→Inter and `--font-mono`→Geist Mono remain for
default components, but v5 typography uses the `.ff-*` helpers above.)

## 4. Utility classes & motion (all defined in `globals.css` — use, don't re-implement)

- **Texture / structure:** `.v5-grain`, `.grain-overlay`, `.hero-grid`,
  `.hero-mesh`, `.bg-dot-grid`, `.bg-line-grid`, `.section-rule`.
- **Cards:** `.v5-card` (cursor wash — set `--v5-wash`), `.card-dark`,
  `.card-light`, `.card-hair` (set `--hair`).
- **Scroll reveal** (server-rendered + `RevealManager` adds `.is-in`):
  `[data-reveal]`, `[data-rule]` (underline sweep), `[data-word]`; stagger via
  `--rd`.
- **Accent motion:** `.v5-glow` (red-CTA border-trace), `.v5-pop` (hover lift),
  `.v5-pulse`, `.v5-seal`, `.v5-marquee`, `.v5-bar`, `.v5-num`, `.v5-caret`,
  `.v5-tab[data-active="true"]`.
- **Cursor spotlight:** `.spotlight-card` / the `<SpotlightCard>` component.
- All decorative/looping motion is stripped under `prefers-reduced-motion` —
  keep new motion behind the same guard.

## 5. Shared components (build with these — do not duplicate chrome)

- **Marketing chrome (`src/components/site/`):** `SiteShell` wraps every
  front-facing page (dark backdrop, TopBar, header, RevealManager,
  ScrollProgress, `<main>`, shared FAQ+CTA, footer, FloatingJoinDock — pass
  `faqCta={false}` to suppress the shared FAQ/CTA). Plus `SiteHeader`,
  `SiteFooter`, `SiteFaqCta`.
- **Primitives (`site/primitives.tsx`):**
  `<PageHero eyebrow title lede accent>{cta}</PageHero>` (dark hero band, handles
  header clearance + grain/grid/glow + reveal), `<Eyebrow n>` (mono red label),
  `<LightSection>`, `<DarkSection>`, `<Container>`.
- **Home (`src/components/home/`):** `SpotlightCard`, `V5Chrome` →
  `V5AuthButton` (solid red CTA that opens auth, carries `.v5-glow`),
  `RevealManager`, `ScrollProgress`, plus heroes / marquees / testimonials.
- **App UI — shadcn (`src/components/ui/`, style "new-york", lucide icons,
  cssVariables):** alert-dialog, avatar, badge, button, card, collapsible,
  color-picker, dialog, dropdown-menu, icon-tooltip, input, label, popover,
  progress, scroll-area, select, separator, sheet, skeleton, slider, sonner
  (toasts), switch, tabs, textarea, tooltip. Add new shadcn components via the
  CLI into this folder; theme comes from §2a tokens automatically.

## 6. Conversion recipe (per front-facing page)

1. Wrap in `<SiteShell>`; drop the page's own header, footer **and its own final
   CTA** (the shell provides FAQ+CTA).
2. Hero → `<PageHero>` (keep the exact headline/eyebrow/lede; put the keyword in
   `text-[#C9241A]`).
3. Body → alternate `LightSection`/`DarkSection`, `Eyebrow` labels, `[data-rule]`
   divider under section headings, bordered card grids, square accents,
   `.ff-display` headings, `.ff-mono` labels. **No rounded corners, no gradient
   text, no shadows-as-decoration.**
4. Keep all copy, links, icons, data, metadata, behaviour. Mobile: grids
   collapse to 1–2 cols, no overflow/overlap.
5. Validate: `npx tsc --noEmit` clean → screenshot desktop + mobile before moving
   on. Reference: `src/app/product/page.tsx` (already converted);
   `src/app/page.tsx` is canonical.

---

## 7. Editor UX patterns (borrowed, validated)

### From **Figma Motion**
- **Keyframe per property** (position, scale, rotation, opacity) + **auto-keyframe** (records changes while the playhead moves).
- **Presets that stack or sequence** (fade/move/scale) → "play together vs one after another".
- **Right panel grouped:** Transform · Layout (align) · Appearance · Fill.
- **Collapsible timeline** → minimise to just layers.
- **Full-screen edit mode** (hide browser chrome).
- (Skip Figma's Dev-Mode/code-export — irrelevant here.)

### From **Canva**
- **Left side panel** that slides in with categories.
- **Element animation:** on enter / on exit / both + speed + delay.
- **Timeline with trim handles** per element + audio waveform + fade.
- **Hover-to-preview** assets (~3-sec autoplay) in a side-card.

## 8. The pop-up panel pattern (reusable modal)

A **focused editing modal** (Photoshop-filter-dialog feel): opens over the canvas, carries its own toolset, does one job, **Apply** closes it. **One shell, many uses:**
- BG-removal refine (erase/restore brushes + size slider + before/after toggle)
- Polygon masking (window cut)
- Filters / FX / colour-match
- Card editing

## 9. Library panel pattern

Grid ⇄ list toggle · search · hover-preview in a scrollable side-card · tabs `Library / Placed / Templates` · click → details in the side-card → drag to canvas. (Structure can match XVR; **the skin must not** look like XVR — it follows the v5 system above.)

## 10. Reference deliverables

Concept HTML pages produced during design (visual reference only — the build follows the v5 tokens in §1–6, not these mockups' incidental styling):
- `command360-studio-editor.html` — the editor (library/inspector/timeline/broken-event/audio+transcript)
- `command360-library-and-characters.html` — library + Looks + casualty workflow + transparency rule
- `command360-media-and-multiviewer.html` — card creator + multiviewer
- `command360-inject-engine-v2.html` — inject engine + action catalogue
- `command360-naming-structure-map.html` — naming map
