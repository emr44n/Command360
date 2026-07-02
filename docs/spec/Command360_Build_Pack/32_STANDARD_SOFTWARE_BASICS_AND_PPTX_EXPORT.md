# 32 · Standard Software Basics & PowerPoint Export

*Day-one. The "any mature software has this" checklist — audited against the spec so nothing basic is missing — plus the PPTX offline export.*

## 1. The basics (each is a gate item; several part-exist — adapt)
- **Open / Recent:** dashboard lists recent decks/scenarios (repo has `last_accessed_at` — use it); File→Open picker.
- **Rename everywhere:** decks, scenarios, scenes, steps, assets, templates — inline or double-click (file 28's reliability rule applies).
- **Trash & restore:** delete = soft-delete to a 30-day bin (repo has `is_archived` — extend to a real bin with restore + purge). Never hard-delete on a single click.
- **Global search:** decks, scenarios, assets, templates, sessions by name/tag — from the dashboard header.
- **Notifications (in-app):** invites, direct shares received, licence/quota warnings, admin announcements. Simple bell + list.
- **Audit log:** who did what, when (auth events, licence changes, deletes, shares, admin actions) — org-admins see their org; super-admin sees all. Government buyers ask for this.
- **Profile management:** name, avatar, password change, MFA management, email prefs.
- **Offboarding/data export:** on contract end an org can export all their content as `.c360` packages + CSV of records (procurement requirement; pairs with the DPA).
- **Duplicate everywhere:** decks (exists — surface as Save As, file 23), scenarios, templates, assets.
- **Announcements:** super-admin banner (info/warning/incident) to all or selected bands/agencies, optional email blast (file 30).

## 2. PowerPoint (.pptx) export — the offline deliverable (day-one)
- **What exports:** Classroom decks → real `.pptx`: text boxes, images, master-slide branding, layout preserved as native PowerPoint objects (use a maintained pptx-generation library in the export pipeline).
- **Interactive slides** (polls/quizzes/word clouds/Q&A): exported as a **static snapshot** of the question/design (user can delete those slides in PowerPoint — their choice).
- **Classroom Scenes / Studio content:** exporter offers per-export choice — (a) **poster-frame PNG** per scene (small, instant) or (b) **render scene to MP4 and embed** in the slide (bigger, plays offline). Show estimated file size before export (consistent with file 26 §7).
- **One-way:** export only; no `.pptx` re-import fidelity promised. Positioning: air-gapped/offline training rooms + "stop building in Canva".

## 3. Phasing
Basics: land with their nearest feature phase; verified as a **named checklist in Phase 9**. PPTX export: **Phase 8**, verified in Phase 9 (open the exported file in PowerPoint — text/images/master intact, embedded video plays).
