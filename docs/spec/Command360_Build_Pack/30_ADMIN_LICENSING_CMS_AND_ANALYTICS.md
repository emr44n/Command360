# 30 · Super-Admin: Licensing, Quotas, Asset Manager, News CMS & Platform Analytics

*The platform-owner back end. One super-admin console (extends the existing `/dashboard/admin` page) controlling licences, storage, system assets, community, the news/blog CMS, and acquirer-grade analytics.*

> **Auth stays Supabase (LOCKED).** The repo runs on Supabase Auth (`@supabase/ssr`, middleware, RLS tied to `auth.uid()`). Do NOT introduce Clerk or any other auth provider — swapping auth would rebuild the security base for zero gain. A `super_admin` role goes in `memberships`/JWT claims (Phase 0 model).

## 1. Licensing & free trial
- **Model:** every org has a licence record: `plan_band` (Small/Standard/Large/National/Bespoke), `status` (trial/active/expired/suspended), `trial_ends_at`, `licence_starts_at/ends_at`, `storage_quota_gb`, `seats` (soft), `notes`.
- **14-day free trial:** full product access. On expiry → **read-only lockout** (industry best practice): users can still **log in and SEE their work** (decks/scenarios/library listed, open in view-only) but cannot create, edit, run sessions, upload, or export. Their data is never deleted or hidden — that's the strongest re-conversion lever and avoids data-hostage complaints.
- **Lockout UX:** persistent banner + modal on blocked actions: "Your licence has expired — your work is safe. Contact us to reactivate." with a **Contact/Renew CTA** (mailto + contact page). Same pattern for licence expiry as trial expiry.
- **Grace period:** configurable (default 7 days) with a warning banner before hard lockout; email reminders at T-7, T-1, expiry (via Resend, file 17).
- **Super-admin controls:** set/extend trial and licence dates, change band/quota, suspend/reactivate, add notes; every change audit-logged.
- **Enforcement is server-side:** licence checks in RLS/route handlers (not just UI), so an expired org's writes fail at the API even if the UI is bypassed.

## 2. Storage quotas & economics (decided)
- **Allocations by band:** Small **10 GB** · Standard **25 GB** · Large **50 GB** · National **100 GB** · Bespoke negotiated. Generous vs need (50 MB/video cap, file 26) and near-zero cost:
  - Supabase Pro includes **100 GB** file storage; extra is **~$0.021/GB/mo** → even a National org fully using 100 GB costs ≈ **$2/mo (~£20/yr) against an £18k contract (~0.1%)**.
  - Egress: 250 GB/mo included, then $0.09/GB uncached / **$0.03/GB cached** — Cloudflare sits in front (HOSTING_DECISION), so media is mostly **cached**; keep public caching headers on library assets.
- **Enforcement:** per-org usage metered (Storage bucket per org or prefix + size accounting on upload/delete); upload blocked at quota with an upgrade prompt; usage bar in org settings and in super-admin.

## 3. System asset manager (xVR-style taxonomy)
Admin uploads/manages the **system library** (file 07) with full metadata: name, category, tags, blend-mode default (screen/multiply/alpha — file 08), format, size, preview.
**Category tree (xVR-inspired, ours):**
- **Characters/avatars** — firefighters, police, paramedics, public, casualties (poses/Looks per file 07)
- **Vehicles** — fire appliances, police, ambulance, HGV, cars, motorcycles, rail, marine, aviation — each with **intact / damaged / burnt-out variants**
- **Machinery & plant** — forklifts, cranes, generators, industrial units
- **Street furniture** — bins, benches, bus stops, fencing, lamp posts, barriers
- **Environment** — trees (intact/damaged/fallen), hedges, terrain pieces, weather overlays
- **Buildings & structures** — houses, industrial, high-rise, ruins/collapsed variants
- **Effects (VFX)** — fire, smoke (light/dark), explosions, water/foam, hazmat plumes, sparks, lighting (file 08 rules)
- **Signage & incident dressing** — cordon tape, cones, signs, command boards
- **Audio** — sirens, radio traffic, ambience
Categories/subcategories are **admin-editable** (add/rename/reorder); the library browse UI mirrors this tree with search + tag filters. User uploads sit in the same tree under "My assets" (org-scoped, quota-metered).

## 4. News/blog CMS (build the back end for what exists)
The public News section already exists with the right shape — `NewsPost` = hero + ordered **blocks** (`heading/text/image/video/quote`), listing + `[slug]` pages + **RSS route** — currently fed by mock data in `src/lib/news.ts`. **Build the CMS onto this exact shape:**
- **Storage:** `news_posts` table (all NewsPost fields + `status: draft/published`, `published_at`, `author_id`); public pages read published posts; RSS route reads the table.
- **Admin editor (WordPress-like):** block editor — add/reorder/delete heading, text, image (upload or URL), **YouTube/video embed**, quote blocks; hero image upload (takes the hero section); category, accent, keywords; live preview; save draft → publish.
- **AI assist (Gemini — already in stack):** (a) **paste a URL → auto-generate a draft article** (fetch, summarise, draft in house tone) for the admin to edit/approve; (b) give a subject/notes → generate a draft; (c) admin can always write manually. AI output is ALWAYS a draft for human review — never auto-publish.
- **SEO/mobile:** slug, meta title/description (excerpt), OpenGraph image from hero, structured headings, next/image responsive; pages already mobile-ready (file 21).
- **RSS ingest (optional feed-in):** admin can register external RSS feeds; new items appear as **suggested drafts** (never auto-publish).

## 5. Community management (extends file 19)
Admin can: publish **official templates/scenarios** to Community; feature/pin items; moderate (unpublish/remove) shared content; post announcements. Community page gains an "Official" badge for admin-published content.

## 6. Platform analytics (the numbers a buyer/acquirer asks for)
**Per-org and platform-wide, time-ranged:**
- **Usage:** MAU/WAU, sessions run, scenarios/decks **created** and **run**, participants reached, average session size/duration.
- **Engagement/retention:** active orgs by week/month, weeks-active streaks, feature adoption (Studio vs Classroom vs Live), storage used per org.
- **Commercial:** licence band mix, trial→paid conversion, renewals due (next 90 days), **most-active-clients ranking**.
- **Health:** API error rates, realtime channel health, storage totals, background-job failures (surfaced from Vercel/Supabase status + app-level logging).
- **Export:** CSV export of any table; this is the acquirer due-diligence pack.
- **Google Analytics:** GA4 measurement-ID setting in admin → injected on **marketing pages only** (not the app), respecting the cookie banner (`/cookies` page).
Implementation: an `analytics_events` table (org_id, event, props, ts) written from key server actions + nightly rollups; dashboard charts in the admin console. No third-party trackers inside the authenticated app.

## 7. Phasing & change-impact
- **Phase 0:** `super_admin` role + licence table skeleton (RLS uses it).
- **Phase 4 (Library):** taxonomy tree + admin asset manager + quota metering.
- **Phase 8:** licensing/trial enforcement + lockout UX + admin console + news CMS + community management + analytics dashboards.
- **Phase 9:** verify lockout server-side (attempt writes as an expired org — must fail), quota enforcement, CMS publish flow, analytics correctness.
- Change-impact (file 25): licence checks touch route handlers + RLS; test trial→active→expired transitions end-to-end.
