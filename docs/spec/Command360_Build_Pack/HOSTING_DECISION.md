# HOSTING DECISION — Command 360 (LOCKED)

*Decision of record. The build agent must not re-architect this. Reasoning is below so it survives diligence/procurement questions.*

## The decision

| Layer | Choice | Region |
|---|---|---|
| **Database / Auth / Storage** | **Supabase** | **London — `eu-west-2`** |
| **App host** (runs the Next.js server) | **Vercel**, Functions pinned to **London** | **`lhr1` (London)** |
| **Edge: DNS + CDN + WAF + DDoS + CAPTCHA** | **Cloudflare** (free plan, in front of Vercel) | global edge; UK data path preserved |
| **Email** | **Resend** (launch phase) | EU data region |
| **Registrar** | **123-reg** (domain only) | — |

**One line:** Personal data lives and is processed in the **UK** (Supabase + Vercel London). **Cloudflare sits in front** as a free security/CDN layer and gives the protection + CAPTCHA you wanted — without becoming the host.

## Why this is the right call for a UK emergency-services system

**Residency is the deciding factor.** Buyers (Fire/NHS/Police/MoD) require UK/EU data residency (spec 05, 14).
- **Supabase London** keeps the personal data in the UK at rest. ✔
- **Vercel Functions pinned to `lhr1`** keep request *processing* in the UK, self-serve on the Pro plan. ✔
- **Cloudflare in front** handles DNS, caching of **non-personal static assets**, and **L3/L4 DDoS + WAF** at the edge. Cloudflare is GDPR-compliant, EU Cloud Code of Conduct verified, and already used across UK public sector — acceptable as a CDN/security layer.

## Why NOT host the app on Cloudflare Workers (despite the price)

- To **guarantee UK-only processing**, Cloudflare Workers need **Regional Services**, part of the **Data Localization Suite** — a **paid Enterprise add-on** (purchased, account-team enabled). That **removes the cost advantage** that made Workers attractive. Cloudflare also advises **not to put PII in Worker code**.
- Even then there are caveats (HTTP/3 not supported by Regional Services; occasional out-of-region routing).
- Plus real stack friction: Supabase auth uses `cookies()` in middleware (Node-only — breaks on Workers); our global `pg` client errors on Workers ("I/O on behalf of a different request"); Worker bundle size limits; build-vs-runtime env handling. For an AI-built, solo-maintained app these are days of risk for ~£15/mo saved.

**Net:** the residency requirement is precisely why the app host is **Vercel-London**, not Cloudflare Workers.

## Cost (verified June 2026)

| Stage | Monthly | Notes |
|---|---|---|
| **Build** | **£0** | Vercel Hobby + Supabase Free + Cloudflare Free |
| **Launch** | **~£36** | Vercel Pro ~£16 + Supabase Pro ~£20 + Cloudflare Free + Resend Free |
| At scale | usage-based | Watch Gemini tokens; Supabase PITR (~£80/mo) only if a contract demands point-in-time recovery — daily backups (in Pro) suffice first |

Hosting is a tiny fraction of a single **~£10k/site** licence. Cloudflare in front also caps the worst Vercel cost risk (attack-driven bandwidth/function spikes) for free.

## What to configure (final architecture)

1. **Cloudflare = DNS home.** Move `command360.co.uk` nameservers from 123-reg to Cloudflare (you already run Cloudflare for another site). 123-reg stays registrar only.
2. **Vercel** = origin. Add `command360.co.uk` (+ `www`) in Vercel; set **Functions → Region → London (lhr1)**. Point Cloudflare DNS at Vercel (proxied / orange-cloud), SSL mode **Full (strict)**.
3. **Supabase** = London project; Auth Site URL + redirect URLs = the real domain.
4. **Cloudflare Turnstile** (free CAPTCHA — the "reCAPTCHA" you like) on the contact form + auth/join to block bots.
5. **Resend** DNS auth records (DKIM/SPF/DMARC) go in **Cloudflare DNS** now (not 123-reg).

## When to revisit
Only if Vercel bills ever grow materially (unlikely at this traffic), and ideally after the **official Cloudflare Next.js adapter** ships (removes today's friction). Until then: do not migrate the host.
