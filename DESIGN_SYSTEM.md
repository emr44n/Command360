# Command 360 — v5 Design System (the "regimental grid" system)

The home page (`src/app/page.tsx`) is the canonical reference. This document is
the recipe for bringing every front-facing page onto the same system. **Never
change copy/content — only the visual treatment.**

## Principles
- **Rigid, line-based, regimental.** Straight corners everywhere — **no rounded
  corners** (`rounded-*` is banned in v5 surfaces). Structure is drawn with 1px
  borders and bordered grids, not cards-with-radius.
- **Dark base** `#0F1216`; dark panels `#16191E`; footer `#0A0C0F`. Light
  "shout-out" sections are cream `#EFECE4` with ink `#16191E`.
- **Red accent** `#C9241A`. Agency colours: fire `#D94B3D`, police `#3E6DC4`,
  ambulance `#2E9E63`, armed/S&R `#c98a2a`/`#8a7d3a`, coastguard `#2592a3`,
  prison/LA `#6a5ea8`.
- **Type:** `.ff-display` (Archivo, headings, extrabold/black), `.ff-body`
  (IBM Plex Sans), `.ff-mono` (IBM Plex Mono — all labels/eyebrows, uppercase,
  tracked). White bold numbers/words stand out against gray supporting text.
- **Depth without gloss:** grain (`.v5-grain` overlay), soft radial colour
  glows in corners (faded, transparent), faint square grid (74px) masked in.
- **Motion:** scroll reveal via `data-reveal` (+ `--rd` stagger), `[data-rule]`
  for the underline sweep, `.v5-pop` hover, `.v5-glow` border-trace on red CTAs,
  cursor spotlight via `<SpotlightCard>`, the cursor caret on the join field.

## Shared building blocks (use these — do not re-implement chrome)
- `src/components/site/SiteShell.tsx` — wraps a page: dark backdrop, TopBar,
  SiteHeader, RevealManager, ScrollProgress, `<main>`, shared FAQ+CTA, footer,
  FloatingJoinDock. **Every front page renders `<SiteShell>…</SiteShell>`** and
  supplies only its own hero + body sections. `faqCta={false}` to suppress the
  shared FAQ/CTA where it doesn't fit.
- `src/components/site/SiteHeader.tsx`, `SiteFooter.tsx`, `SiteFaqCta.tsx` —
  the shared chrome (don't duplicate per page).
- `src/components/site/primitives.tsx`:
  - `<PageHero eyebrow title lede accent>{cta buttons}</PageHero>` — the dark
    hero band (handles header clearance, grain/grid/glow, reveal).
  - `<Eyebrow n>` — mono red label.
  - `<LightSection> / <DarkSection> / <Container>`.
- `src/components/home/SpotlightCard.tsx` — cursor-spotlight card (`glow`).
- `src/components/home/V5Chrome.tsx` → `V5AuthButton` (solid red CTA opens auth;
  carries `.v5-glow` border-trace).

## Card-grid pattern (capabilities / services / features)
A bordered grid, one shared left/top border, each cell adds right+bottom:
```tsx
<div className="grid sm:grid-cols-2 md:grid-cols-3 border-l border-[rgba(20,25,30,0.16)]">{/* light */}
  <SpotlightCard glow={`${c}26`} className="v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
    <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash']: `${c}24` }} aria-hidden />
    <div className="relative"> {/* square colour accent, ff-display title, gray desc */} </div>
  </SpotlightCard>
</div>
```
On dark: `border-white/14`, white titles, `#9aa0a8` body. Use `data-reveal` +
`v5-pop` on dark cells.

## Conversion recipe (per page)
1. Replace `<PublicLayout>` with `<SiteShell>`. Drop the page's own header,
   footer, **and its own final CTA section** (the shell provides FAQ+CTA).
2. Replace the hero with `<PageHero>` (keep the exact headline/eyebrow/lede;
   put the keyword in `text-[#C9241A]`).
3. Restyle every body section to v5: alternate `LightSection`/`DarkSection`,
   `Eyebrow` labels, `[data-rule]` divider under section headings, bordered
   card grids, square accents, ff-display headings, ff-mono labels. **No rounded
   corners, no gradient text, no shadows-as-decoration.**
4. Keep all copy, links, icons, data, metadata, and interactive behaviour.
5. Mobile: grids collapse to 1–2 cols; check no overflow/overlap.
6. Validate: `npx tsc --noEmit` clean, then screenshot desktop + mobile and
   eyeball spacing/overlap before moving on.

Reference implementation: `src/app/product/page.tsx` (already converted).
