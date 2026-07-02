# 19 · Templates, Sharing & Community

*Addition to the spec pack. "Save as template", share directly with a user/organisation, or publish to a browsable Community library — for scenarios, decks, and asset packs. Uses the `.c360` v2 package (file 18) as the storage/transfer unit.*

> **Builds on existing code.** The repo already has `/dashboard/templates`, `/dashboard/shared`, a `TemplateGallery` component, and a grid/list toggle (`PresentationGrid`). Today templates are client-side only — this spec adds the real, org-scoped backend.

## 1. My Templates (personal/org library)
- **Save as Template** from any scenario or deck → stored as a template owned by the user's **org**. Can be renamed, duplicated, versioned, deleted.
- **Use / Import** a template → creates an independent **working copy** in the user's workspace that they can rename, version and edit freely. Using a template never mutates the original.
- This is the "normal software" loop: New · Open · Save · Save As · Duplicate · Use → edit your copy.

## 2. Direct sharing (to a chosen user or organisation)
- From a template/scenario → **Share** → search and pick **a specific user** or **a specific organisation** → it appears in their **"Shared with me"** area (the existing `/dashboard/shared`).
- Recipients **Use/Import** it into their own My Templates (independent copy).

## 3. Community library (share to everyone)
- **Share to Community** → publishes the item to a library visible to **any logged-in account**.
- **Categories** (browse + filter): Command Studio scenarios · Command Classroom decks · Social-media assets · CCTV · plus other asset/content types (file 07 taxonomy). Items are labelled to a category on publish.
- **Accreditation on every card:** the **account-holder organisation**, created/updated dates, scenario title, description, sector tags, version. Credit stays with the original org even after others copy it.
- **Browse UI:** grid ⇄ list toggle (reuse `PresentationGrid` pattern), search, filter by category + sector, sort by newest/popular. Card → detail view → **Use/Import** copies it into the viewer's My Templates/workspace to rename and adapt.

## 4. Data model (org-scoped, RLS)
- `templates` — `id, org_id, owner_user_id, kind ('studio_scenario'|'classroom_deck'|'asset_pack'), title, description, category, sector_tags[], visibility ('private'|'org'|'shared'|'community'), version, thumbnail_url, package_ref (the stored .c360), created_at, updated_at`.
- `template_shares` — `template_id, target_org_id | target_user_id, shared_by, created_at`.
- `template_installs` *(optional analytics)* — `template_id, installed_by_org, created_at`.
- **RLS:** owner org full access; `template_shares` grants read to the target; **`visibility='community'` → public read** for authenticated users. Writes always scoped to the caller's org. Only the owner org edits the original; everyone else gets an independent copy on Use/Import.

## 5. Governance
- Visibility flag controls exposure (private / org / shared / community). **Report** + admin **remove** for community items. Optional review/approval before an item goes public (configurable).
- Sharing = a licence for other platform users to reuse it **within the platform**; the original org keeps authorship credit.

## 6. Phasing
This is **Phase 8** (post-launch). It depends on the asset library (file 07), tenancy/RLS (Phase 0), and the `.c360` v2 package (file 18). Not required for the Phase 0–7 MVP.
