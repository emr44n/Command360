# 31 · Accounts, Teams, Auth & Licence Profiles

*Day-one. Org account creation, team structure, email invites, government-grade sign-in, and the fully configurable commercial engine (Licence Profiles + quote/licence generator).*

## 1. Org account creation (super-admin)
Create an org with full profile: name, logo upload, agency category (fire/police/ambulance/aviation/COMAH/ports/rail/defence/private — admin can add categories with icon), address, phone, contact emails, main-account owner. Org profile powers branded outputs (report PDFs, Resend emails carry their logo/details). Assign a **Licence Profile** at creation, then tailor (price, dates, users, GB, features) — every contract curated per org.

## 2. Teams & members
- `teams` within an org (Watch A, Training Dept…). Sharing scopes: private → team → org (→ direct-to-brigade / community, file 19/30).
- **Invite flow:** org owner/admin enters colleague emails → branded Resend invites → each recipient sets their own password + MFA on first sign-in (GDPR-clean: minimal data, self-managed credentials). Roles per member: owner / admin / instructor / author (viewer optional).
- Users are **effectively unlimited (fair-use)**; the metered resource is storage. Member counts feed org analytics.

## 3. Sign-in & security (NCSC-aligned — the government tick-boxes)
- **Supabase Auth (LOCKED — no Clerk).** Password + **TOTP authenticator app** MFA (free, native) as baseline; **passkeys** offered as the flagship method (GOV.UK direction; Cyber Essentials 2025 recognises passkeys). **No SMS OTP** — NCSC ranks it lowest and it adds cost ($75/mo) for worse security.
- **"Sign in with Microsoft" (Entra ID)** OAuth on the login page day one — public sector lives in M365. Google OAuth optional for private sector.
- Session timeout/idle lock (configurable per org), rate-limited auth endpoints + Turnstile, audit log of auth events. MFA enforceable org-wide by the org admin.

## 4. Licence Profiles (the configurable costing model)
Super-admin CRUD for **profile templates**: name, guide price, currency, **annual uplift %** (default "CPI or 5%, whichever is lower"), included users (or unlimited), storage GB, feature flags, support tier, notes. Bands ship as editable seed data (Small £6k/25GB · Standard £8k/25GB · Large £14k/50GB · Metro-National £18–22k/100–150GB · Bespoke) — **numbers live in the DB, never in code**; change them any time in admin. Assign profile → org; per-org overrides allowed. Sales reference: `command360-fire-service-sizing-and-pricing.md` (in this pack).

## 5. Quote & licence-agreement generator (the LearnPro-style flow, ours)
From an org's admin page: generate a **quote/licence agreement** — profile, price, term dates, uplift clause, PO terms ("PO required 45 days prior to renewal"), VAT handling (ex-VAT; added by client type), storage/users summary, notes. Output: **branded PDF** + **shareable link**; email via Resend; the document **appears in the client's account settings** for their main user to view/download/sign-off. Statuses: draft → sent → accepted → active; renewal reminders auto-fire T-90/T-60/T-45. All of it audit-logged.

## 6. Change-impact
Touches memberships/roles (Phase 0 model), Resend templates (file 17), report branding (file 30), RLS (org + team scoping). Flow-test: create org → invite member → member self-registers with TOTP → team share → quote generated → appears in client settings → renewal reminder fires.
