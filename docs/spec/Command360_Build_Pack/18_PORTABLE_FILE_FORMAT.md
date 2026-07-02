# 18 · Portable File Format — the `.c360` package (v2)

*Addition to the spec pack. Lets users export a scenario or deck as one shareable file, import it elsewhere, and keep file size small by referencing built-in assets instead of re-bundling them. Applies to BOTH Command Studio scenarios and Command Classroom decks.*

> **Builds on existing code.** The repo already has `GET /api/presentations/[id]/export-c360` and `POST /api/presentations/import-c360`, but the current `.c360` is **JSON-only — it carries no media**. This spec upgrades it to a media-bundling package while staying able to read old JSON files as "v1".

## 1. Design principle (research-backed)
Every major document format — `.pptx`, `.docx`, `.xlsx`, OpenDocument, EPUB — is a **ZIP archive containing a manifest + the content + embedded media**, because that "leaves the independent file entities embedded intact and results in much smaller files," with internal **IDs/relationships** linking parts. We follow the same proven pattern: **`.c360` v2 = a ZIP container.**

## 2. Container layout
A `.c360` file is a ZIP with:
```
manifest.json     # format:"c360", version:2, kind, title, description, accreditation, dates, app_version, integrity
document.json     # the full scenario/deck: studio = views→phases→injects→actions; classroom = slides/blocks/paths.
                  #   Holds ALL settings (transforms, blend modes, opacity, timeline, playback, looks). References assets by id only.
assets.json       # asset table: id → { source:"system"|"bundled", hash, mime, original_name, category, blend_defaults }
assets/           # ONLY custom (non-system) media, content-addressed: assets/<sha256>.<ext>
thumbnail.png     # preview for grids / community cards
```
(Old plain-JSON files = v1; the reader detects "not a zip / no manifest" and imports them as v1.)

## 3. The file-size win — system vs custom assets
- **System assets** (the shared library shipped with every install — see file 07) are referenced by a **stable `system_id`** and are **NOT** bundled. A scenario built only from system assets exports as a tiny file.
- **Custom assets** (media the user added themselves) ARE bundled under `assets/<hash>.<ext>`.
- This mirrors the OPC "reference, don't duplicate" model and is the whole point: share the unique parts, reuse the common parts already on every install.

## 4. Integrity & dedupe
- **Content-addressed:** each bundled asset is stored once under its **SHA-256 hash**; `document.json`/`assets.json` reference by id→hash. The same asset used 10 times is stored once.
- `manifest.json.integrity` lists each part's hash so import can verify nothing is corrupt/tampered.

## 5. Import flow
1. Validate it's a zip with a valid `manifest.json`; check `format` and `version`.
2. Verify every bundled asset's bytes against its hash.
3. **Re-link system assets** by `system_id`. If a referenced `system_id` is missing on this install, substitute a clearly-marked placeholder and warn (don't fail the whole import).
4. **Upload bundled custom assets** to the importing org's Supabase Storage — **skip any whose hash the org already has** (dedupe across imports).
5. Create the scenario/deck in the **importer's org**; the importer becomes owner; original **accreditation is preserved** in metadata.

## 6. Security — treat every import as untrusted
Imported files come from other people. The build MUST:
- Validate each asset's MIME + extension + size; enforce an allowlist (images, video, audio only) and a total-size cap.
- **Never auto-fetch external URLs** referenced inside an import, and reject any embedded script/executable/active content. *(Real precedent: PPTX external media links in relationship files can trigger network requests to attacker-controlled servers when opened — we must not do that.)*
- Parse in a sandboxed/streamed way; reject zip-bombs (limit decompressed size + entry count).
- Enforce org RLS: an import only ever writes into the caller's org.

## 7. Versioning / forward-compat
- `version` + `min_app_version` in the manifest. Readers **ignore unknown fields** and never hard-fail on additive changes. Breaking changes bump the major version.

## 8. Implementation notes
- Use a JS zip lib (`fflate` preferred for size/speed, or `JSZip`). Build/parse in the existing `export-c360` / `import-c360` routes (extend them; add a Studio equivalent).
- `kind: "studio_scenario" | "classroom_deck"` selects the `document.json` schema — same container, two payload shapes.
- This package is also the storage/transfer unit for Templates & Community (file 19).
