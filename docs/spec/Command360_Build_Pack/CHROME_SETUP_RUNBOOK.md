# CHROME RUNBOOK — paste into Claude for Chrome

> A prompt for the **Claude in Chrome** browsing agent. It provisions the
> services, wires the **command360.co.uk** domain, and **pauses** whenever a human
> must act (login, 2FA, payment, copying a secret, editing live DNS).
>
> **Hard rules the agent must follow:**
> - **Never type or echo a secret key into the chat.** Name the on-screen field
>   and tell me to copy it — I paste secrets into Vercel/.env myself.
> - **Pause** for: account creation, login, any 2FA/OTP, any payment/card entry,
>   and **before saving any DNS change** (so I can confirm the values).
> - One service at a time; confirm before moving on. Report errors verbatim.

---

PASTE FROM HERE ↓

You are provisioning the external services and DNS for my Next.js app
"Command 360". The live domain is **command360.co.uk**. Work the steps in order.
After each ⏸ PAUSE, wait until I type "continue". Never put a secret key into this
chat — when you reach one, tell me which field it is and tell me to copy it.

### 1 · Supabase
- supabase.com → dashboard. ⏸ PAUSE for login (+2FA).
- New project. **Region MUST be London (eu-west-2).** Strong DB password.
  ⏸ PAUSE while it provisions.
- Settings → API: point me to **Project URL**, **anon public** key, **service_role**
  key. Tell me to copy each (don't echo).
- Settings → Database → Connection string → **Transaction pooled (6543)** → tell me
  to copy as DATABASE_URL.
- Account → Security: enable **MFA** if off. ⏸ PAUSE.
- SQL Editor: I'll paste `supabase-schema.sql` → run it. Then each file from
  `migrations/` and `supabase/migrations/` in order → run. Report results.
- Authentication → URL Configuration: set **Site URL** = `https://command360.co.uk`
  and add **Redirect URLs**: `https://command360.co.uk/**`,
  `https://www.command360.co.uk/**`, `http://localhost:3000/**`. ⏸ PAUSE to confirm, then save.

### 2 · Google AI Studio (Gemini)
- aistudio.google.com. ⏸ PAUSE for login.
- **Get API key** → create. Tell me to copy as GEMINI_API_KEY (don't echo).

### 3 · Vercel (hosting + domain origin)
- vercel.com → Add New → Project → import GitHub repo **Command360**.
  ⏸ PAUSE for login / GitHub authorise.
- Environment Variables: add these 5 (I'll supply values; for secrets I paste —
  don't echo): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `GEMINI_API_KEY`.
- **Deploy.** ⏸ PAUSE while it builds; report pass/fail + any error.
- Settings → Functions → Region → **London (lhr1)** (residency requirement) → redeploy.
- Settings → Domains → add **command360.co.uk** AND **www.command360.co.uk**.
  Read back the **exact records Vercel shows** for pointing the domain at it.
  ⏸ PAUSE — I'll need these for step 4.

### 4 · Cloudflare (DNS + protection — the front layer)
- 123-reg.co.uk → log in → confirm I own **command360.co.uk**. ⏸ PAUSE.
- dash.cloudflare.com → **Add a site** → `command360.co.uk` → **Free** plan.
  ⏸ PAUSE for login. Cloudflare will show **two nameservers** — read them to me.
- Back in 123-reg → **Manage domain → Nameservers** → replace with Cloudflare's two.
  ⏸ PAUSE before saving. Save. (123-reg is now registrar only; DNS lives at Cloudflare.)
- In Cloudflare → **DNS** → add the Vercel records from step 3 (apex + `www`),
  **Proxied (orange cloud)**. ⏸ PAUSE before saving. Save.
- Cloudflare → **SSL/TLS** → mode **Full (strict)**.
- Return to Vercel and confirm the domain verifies + HTTPS issues (propagation can take a while).
- Cloudflare → **Turnstile** → create a free widget (for the contact form + auth/join).
  Tell me to copy the **site key** and **secret key** (secret → I paste, don't echo).

### 5 · Resend (email — only if I say I'm doing email now)
- resend.com → ⏸ PAUSE for login → API Keys → create one → tell me to copy as
  RESEND_API_KEY (don't echo). Add it to Vercel env too.
- Domains → add a **transactional** subdomain `notifications.command360.co.uk`
  (and later a **marketing** one `news.command360.co.uk`).
- Read back the **DKIM / SPF / DMARC** records Resend generates. Then go to
  **Cloudflare → DNS** and add them. ⏸ PAUSE before saving. Save → verify in Resend.

When done, summarise: services configured, domain status (verified/pending), and
what's still pending.
