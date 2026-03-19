# Command 360 — Comprehensive Restructuring Plan

## Research Summary

Based on studying Mentimeter, PowerPoint, DeckDeckGo, Claper, and Slidev patterns, plus dashboard UX best practices, here is the restructuring plan to make Command 360 a polished, production-quality interactive presentation tool.

---

## PHASE 1: Dashboard Overhaul (Main Hub)

### 1.1 Dashboard Page Redesign
**File:** `src/app/(dashboard)/dashboard/page.tsx` + `DashboardStats.tsx`

Current state: Basic welcome, inline stats, quick create pills, flat presentation list.

**Changes:**
- **Hero welcome card** with gradient background, user avatar, "Good morning/afternoon" time-aware greeting
- **Stats cards** in a 2x2 or 1x4 grid with proper card styling (icon, value, label, trend indicator)
  - Total Decks, Active Sessions (with live pulse), Total Participants, Total Responses
- **Quick Actions row** — 3 prominent action cards:
  - "Create New Deck" (large + icon, primary CTA)
  - "Use a Template" (template icon, links to templates page)
  - "Join a Session" (link icon, for testing)
- **Recent Activity feed** — show last 5 actions (created deck, ran session, etc.)
- **My Decks section** with:
  - Grid/List toggle (save preference to localStorage)
  - Sort options (Last modified, Created date, Name A-Z, Name Z-A)
  - Search/filter bar
  - Deck cards with: thumbnail preview, title, slide count, last modified, quick action dots (Edit, Duplicate, Present, Archive, Delete)
  - Active session badge on decks with live sessions
  - Empty state with illustration + CTA

### 1.2 Presentation Grid Upgrade
**File:** `src/components/presentations/PresentationGrid.tsx`

**Changes:**
- Add grid/list view toggle
- Add sort dropdown (Last modified, Name, Slide count)
- Add search input filter
- Card redesign: 16:9 thumbnail placeholder with slide type icons, hover overlay with quick actions
- Right-click context menu or "..." dropdown per card: Edit, Duplicate, Present, View Results, Archive, Delete
- "Duplicate" action calls existing `/api/presentations/[id]/duplicate`
- Deck status indicators: draft (no sessions), active (has live session), completed (has ended sessions)

### 1.3 Quick Create Enhancement
**File:** `src/components/dashboard/QuickCreate.tsx`

**Changes:**
- Add rating_scale and open_text to quick create options
- Make pills larger with descriptions on hover
- Add "Blank Presentation" as first option
- Link to templates gallery as last option

---

## PHASE 2: Template Gallery Polish

### 2.1 Template Gallery UX
**File:** `src/components/presentations/TemplateGallery.tsx`

Current state: Already has 10 templates in 3 categories with search + filter. Very solid foundation.

**Changes:**
- **Template preview modal** — click a template card to see full slide list in a lightbox before creating
  - Shows each slide's type badge, title, and a mini preview
  - "Use this template" button in the modal
  - "Customise first" option that creates but doesn't auto-redirect
- **Template card improvements:**
  - Add estimated duration badge (based on slide count × ~45sec avg)
  - Add difficulty/complexity indicator (beginner/intermediate/advanced)
  - Better visual hierarchy with slide type distribution bar (colored segments showing what % of slides are each type)
- **Featured/recommended section** at top (curated picks)
- **"Create your own template"** card at end of each category — saves current deck as template (future feature placeholder)

### 2.2 Public Templates Page
**File:** `src/app/templates/page.tsx`

**Changes:**
- Make this a public-facing page showing template categories without auth
- Link to sign up / login to use templates
- SEO-optimized for "emergency services presentation templates"

---

## PHASE 3: Slide Editor Polish

### 3.1 Editor Canvas Improvements
**File:** `src/components/editor/SlideCanvas.tsx`

Current state: Already has device preview (desktop/tablet/phone), dark background, inline styles. Good foundation.

**Changes:**
- **Click-to-edit titles** — Already works, but add a visible pencil icon on hover
- **Slide content editing inline** — For poll/quiz options, allow clicking directly on option text in the canvas to edit (not just in the settings panel)
- **Slide background color picker** — Add to content slides (content type already has background_color field)
- **Zoom controls** — Add zoom in/out buttons (75%, 100%, 125%, Fit) in the toolbar
- **Grid/snap indicators** — Subtle alignment guides when editing

### 3.2 Slide List Improvements
**File:** `src/components/editor/SlideList.tsx`

Current state: Mini thumbnails with drag-and-drop. Good.

**Changes:**
- **Multi-select** — Shift+click to select multiple slides, then bulk delete/duplicate/move
- **Right-click context menu** on thumbnails: Duplicate, Delete, Move Up, Move Down, Copy, Paste
- **Slide grouping/sections** — Optional section dividers (like PowerPoint sections) — "Introduction", "Questions", "Wrap-up"
- **Collapse/expand** slide list panel

### 3.3 Settings Panel Improvements
**File:** `src/components/editor/SlideSettings.tsx`

**Changes:**
- **Collapsible sections** with smooth animation (Slide Settings, Options, Advanced, Speaker Notes)
- **Design tab** — Add a second tab for slide-level design options (background color, text alignment, font size) — for content slides
- **AI Generate button** — For quiz slides, add "Generate with AI" button that calls `/api/ai/generate-questions` with a topic prompt
- **Slide transitions** — Add a transition selector (fade, slide, none) stored in slide content

### 3.4 Toolbar Improvements
**File:** `src/components/editor/SlideEditor.tsx`

Current state: Has undo/redo, device preview, duplicate. Good.

**Changes:**
- **Keyboard shortcuts overlay** — Press `?` to show all shortcuts
- **Slide count / position indicator** — "Slide 3 of 12" in toolbar center
- **Presentation timer estimate** — Based on slide count × avg time
- **Auto-save indicator** — Already exists, make more prominent with last saved timestamp
- **Fullscreen editor mode** — Hide sidebar nav for distraction-free editing

---

## PHASE 4: Preview Mode Overhaul

### 4.1 Preview Mode
**File:** `src/components/editor/PreviewMode.tsx`

Current state: Full-screen with inline styles, keyboard nav, fade animations. Works but is just a static preview.

**Changes:**
- **Progress bar** at top (thin colored line showing slide position)
- **Slide counter** at bottom-right (e.g., "3 / 12")
- **Presenter notes panel** — Toggle a bottom panel showing speaker notes (if any)
- **Timer** — Session timer (elapsed time since preview started)
- **Slide transition animations** — Add smooth slide-left/slide-right transitions (not just fade)
- **Interactive preview** — For poll/quiz slides, show a simulated interactive version:
  - Poll: Show clickable options that animate a mock bar chart
  - Quiz: Show countdown timer simulation
  - Word Cloud: Show animated word bubble placeholder
  - This gives presenters a feel for what participants will see
- **Thumbnail strip** — Optional filmstrip at bottom showing all slide thumbnails, clickable to jump
- **Exit button** — Already has Escape key, add visible "Exit Preview" button in top-left corner

---

## PHASE 5: Sessions & Reports Enhancement

### 5.1 Sessions Page
**File:** `src/app/(dashboard)/dashboard/sessions/page.tsx` + `SessionsList.tsx`

Current state: Lists sessions with basic info.

**Changes:**
- **Active sessions section** at top with prominent cards showing:
  - Room code (large, copyable)
  - QR code button
  - Participant count (live updating)
  - Current slide indicator
  - "Resume presenting" button
- **Session history** below with:
  - Search/filter by presentation name, date range, status
  - Sort by date, participant count, response count
  - Expandable rows showing per-slide response counts
- **Session comparison** — Select 2+ sessions of the same deck to compare results side by side (future feature placeholder)

### 5.2 Reports Page
**File:** `src/app/(dashboard)/dashboard/reports/page.tsx`

Current state: Shows decks with session counts and links to results.

**Changes:**
- **Analytics overview** with trend charts (sessions over time, participants over time)
- **Per-deck drill-down** with aggregated results across all sessions
- **Export all data** button (CSV/PDF)
- **Engagement metrics** — Average response rate, average quiz score, most popular templates

### 5.3 Results Page
**File:** `src/app/(dashboard)/presentations/[id]/results/page.tsx`

Current state: Shows session list + results for latest session.

**Changes:**
- **Session selector dropdown** — Switch between sessions instead of just showing latest
- **Per-slide results tabs** — Tab bar at top showing slide thumbnails, click to see that slide's results
- **Comparison mode** — Toggle to compare results across sessions
- **Print-friendly layout** — CSS @media print styles for easy printing/PDF

---

## PHASE 6: Navigation & Layout

### 6.1 Sidebar Navigation
**File:** `src/app/(dashboard)/layout.tsx`

Current state: Has Decks, Sessions, Templates, Reports, Team, Settings links.

**Changes:**
- **Active state styling** — Bold + colored indicator bar on active item
- **Collapsible sidebar** — Toggle to icon-only mode for more canvas space
- **Breadcrumbs** — Add breadcrumb trail in the top bar for deep pages (Dashboard > Deck Name > Edit)
- **Search global** — Add Cmd+K spotlight search that searches across decks, templates, sessions
- **Notifications bell** — Show when sessions have new responses or team invites (future)
- **Help & Support link** — Links to help page

### 6.2 Mobile Responsiveness
- Dashboard: Stack cards vertically on mobile
- Editor: Full-width canvas with bottom sheet for settings on mobile
- Templates: Single column grid on mobile
- All pages: Hamburger menu for sidebar on mobile

---

## PHASE 7: Database Migration

### 7.1 Slide Type Constraint
**Migration:** `supabase/migrations/20260304_add_slide_types.sql` (already created)

**SQL to run in Supabase SQL Editor:**
```sql
ALTER TABLE slides DROP CONSTRAINT IF EXISTS slides_slide_type_check;
ALTER TABLE slides ADD CONSTRAINT slides_slide_type_check
  CHECK (slide_type IN ('poll', 'word_cloud', 'quiz', 'qna', 'survey', 'content', 'rating_scale', 'open_text'));
ALTER TABLE slides ADD COLUMN IF NOT EXISTS speaker_notes TEXT DEFAULT '';
```

This enables rating_scale and open_text slide types, and adds the speaker_notes column.

**Also needed:** Run `/api/migrate` endpoint once with DATABASE_URL, or paste SQL directly in Supabase Dashboard → SQL Editor.

---

## PHASE 8: Build & Quality

### 8.1 Build Verification
- Run `npx next build` after each phase
- Fix any TypeScript errors
- Ensure all 47+ routes compile

### 8.2 Performance
- Add `loading.tsx` skeleton components for dashboard, templates, sessions, reports
- Lazy load heavy components (charts, word cloud, QR code)
- Image optimization for any uploaded content

### 8.3 Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation for all actions
- Focus management in modals and dialogs
- Color contrast compliance

---

## Implementation Priority

1. **Phase 7** — Database migration (unblocks rating_scale + open_text)
2. **Phase 1** — Dashboard overhaul (most visible, most used page)
3. **Phase 3** — Editor polish (core functionality)
4. **Phase 4** — Preview mode (critical for presenters)
5. **Phase 2** — Template gallery (already good, just polish)
6. **Phase 5** — Sessions & reports (analytics)
7. **Phase 6** — Navigation & layout (cross-cutting)
8. **Phase 8** — Build & quality (ongoing)

---

## Files to Create/Modify

### New Files:
- `src/components/dashboard/RecentActivity.tsx` — Activity feed component
- `src/components/presentations/DeckContextMenu.tsx` — Right-click menu for deck cards
- `src/components/presentations/TemplatePreviewModal.tsx` — Template preview lightbox
- `src/components/editor/KeyboardShortcutsModal.tsx` — Shortcuts overlay
- `src/components/editor/ThumbnailStrip.tsx` — Filmstrip for preview mode
- `src/components/ui/spotlight-search.tsx` — Cmd+K search component
- `src/app/(dashboard)/dashboard/loading.tsx` — Skeleton loader
- `src/app/(dashboard)/dashboard/sessions/loading.tsx` — Skeleton loader
- `src/app/(dashboard)/dashboard/templates/loading.tsx` — Skeleton loader

### Modified Files:
- `src/app/(dashboard)/dashboard/page.tsx` — Dashboard overhaul
- `src/components/dashboard/DashboardStats.tsx` — Card-based stats
- `src/components/dashboard/QuickCreate.tsx` — Add all 8 types + blank
- `src/components/presentations/PresentationGrid.tsx` — Grid/list, sort, search, context menu
- `src/components/presentations/TemplateGallery.tsx` — Preview modal, featured section
- `src/components/editor/SlideEditor.tsx` — Toolbar improvements, shortcuts
- `src/components/editor/SlideCanvas.tsx` — Zoom, inline editing enhancements
- `src/components/editor/SlideList.tsx` — Multi-select, context menu, sections
- `src/components/editor/SlideSettings.tsx` — Collapsible sections, AI generate
- `src/components/editor/PreviewMode.tsx` — Progress bar, timer, notes, transitions, interactive preview
- `src/app/(dashboard)/dashboard/sessions/page.tsx` — Active sessions section
- `src/components/sessions/SessionsList.tsx` — Search, filter, sort
- `src/app/(dashboard)/dashboard/reports/page.tsx` — Analytics overview
- `src/app/(dashboard)/presentations/[id]/results/page.tsx` — Session selector, tabs
- `src/app/(dashboard)/layout.tsx` — Collapsible sidebar, breadcrumbs
