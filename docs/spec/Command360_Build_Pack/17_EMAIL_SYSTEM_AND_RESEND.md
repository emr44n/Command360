# 17 · Email System (Resend)

*Addition to the build spec pack. How Command 360 sends email — what, to whom, how, and the design + compliance rules.*

---

## 1. Principles

- **Resend + React Email.** Build emails as **React components** that import the **same design tokens as the repo** → emails match the design system (within email-client limits).
- **Privacy-by-design (don't break it).** Transactional email goes to **org users only** (Admins / Authors / Instructors). **Participants get NO email** — they join via QR/link with no account, so we never hold participant email addresses.
- **Two separate streams, kept apart:**
  - **Transactional** — account & system emails (triggered by app events).
  - **Marketing** — newsletter / lifecycle.
  - Send them from **different subdomains** to protect deliverability, and because the **consent rules differ** (see §7).

## 2. Why Resend + React Email

- **React Email** = design emails as components, reuse repo colours/fonts/spacing/logo, and it handles the ugly bits (inline CSS, table layouts, client quirks).
- Fits the stack (Next.js / React). Sent **server-side** (server actions / API routes / Supabase triggers).
- Resend provides: custom **domains** (DKIM/SPF), **webhooks** (delivered / bounced / complained), and **Broadcasts + Audiences** for the newsletter.

## 3. Email catalogue

| Email | Trigger | Recipient | Stream | When |
|---|---|---|---|---|
| **Verify email** | Sign-up | New user | Transactional | Launch |
| **Welcome** | Account created | New user | Transactional | Launch |
| **Password reset** | Reset requested | User | Transactional | Launch |
| **Login / magic link** | Passwordless login | User | Transactional | Launch* |
| **User invitation** ("You're invited to *[Org]*") | Admin invites a teammate | Invited user | Transactional | Launch |
| **Billing / order confirmation + receipt** | Purchase / renewal | Admin / billing | Transactional | Launch |
| **Contact-form auto-reply** | Contact form submitted | Enquirer | Transactional | Launch |
| **Contact-form / demo notification** | Form submitted | You (internal) | Transactional | Launch |
| **Security alert** (new login, password changed) | Security event | User | Transactional | Soon |
| **Invitation accepted** | Invite accepted | Admin | Transactional | Soon |
| **Evidence export ready** (link or branded PDF) | Export generated | Organiser | Transactional | Soon |
| **Session reminder** | Scheduled session due | Org users (not participants) | Transactional | Soon |
| **Renewal reminder / payment failed / trial expiring** | Billing state | Admin | Transactional | Soon |
| **Role changed / access removed** | Admin action | Affected user | Transactional | Later |
| **Newsletter / product updates** | Manual / scheduled | Subscribers (opted-in) | Marketing | Later |
| **Onboarding drip** | After sign-up | New org users | Marketing | Later |

\*Depends on whether auth is passwordless.

> **Note on participants:** if an org wants to send participants a join link, that's the org doing it their own way — the platform does **not** collect participant emails or send to them.

## 4. Design

- Build with **React Email**, importing the **repo's design tokens** (colours, fonts, spacing, logo) so emails look like the product.
- **Caveat:** email ≠ web — inline CSS, table-based layout, limited CSS support. So it's "**as close as email clients allow**," not pixel-identical.
- **Reusable components:** header (logo) · body · primary button (CTA) · footer (sender identity, physical address, and an **unsubscribe link on marketing only**).
- **Optional later:** per-org **white-label** emails (the org's logo/colours on org-facing emails), matching the platform's white-label model.

## 5. How it fits (architecture)

- **Transactional:** app event → call Resend API **server-side** (never expose the key client-side).
- **Supabase Auth emails:** Supabase sends auth emails (verify, reset) by default. To **brand them and route through Resend**, either set **Resend as the custom SMTP provider** in Supabase, or use the Auth **send-email hook**. *Decision: own the auth emails via Resend for brand consistency.*
- **Webhooks:** consume Resend webhooks to track **delivered / bounced / complained**; suppress hard bounces; flag complaints.
- **Idempotency:** guard against double-sends on retries.

## 6. Deliverability & domains

- Use a **dedicated sending subdomain** (e.g. `notifications.command360.com` for transactional, a separate one like `news.command360.com` for marketing).
- Set up **SPF, DKIM, DMARC** on the sending domain; warm it up.
- **Never** send marketing from the transactional subdomain (a marketing complaint shouldn't poison password-reset deliverability).
- Monitor **bounce + complaint rates**.

## 7. Compliance (UK)

- **Transactional ≠ marketing.** Account/system emails (verify, reset, receipts, invites) need **no marketing consent**.
- **Marketing (newsletter) — PECR:**
  - Needs **consent**, or the **soft opt-in** for existing B2B customers.
  - Every marketing send needs a working **unsubscribe** + clear **sender identity**; honour unsubscribes **immediately**.
- **Contact-form reply:** legitimate interest — reply only; **don't** auto-add the enquirer to the newsletter without consent.
- **GDPR:** email is personal data — store minimally, support deletion. **Resend is a sub-processor** → add to your sub-processor list + sign their DPA; check Resend's **data region**.
- **Keep participant data out of email entirely** — it's a core privacy selling point.

## 8. Build phasing

- **Launch (with Phase 0 / auth):** verify email, welcome, password reset, user invitation, billing receipt, contact-form reply + internal notification.
- **Soon:** evidence-export-ready, session reminder (org users), security alerts, billing reminders.
- **Later:** newsletter (Resend Broadcasts/Audiences), onboarding drip, per-org white-label emails.

## 9. Open decisions

- Sending **domain/subdomain** names.
- **Own auth emails via Resend** vs Supabase default.
- **Newsletter** via Resend Broadcasts vs a dedicated marketing tool.
- Whether **org-facing emails carry per-org branding**.
- **Resend as a sub-processor** → update DPA + sub-processor list (ties to file 05).
