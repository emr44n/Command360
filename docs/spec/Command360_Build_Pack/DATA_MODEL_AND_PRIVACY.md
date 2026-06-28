# Command360 — Data Model & Privacy Positioning

*Imran's instinct here is sharp and worth formalising: Command360 is a **tool for organisations to create and run training**, not a platform that harvests data on individual participants. Staying deliberately in that lane is both the right architecture and a genuine commercial advantage — it shrinks the data-protection surface that slows public-sector sign-off.*

> **Caveat:** this is a data-protection design and positioning note, not legal advice. Have a data-protection specialist (or a fractional DPO) review the model and your DPA/DPIA templates before commercial launch.

---

## 1. The model: organisation-centric, participant-light
- **The organisation is the customer and the account holder.** Accounts, billing, branding and the asset library all sit at the organisation level (this is the multi-tenancy you're building — organisations, memberships, roles).
- **Individual participants do not create accounts.** They join a session ephemerally — via a join link or the planned **QR second-screen** — and contribute (poll answers, quiz responses, decisions) without registering or handing over identifying details.
- **You hold minimal-to-no personal data on participants.** Where a facilitator needs to attribute a response, that can be a display name or a pseudonymous handle the org controls — not data Command360 needs to keep.
- **Analytics = engagement, not identity.** You measure *who engaged and how* at the session/organisation level (participation, response patterns, objectives met) — operational and aggregate, not individual profiling.

This keeps you firmly in the "tool, not data controller of their people" position.

## 2. Why this is a commercial advantage, not just compliance
- **Faster public-sector sign-off.** The less personal data you touch, the smaller the information-governance review. NHS, police and councils scrutinise exactly this; "we hold essentially no personal data on your staff" is a powerful, friction-removing line.
- **Lower breach risk and liability.** Data you never collect can't be breached. For a solo-founder business putting a tool in front of life-safety organisations, that materially reduces exposure.
- **It reinforces the product story.** "We're the canvas your trainers build on" is cleaner than "we're a learning platform that tracks everyone," and it differentiates from heavier LMS-style competitors.
- **It's a feature you can sell.** Privacy-by-design and data minimisation are procurement-positive — put them on the security one-pager.

## 3. The compliance structure (get this right early)
- **Controller vs processor.** For whatever limited participant data flows through a session, the **organisation is the data controller** (it decides why and how) and **Command360 is the processor** (it acts on the org's instructions). This split is the foundation — it puts the lawful-basis and transparency duties on the org, where they belong.
- **Offer a Data Processing Agreement (DPA).** Every organisation customer should get a standard DPA covering what you process, for what purpose, security measures, sub-processors (Supabase, Vercel, Google/Gemini), retention and deletion. Have this ready before the first paid deployment.
- **Provide a DPIA template.** Public bodies often must do a Data Protection Impact Assessment before adopting a tool; handing them a pre-filled template (showing how little personal data is involved) speeds adoption and demonstrates maturity.
- **Minimise by design.** Default to collecting no participant identifiers; make any name field optional and org-controlled; set sensible retention and auto-deletion; keep the AI features (Gemini) from receiving personal data.
- **Be transparent.** A clear, plain-English privacy notice and a public sub-processor list.

## 4. Data residency — the EU-servers nuance
Imran's point that the servers are in Europe and "GDPR is compliant" is correct for the law — but there's a public-sector wrinkle worth getting ahead of:
- **GDPR-lawful:** EU data residency is fine for UK personal data because the UK and EU recognise each other's adequacy, so transfers are lawful. ✔
- **But some public buyers require *UK* residency contractually** — particularly NHS (the Data Security & Protection Toolkit), police, and anything touching MoD/OFFICIAL-classified data. This is a *contractual/policy* requirement, not a GDPR one.
- **So be ready to offer a UK region.** Both **Supabase and Vercel offer UK/London regions** — know exactly where every piece of data sits, and be able to say "UK-hosted" if a buyer requires it. Document your data flows so you can answer the residency question in one line.

## 5. The certification ladder (sequenced, and it gates deals)
The data-minimisation model makes every one of these easier to pass:
1. **Cyber Essentials** — cheap, fast, and the **entry requirement for G-Cloud Lot 2** (your fast route to public buyers). Do this first.
2. **Cyber Essentials Plus** — the audited version; some buyers and the G-Cloud hosting lots require it.
3. **NHS Data Security & Protection Toolkit** — specifically for ambulance/health buyers.
4. **ISO 27001** — the longer-term credential that matches xVR's posture for the largest/most security-conscious buyers.
5. **WCAG 2.2 AA accessibility** — for public bodies this is a *legal procurement requirement*, not optional. Build it into the product (keyboard nav, contrast, reduced-motion).
6. **SSO and audit logs** — org-level expectations that ride on the multi-tenancy work.

## 6. One-line positioning
> "Command360 is a tool for your organisation to build and run its own training. Your people don't need accounts, and we hold next to no personal data on them — which makes us fast to approve, low-risk to adopt, and squarely focused on doing one job well."

Keep saying that to buyers, and keep the architecture honest to it.
