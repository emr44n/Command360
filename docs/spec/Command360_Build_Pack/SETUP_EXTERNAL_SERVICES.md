# SETUP · External Services, Domain & API Keys — Command 360

> **Domain: `command360.co.uk`** (registered at 123-reg; already hardcoded in the
> code's `metadataBase`, footer, join URLs and contact addresses). It's time to
> point it at the real hosting.
>
> **Hosting decision is locked — see `HOSTING_DECISION.md`.** Accounts needed:
> **Cloudflare** (DNS + CDN + protection) · **Supabase** · **Google AI
> Studio** · **Vercel** · **Resend** (email — launch phase) · GitHub. Secrets live
> in `.env.local` (local) + Vercel env (prod) — **never commit them**.

## Environment variables

**Required now (Phase 0 — what the code already reads):**

| Variable | Secret? | Service | Where |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase | Settings → API → `anon public` |
| `SUPABASE_SERVICE_ROLE_KEY` | **secret** | Supabase | Settings → API → `service_role` |
| `DATABASE_URL` | **secret** | Supabase | Settings → Database → Transaction pooled (6543) |
| `GEMINI_API_KEY` | **secret** | Google AI Studio | aistudio.google.com → Get API key |

**Added at the email/launch phase (not wired yet — file 17):**

| Variable | Secret? | Service | Where |
|---|---|---|---|
| `RESEND_API_KEY` | **secret** | Resend | resend.com → API Keys → Create |
| `EMAIL_FROM` *(or set in code)* | public | — | e.g. `Command 360 <noreply@notifications.command360.co.uk>` |

`.env.local` template (repo root, git-ignored):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
GEMINI_API_KEY=
# email (launch phase):
RESEND_API_KEY=
```

## Do I still need 123-reg? — only as the **registrar**
123-reg just holds the domain registration. **You do NOT use 123-reg hosting, its
parking page, or its DNS panel.** DNS moves to **Cloudflare** (the front layer);
hosting is **Vercel**. See `HOSTING_DECISION.md` for why.

### Domain & DNS — DNS lives at Cloudflare (see `HOSTING_DECISION.md`)
Cloudflare is the front layer (CDN + WAF + DDoS + Turnstile) and the **DNS home**.
123-reg stays the **registrar only**. (You already run Cloudflare for another
site, so this is familiar.)

1. **Cloudflare → Add a site** → `command360.co.uk` (Free plan) → Cloudflare gives
   you two **nameservers**.
2. **123-reg → Manage domain → Nameservers** → replace 123-reg's nameservers with
   Cloudflare's. (Propagation: minutes–hours.)
3. **Vercel → Project → Settings → Domains** → add `command360.co.uk` + `www`.
   Vercel shows the records to point at it.
4. **Cloudflare → DNS** → add those records (apex + `www`) pointing at Vercel,
   **proxied (orange cloud)**. Set **SSL/TLS mode → Full (strict)**.
5. **Vercel → Settings → Functions → Region → London (`lhr1`)** so request
   processing stays in the UK (residency requirement).
6. **Cloudflare → Turnstile** → create a free widget for the contact form +
   auth/join (the "reCAPTCHA" bot protection) — wire it in at the launch phase.

## Supabase — point auth at the real domain
- **Authentication → URL Configuration:**
  - **Site URL:** `https://command360.co.uk`
  - **Redirect URLs:** add `https://command360.co.uk/**`, `https://www.command360.co.uk/**`, your Vercel preview URL, and `http://localhost:3000/**`.
  - This makes verify / reset / magic-link emails point at the real site, not `vercel.app`.
- Region **London / `eu-west-2`** (set at project creation, permanent), admin **MFA**, **PITR/backups** before real data, staff-only auth (participants get no accounts — spec 05).

## Resend — email (launch phase, per file 17)
- Create the account → **add a domain**, using **subdomains** to protect deliverability:
  - **Transactional:** e.g. `notifications.command360.co.uk`
  - **Marketing:** a separate one, e.g. `news.command360.co.uk` (keep streams apart — file 17 §6).
- Resend generates **DKIM / SPF / DMARC** records per subdomain. **Add them in
  Cloudflare DNS** (your DNS home) → verify in Resend.
- `from` addresses: `noreply@notifications.command360.co.uk` (transactional), marketing from the news subdomain.
- **Brand Supabase auth emails via Resend:** set Resend as Supabase's **custom SMTP** (Auth → SMTP), or use the Auth send-email hook (file 17 §5).
- **Compliance:** Resend becomes a **sub-processor** → add to your sub-processor list + sign their DPA, and check their data region (file 17 §7, ties to spec 05).
- *(Separate concern — inbound mailboxes:* receiving at `hello@command360.co.uk`
  etc. needs MX/mailbox setup at 123-reg or a mail host; Resend is outbound only.
  Not required for the build.)*

## Order of operations
1. **Supabase** project (London) → 4 values → apply `supabase-schema.sql` + each
   file in `migrations/` and `supabase/migrations/` (SQL Editor, or
   `psql "$DATABASE_URL" -f file.sql` on the direct 5432 connection).
2. **Google AI Studio** → `GEMINI_API_KEY`.
3. **Local:** fill `.env.local` → `npm install` → `npm run dev`.
4. **Vercel:** import GitHub repo → add the env vars → Functions region **London (lhr1)** → deploy.
5. **Domain:** move nameservers to **Cloudflare**; add `command360.co.uk` (+ www) in Vercel; add Vercel's records in **Cloudflare DNS** (proxied); SSL **Full (strict)**.
6. **Supabase auth URLs** → set Site URL + redirect URLs to the real domain.
7. **(Launch phase) Resend:** verify subdomains → DNS records into **Cloudflare DNS** → `RESEND_API_KEY` → build the file-17 emails.

## Stack facts (from the repo)
`@google/genai` (Google AI Studio, not Vertex), model `gemini-2.0-flash` ·
`@supabase/supabase-js` + `@supabase/ssr` · `pg` (uses `DATABASE_URL`) · Next.js
16.1.6. Resend is **not** integrated yet — only a TODO in the invite route; it's a
file-17 build.
