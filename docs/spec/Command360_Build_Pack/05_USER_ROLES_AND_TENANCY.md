# 05 · User Roles & Multi-Tenancy

> **This is the pre-sale blocker.** The current repo has permissive RLS (`USING (TRUE)`) = world-readable = a GDPR blocker, and no organisations/roles. **Build this first (Phase 0).** Everything else assumes it exists.

## 1. Organisation-centric model

- The **Organisation** (a fire service, police force, COMAH site…) is the tenant.
- The org is the **data controller**; Command 360 is the **data processor** (a DPA is required).
- Every asset, scenario, TDE, and session belongs to exactly one org.
- Each org gets its own dashboards, library, and branding (white-label).

## 2. Roles (the matrix)

| Role | Build assets/scenarios | Run sessions | Admin (users/branding/library) | Notes |
|---|---|---|---|---|
| **Org Admin** | ✅ | ✅ | ✅ | Manages users, branding, billing, library uploads + Looks |
| **Author** | ✅ | ✅ | ❌ | Builds in Studio, builds TDEs/Scenarios |
| **Instructor** | partial | ✅ | ❌ | Runs Classroom/Live, can live-edit during a run |
| **Assessor / Observer** | ❌ | view | ❌ | Joins a live session to observe/score (optional) |
| **Participant** | — | — | — | **Not a user.** Joins a session by link/QR + Group name. No account. |

(Roles can be combined per user; default a new user to Author.)

## 3. Participants — no accounts, no PII (privacy-by-design)

- Participants **do not create accounts**.
- They join a Session via a **link or QR code + a short numeric code**, then enter a **Group name** (self-named).
- **No personal data is required.** Name fields, if present, are optional.
- This is a deliberate **procurement advantage** for police/fire/gov buyers.

## 4. Tenancy enforcement (RLS)

- Every table carries `org_id`.
- Replace **all** `USING (TRUE)` policies with **`org_id` + role-scoped** RLS.
- Add **isolation tests**: a user in Org A must never read/write Org B rows.
- Session-join uses a scoped, time-limited token — participants get write access only to their own Session's decision rows, nothing else.

## 5. Sub-processors & data residency

- **Host in the UK:** Supabase **London region (eu-west-2)**; Vercel functions region London. Required for NHS/police/MoD data-residency contractual terms.
- **Sub-processors:** Supabase, Vercel, Google Gemini. Publish a sub-processor list; sign DPAs with each.
- **No personal data is sent to Gemini.** Configure Gemini to exclude personal data and disable training-on-your-data.

## 6. Retention & wipe

- **Default: auto-wipe** decision logs + session timelines at session end.
- Configurable per org to **keep + export** (for evidence — file 13).
- Set data-retention/auto-deletion defaults on session data.

## 7. Security posture (gating, to sell)

- **MFA** on all admin accounts; secrets in a secret store.
- **Audit logging** of admin + access events.
- **Encryption** at rest + in transit; **backups + point-in-time recovery** (tested).
- **SSO-ready** org-level auth (public sector / enterprise will ask).
- Targets: **Cyber Essentials** (entry ticket to G-Cloud Lot 2), then **ISO 27001** when large deals justify it. ICO fee paid.

## 8. Phase-0 checklist (do now)

- [ ] Supabase + Vercel in **London** region.
- [ ] Replace every `USING (TRUE)` RLS with `org_id` + role-scoped policies; add isolation tests.
- [ ] Build **organisations, memberships, roles**.
- [ ] **No participant accounts / no participant PII**; name fields optional.
- [ ] Session-join scoped tokens.
- [ ] Data-retention + auto-deletion defaults.
- [ ] MFA on admins; secrets to env/secret store.
- [ ] Encryption confirmation, backups + PITR, audit logging.
- [ ] Gemini: exclude personal data, disable training.
- [ ] Sign DPAs (Supabase, Vercel, Google); publish sub-processor list.
