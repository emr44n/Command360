# Landing Page Redesign Plan — Command 360

## Design Direction
**Apple-style premium dark** — clean lines, pixel-perfect borders, subtle animations, small labels, background grid effects, gradient glows, inset shadows. No cyberpunk, no gimmicks. Professional, authoritative, trustworthy.

## Design System (from ui-ux-pro-max)
- **Background**: `#07070a` (near-black) with fine grid lines at 3% opacity
- **Cards**: `dark:bg-white/5` with `border border-white/[0.08]` and `[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]` (inset glow from Magic MCP BentoGrid)
- **Labels/Badges**: Tiny uppercase `text-[10px] tracking-[0.2em]` with pill shape, border-white/10
- **Primary accent**: Red-600 (`#dc2626`) — used sparingly for CTAs and key highlights
- **Text hierarchy**: White → White/60 → White/40 for heading → body → muted
- **Border radius**: `rounded-2xl` for cards, `rounded-xl` for buttons, `rounded-full` for pills
- **Animations**: CSS `@keyframes` for fade-up on scroll, smooth 200ms transitions on hover
- **Grid overlay**: Fine 1px lines at low opacity with radial mask fade

## Section-by-Section Plan

### 1. HERO (rewrite)
- Full viewport height, centered text
- Radial gradient glow from top (red at 12% opacity)
- Fine grid overlay with radial mask (fades at edges)
- Small pill badge: `"Built for UK Emergency Services"` with pulsing red dot
- Main heading: Large `clamp(2.5rem,7vw,4.5rem)`, bold, white
  - **New copy**: `"The secure space where emergency teams speak freely."`
  - Gradient span on key word
- Subtitle: `text-white/45`, max-w-xl
  - **New copy**: `"Brief, train, and debrief with confidence. Anonymous feedback, live interaction, and AI-powered insights — built exclusively for those who protect and serve."`
- Two CTAs: Red filled + ghost outline
- Join code input below CTAs
- Browser mockup frame at bottom (keep existing, clean up)

### 2. TRUST STRIP (keep, refine styling)
- Same service icons but with cleaner spacing
- Add subtle top border-line `border-t border-white/[0.06]`
- Dark background matching hero

### 3. FEATURE SECTIONS (rewrite to Bento Grid)
- Replace alternating text+mockup layout with **Bento Grid** (from Magic MCP)
- 3-column grid with varying row spans
- Each card: `dark:bg-white/5`, inset glow shadow, border-white/10
- Icon in rounded circle, small label badge, title, description
- Hover: slight `-translate-y-1`, shadow increase
- Cards for: Live Interaction, Knowledge Testing, AI-Powered, Anonymous & Secure, Real-time Results, Export & Compliance

### 4. SLIDE TYPES (keep, restyle cards)
- Same 6 cards but with premium card styling (inset shadow, cleaner borders)
- Hover effect: border color shifts to type color at 20% opacity

### 5. HOW IT WORKS (keep, restyle)
- Same 3 steps but with numbered circle badges
- Connecting line between steps on desktop
- Premium card styling

### 6. SERVICES / USE CASES (keep, restyle)
- Same 11 service cards with cleaner styling
- Each card shows service icon with its accent color

### 7. OUTCOMES / STATS (keep, restyle)
- Premium card with large stat numbers in gradient text

### 8. TEMPLATES (keep, restyle pills)
- Cleaner pill styling with border-white/10

### 9. PRICING (keep as-is, already uses PricingToggle component)

### 10. TESTIMONIALS (restyle)
- Grid layout with varying card sizes (inspired by Magic MCP testimonial grid)
- Quote icon, text, author with service icon
- Premium card borders

### 11. FINAL CTA (keep, refine)
- Same dark section with radial glow

### 12. FOOTER (keep, refine borders)
- Cleaner border styling, match new card aesthetic

## Files to Modify
1. **`src/app/page.tsx`** — Main rewrite (hero copy, bento grid features, card styling)
2. **`src/app/globals.css`** — Add keyframe animations if needed
3. **No new component files** — keep it all in page.tsx to match existing pattern

## Mobile Fixes (simultaneous)
- Add `overflow-x: hidden` to root `min-h-screen` div
- Ensure all sections use `px-5` padding
- FloatingJoinDock: remove X button, center properly
- All cards responsive: `grid-cols-1` on mobile → multi-col on desktop

## What stays the same
- All data arrays (FEATURES, SLIDE_TYPES, STEPS, USE_CASES, etc.)
- Mockup components (PollingMockup, QuizMockup, AIMockup)
- PricingToggle component
- ScrollReveal component
- FloatingJoinDock (minus X button)
- Footer structure and links
