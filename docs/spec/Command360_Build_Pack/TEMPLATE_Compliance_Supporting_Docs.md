# TEMPLATE — Supporting Compliance Documents

> **⚠️ Starting-point templates, not legal advice.** Three documents in one file — split them into separate files when you add them to the system. Replace `[PLACEHOLDERS]`; have a solicitor/DPO review before use.

---

# 1. Sub-Processor List
*Publish this (e.g. `command360.[domain]/subprocessors`) and reference it in the DPA and Privacy Notice. Update it, with notice to customers, whenever it changes.*

**Command360 sub-processors — last updated [DATE]**

| Sub-processor | Purpose | Processing location | DPA |
|---|---|---|---|
| **Supabase** | Database, authentication and file storage (runs on AWS) | **[United Kingdom — London / confirm]** | [link to Supabase DPA] |
| **Vercel** | Application hosting and delivery | **[Region / confirm]** | [link to Vercel DPA] |
| **Google (Gemini)** | AI features (e.g. debrief summaries) — *no personal data sent* | **[Region / confirm]** | [link to Google DPA] |
| **[Payment provider]** | Subscription billing | [Region] | [link] |
| **[Email/CRM provider]** | Transactional/marketing email & contact management | [Region] | [link] |

*Note: we configure AI providers so customer/personal data is excluded from any model training.*

---

# 2. Data Protection Impact Assessment (DPIA) — template
*Hand a pre-filled version to public-sector buyers who must complete a DPIA before adopting a tool. Showing how little personal data is involved speeds adoption.*

**Project:** Use of Command360 for incident-command training · **Assessor:** [name/role] · **Date:** [date]

**Step 1 — Describe the processing**
- *What:* hosting and delivery of training scenarios, sessions and engagement data so the organisation can run exercises and produce after-action records.
- *Data:* administrator account data (name, work email, role); **minimal** participant data — typically a display name/pseudonym and session responses, only if the organisation chooses to capture it. No special-category data required.
- *Data subjects:* the organisation's staff/administrators and training participants.
- *Scale & duration:* [number of users; retention period].
- *Relationship:* organisation = controller; Command360 = processor (DPA in place).

**Step 2 — Necessity & proportionality**
- *Lawful basis:* [e.g. public task / legitimate interests — the organisation's own basis for training its staff].
- *Why proportionate:* the platform is designed for **data minimisation** — participants need no accounts and little/no identifying data is collected; processing is limited to what training requires.

**Step 3 — Identify and assess risks**
| Risk | Likelihood | Impact | 
|---|---|---|
| Unauthorised access to another organisation's data | Low | High |
| Excessive participant data collected | Low | Medium |
| Data held outside the UK | [Low] | [Medium] |

**Step 4 — Measures to reduce risk**
- UK-region hosting; encryption in transit and at rest.
- Org-level isolation via Row-Level Security; MFA on admin access; audit logging.
- Data minimisation by design (no participant accounts; optional name fields); defined retention/deletion.
- DPA with Command360; sub-processor list published; no personal data sent to AI.

**Step 5 — Sign off & residual risk**
- *Residual risk:* [Low]. *Approved by:* [DPO/role] · *Date:* [date] · *Review date:* [date].

---

# 3. Legitimate Interests Assessment (LIA) — template
*Complete and keep on file **before** you start B2B outreach. Based on the ICO's three-part test. You don't have to publish it, but you must be able to show it.*

**Processing:** business-to-business outreach (LinkedIn/email) to relevant emergency-services and safety-critical organisations to introduce Command360. · **Date:** [date]

**Part 1 — Purpose test (is there a legitimate interest?)**
- *Interest:* promoting a relevant training product to organisations with a genuine professional need for it. Commercial interest in winning business — a legitimate interest recognised for B2B direct marketing.
- *Benefit:* relevant decision-makers learn about a tool that helps them meet mandatory training obligations more cheaply.

**Part 2 — Necessity test**
- Outreach to named role-holders at relevant organisations is a reasonable and proportionate way to achieve the purpose; there is no less intrusive practical alternative for reaching the right people.
- We target by *role and organisation relevance* (e.g. heads of training, EPRR/resilience leads, safety managers), not indiscriminately.

**Part 3 — Balancing test (does it override the individual's rights?)**
- *Reasonable expectation:* professionals in these roles reasonably expect relevant work-related approaches via LinkedIn/work email.
- *Impact:* minimal — a single, relevant, professional message with an easy opt-out.
- *Safeguards:* we use only business contact data; identify ourselves and the source; include a clear opt-out; honour objections immediately via a suppression list; do not email sole traders/individuals or personal addresses without consent; do not buy lists.

**Conclusion:** legitimate interests is an appropriate lawful basis for this B2B outreach, subject to the safeguards above. · *Reviewed by:* [name] · *Review date:* [date].
