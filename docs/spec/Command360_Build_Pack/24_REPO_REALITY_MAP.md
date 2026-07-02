# 24 · Repo Reality Map — what EXISTS vs what the spec CALLS it

> **THE anti-hallucination file. Read this before building anything.** The #1 way
> an agent breaks a working codebase is inventing new tables/APIs or duplicating
> features that already exist under a different name. This maps the repo's real
> structure to the spec's vocabulary so you ADAPT what's there instead of rebuilding.
>
> **Golden rule:** the **repo** is the source of truth for what EXISTS and what it's
> NAMED; the **spec** is the source of truth for what it should BECOME. When they
> differ on a name, do NOT invent a third thing — adapt in place.

## Real database tables (source: `supabase-schema.sql` + migrations)
- `presentations` (id, **user_id**, title, description, thumbnail_url, is_archived, last_accessed_at, timestamps) — **this is the store for BOTH Classroom decks AND Studio scenarios.**
- `slides` (id, **presentation_id**, slide_type ∈ poll/word_cloud/quiz/qna/survey/content[+studio], position, title, content jsonb, timestamps)
- `sessions` (id, presentation_id, **host_user_id**, room_code, status, current_slide_id, **live_scene_ids jsonb**, voting_open, timestamps) — **this is "Command Live".**
- `participants` (id, session_id, **display_name**, nullable user_id, score, **client_token**, joined_at) — **the no-account join already exists.**
- `responses` (session_id, slide_id, participant_id, answer jsonb, points_earned)
- `qna_questions`, `qna_upvotes`

> **CRITICAL:** every table is **`user_id` / `host_user_id`-scoped — there is NO `org_id` yet.**
> Phase 0 **ADDS `org_id` + memberships to THESE tables** and re-scopes RLS.
> Do **NOT** create parallel org-scoped copies of these tables.

## Real routes / stores / components
- **Route groups:** `(auth)`, `(dashboard)`, `(presenter)`; marketing pages at root (`/product`, `/command-studio`, `/pricing`, …).
- **Dashboard:** `/dashboard/presentations`, `/dashboard/studio`, `/dashboard/sessions`, `/dashboard/reports`, `/dashboard/templates`, `/dashboard/shared`, `/dashboard/team`, `/dashboard/admin`, `/dashboard/settings`, `/dashboard/studio-analytics`.
- **Editors:** Classroom decks → `src/components/editor/` (`SlideEditor`); Studio scenarios → `src/components/studio/` + `src/components/command-studio/`.
- **Stores:** `editorStore` (Classroom), `studioStore` / `studioTimelineStore` / `studioPlaybackStore` (Studio), `sessionStore`, `participantStore`.
- **Live/join:** `/present/[sessionId]`, `/participate/[sessionId]`, `/join/[roomCode]`.

## Spec vocabulary ↔ repo reality (the map)
| Spec term (v9) | What it IS in the repo now | Instruction |
|---|---|---|
| Classroom deck | `presentations` + `slides` + `components/editor` + `/dashboard/presentations` | **Adapt in place** |
| Studio scenario | `presentations` (studio slide type) + `components/studio` + `/dashboard/studio` | **Adapt** — scenarios currently share the presentations/slides model |
| Command Live | `sessions` + `live_scene_ids` + `/present`,`/participate` | **Adapt** — Live = the sessions system |
| Views → Phases → Injects → Actions | **Not tables** — live is driven by `sessions.live_scene_ids` + `slides` | If new tables are truly needed, they must **reference + migrate** existing data — **never orphan `presentations`/`slides`** |
| Group + join code | `participants.display_name` + `sessions.room_code` + `client_token` | **Relabel in UI only**; keep the columns |
| Tenancy (`org_id`) | none — `user_id`/`host_user_id` everywhere | Phase 0: **add** `org_id` + memberships to existing tables, backfill, re-scope RLS |
| Slide Masters (account-level) | `slide-masters.ts` (per-presentation) + pending `slide_masters` migration | **Adapt** to org-level (file 22) |
| Templates / Community | `/dashboard/templates`, `/templates`, `/shared` (client-side) | **Build backend** (file 19), reuse the pages |
| `.c360` export/import | `export-c360` / `import-c360` routes (JSON only) | **Upgrade** to v2 package (file 18) |

## Rules to avoid breaking the site
1. **Adapt in place; NO duplicate tables.** Never create `scenarios`/`decks` that duplicate `presentations`.
2. If the spec's model genuinely needs new tables, they must **reference and migrate** the existing rows — never leave the old data orphaned.
3. **Never rename a table/column without a data-preserving migration** + updating all references + a test proving no data loss. Prefer changing only the **UI label**.
4. **Terminology is UI-layer.** "Command Classroom / Studio / Live", "Group", "join code", "scenario" are user-facing labels; the storage keeps its names (`presentations`/`slides`/`sessions`/`participants`/`room_code`).
5. **Grep the repo before building ANY feature** — many are partially built (below). Adapt, don't rebuild (avoids "variant of existing code").
6. **FIRST TASK of the build:** produce a written **reconciliation plan** — for each spec entity, name the existing table/route/component and state adapt / relabel / build — BEFORE writing code.

## Already (partially) built — ADAPT these, don't recreate
- Slide masters (`slide-masters.ts`, snapshot model, default master) — per-presentation, needs org-level + editor + persistence.
- Templates + Shared pages (client-side) — need real backend.
- Duplicate presentation route (`/api/presentations/[id]/duplicate`) — surface it as **Save As**.
- `.c360` export/import routes — upgrade to the v2 package.
- Command Live via `sessions` + `live_scene_ids` — extend, don't replace.
- Participant no-account join (`display_name` + `client_token`) — already matches the privacy model.
- Studio editor + timeline stores, Konva canvas, CCTV editor — adapt/polish, don't rebuild.
