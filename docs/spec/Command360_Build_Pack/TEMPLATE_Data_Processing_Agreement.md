# TEMPLATE — Data Processing Agreement (DPA)

> **⚠️ This is a starting-point template, not legal advice.** Have a UK data-protection solicitor review and tailor it before you offer it to any customer. Replace every `[PLACEHOLDER]`. Once the product is finished, revisit the schedules so they describe what the system actually does.

**Between:**
- **[CUSTOMER ORGANISATION NAME]** ("**Customer**" / the "**Controller**"), and
- **[YOUR LIMITED COMPANY NAME]**, trading as **Command360**, company no. **[NUMBER]**, registered at **[ADDRESS]** ("**Command360**" / the "**Processor**").

This DPA forms part of, and is subject to, the agreement between the parties for the supply of the Command360 platform (the "**Principal Agreement**"). In the event of conflict on data-protection matters, this DPA prevails.

---

## 1. Definitions
"**UK GDPR**", "**controller**", "**processor**", "**data subject**", "**personal data**", "**processing**" and "**personal data breach**" have the meanings in the UK GDPR and the Data Protection Act 2018. "**Data Protection Laws**" means the UK GDPR, the DPA 2018, the Privacy and Electronic Communications Regulations, and the Data (Use and Access) Act 2026, each as amended.

## 2. Roles and scope
2.1 The parties acknowledge that for personal data processed under the Principal Agreement, the **Customer is the controller** and **Command360 is the processor**.
2.2 The subject matter, duration, nature and purpose of the processing, the types of personal data, and the categories of data subjects are set out in **Schedule 1**.
2.3 Command360 is engaged as a tool for the Customer to create and deliver its own training. By design, Command360 holds minimal personal data about training participants (see Schedule 1).

## 3. Processor obligations
Command360 shall:
- **(a) Process on instructions** — process personal data only on the Customer's documented instructions (including the Principal Agreement and this DPA), unless required by law (in which case it will inform the Customer unless legally prohibited).
- **(b) Confidentiality** — ensure persons authorised to process the data are under an appropriate duty of confidentiality.
- **(c) Security** — implement the technical and organisational measures in **Schedule 2** to ensure a level of security appropriate to the risk (UK GDPR Art. 32).
- **(d) Sub-processors** — only engage the sub-processors listed in **Schedule 3**, under written terms imposing equivalent data-protection obligations; give the Customer **[30] days'** prior notice of any intended change and a right to object on reasonable data-protection grounds.
- **(e) Data subject rights** — taking into account the nature of the processing, assist the Customer by appropriate measures to respond to data-subject requests (access, rectification, erasure, restriction, portability, objection).
- **(f) Breach** — notify the Customer **without undue delay and within [48] hours** of becoming aware of a personal data breach, with the information the Customer reasonably needs to meet its own obligations.
- **(g) DPIAs** — assist the Customer with data protection impact assessments and prior consultation with the ICO where required.
- **(h) Deletion/return** — at the Customer's choice, delete or return all personal data at the end of the services and delete existing copies, unless law requires retention.
- **(i) Audit** — make available information necessary to demonstrate compliance with Art. 28 and allow for and contribute to audits, including inspections, by the Customer or its mandated auditor (subject to reasonable notice, confidentiality and frequency).

## 4. International transfers
Command360 shall not transfer personal data outside the UK except where an adequacy decision applies or appropriate safeguards (e.g. the UK International Data Transfer Agreement / Addendum) are in place. Current hosting region and any transfers are described in **Schedule 3**.

## 5. Liability and term
5.1 Liability under this DPA is subject to the limitations and exclusions in the Principal Agreement.
5.2 This DPA takes effect on the date of the Principal Agreement and continues while Command360 processes personal data on the Customer's behalf.

**Signed for and on behalf of the Customer:** __________________  Date: ________
**Signed for and on behalf of Command360:** __________________  Date: ________

---

## Schedule 1 — Details of processing
- **Subject matter:** provision of the Command360 incident-command training platform.
- **Duration:** the term of the Principal Agreement.
- **Nature and purpose:** hosting and processing of training scenarios, sessions and engagement data so the Customer can build and deliver training and produce after-action records.
- **Types of personal data:** Customer administrator/user account data (name, work email, role); **minimal** participant data — typically a display name or pseudonymous handle and session responses, only where the Customer chooses to capture it. *No special-category data is required by the platform.*
- **Categories of data subjects:** the Customer's staff/administrators and training participants.

## Schedule 2 — Technical & organisational measures
[Summarise actual measures — e.g.: UK-region hosting; encryption at rest (AES-256) and in transit (TLS); role-based access control with org-level isolation (Row-Level Security); MFA on administrative access; least-privilege access; audit logging; backups with point-in-time recovery; secrets management; vulnerability/patch management; data minimisation by design; defined retention and deletion. Keep this in step with the Tech Architecture file and your Cyber Essentials scope.]

## Schedule 3 — Sub-processors & hosting
- **Hosting region:** United Kingdom (London) — [confirm].
- **Sub-processors:** Supabase (database/auth/storage, on AWS); Vercel (application hosting/delivery); Google (Gemini AI features). [Keep aligned with the Sub-Processor List template; update on change with notice per clause 3(d).]
