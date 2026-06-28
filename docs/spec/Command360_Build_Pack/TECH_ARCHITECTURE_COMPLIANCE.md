# Command360 — Tech Architecture & Compliance (Build It Right Now)

*The decisions to lock **while you're still building**, because some are painful to change later. The theme Imran raised — "where should data be stored and processed?" — is the right question, and the answer is: choose UK regions now, minimise what you collect, and get the access-control layer correct.*

> **Caveat:** verify provider specifics (regions, DPAs) in their current docs before relying on them. Not legal advice.

---

## 1. The one that's hard to undo: data residency / region
**Decide region now — you largely can't move it later without a migration.**
- **Your question — "can we use a European back end and still sell to UK public sector?"** Legally, **yes**: EU data residency is GDPR-lawful for UK personal data (UK–EU adequacy), and **G-Cloud Lot 2 (cloud software) does not mandate UK-only hosting** — non-UK suppliers and clouds are allowed. So an EU region is *compliant*.
- **But the commercial answer is: provision in the UK.** Some of your biggest buyers — **NHS (DSPT), police, and anything touching MoD/OFFICIAL data** — require **UK data residency contractually** (a policy requirement, not a GDPR one). Hosting in the UK keeps the *entire* market open; hosting only in the EU quietly closes those doors.
- **Action:** create the **Supabase project in the London region** (UK, on AWS `eu-west-2`) and set **Vercel's function region to London** too. Supabase region is chosen at project creation and is effectively fixed — so if you're currently on an EU/other region, plan a migration *now*, before there's production customer data to move.

## 2. Where data actually lives (your data-flow map)
Keep this map accurate and you can answer any buyer's residency question in one line:
- **Organisation data + minimal session/engagement data → Supabase (UK region).** This is your system of record.
- **The application is served via Vercel** (global edge for delivery); the *data* sits in Supabase, not Vercel. Vercel still processes some operational data (logs, edge requests) — keep it region-aware.
- **AI features → Google Gemini.** Prompts you send are processed by Google. **Do not send personal data to Gemini** — feed it scenario content, not participant identities. Understand Google's data location and retention settings and use them.

## 3. Sub-processors (you have three — document them)
Every organisation customer will ask who else touches the data. Maintain the sub-processor list (template provided) and **sign each provider's Data Processing Agreement**:
- **Supabase** (database/auth/storage; built on AWS) — sign Supabase's DPA.
- **Vercel** (hosting/app delivery) — sign Vercel's DPA.
- **Google (Gemini)** (AI features) — sign Google's DPA; configure data-use settings to exclude training on your data.

## 4. The access-control layer = your #1 compliance-critical fix
This is the known blocker and it's also the single most important data-protection control:
- **Replace every `USING (TRUE)` Row-Level Security policy.** As written, private content is world-readable — that's a GDPR breach waiting to happen and an instant fail in any security review.
- **Scope all RLS by `org_id` and role.** Multi-tenancy isn't just a product feature; it's the mechanism that legally isolates one organisation's data from another's. An org's data must be unreachable by any other org.
- **Test isolation explicitly** — write tests that prove Org A can never read Org B's slides, sessions, participants or responses. This test suite is also evidence you can show a buyer.

## 5. Minimise by design (the architecture that matches the positioning)
This is where the "we're a tool, not a data harvester" stance becomes real in code:
- **No participant accounts.** Participants join a session by link / QR; they don't register.
- **Collect no participant identifiers by default.** Any name field is optional and org-controlled; prefer pseudonymous handles.
- **Analytics at session/org level**, not individual profiling.
- **Set retention and auto-deletion** on session data (define a default, e.g. purge participant responses after N days unless the org opts to keep them).
- **Keep PII out of the AI pipeline** (see §2).

## 6. The security basics buyers (and Cyber Essentials) check
Cyber Essentials v3.3 (2026) and any IG review will look for these — build them in now:
- **MFA on every admin account** for Supabase, Vercel, Google and your own admin — no exceptions (a CE requirement).
- **Encryption** at rest (AES-256, Supabase default) and in transit (TLS) — confirm it's on.
- **Secrets management** — environment variables/secret store, never keys in the repo.
- **Patch/dependency hygiene** — keep dependencies current; CE now expects critical vulns patched within 14 days.
- **Audit logging** — log admin and access events (needed for SSO/enterprise buyers and incident response).
- **Backups + point-in-time recovery** — enable and test restores.
- **SSO readiness** — public-sector and enterprise buyers will ask; design org-level auth so SSO can be added.

## 7. Build-it-right checklist (do these now, in this phase)
- [ ] Move/create Supabase in the **UK (London) region**; set Vercel function region to London.
- [ ] Replace all `USING (TRUE)` RLS with **`org_id` + role-scoped** policies; add isolation tests.
- [ ] Stand up the **multi-tenancy model** (organisations, memberships, roles).
- [ ] Default to **no participant accounts / no participant PII**; make name fields optional.
- [ ] Set **data retention + auto-deletion** defaults on session data.
- [ ] Enforce **MFA** on all admin accounts; move secrets to env/secret store.
- [ ] Enable **encryption** confirmation, **backups + PITR**, and **audit logging**.
- [ ] Configure **Gemini** to exclude personal data and disable training-on-your-data.
- [ ] **Sign DPAs** with Supabase, Vercel and Google; publish your sub-processor list.
- [ ] Write down the **data-flow map** (§2) so you can answer the residency question instantly.

Getting these right now costs little; retrofitting them after you have production customer data is expensive and risky. This is the cheapest moment you'll ever have to build it correctly.
