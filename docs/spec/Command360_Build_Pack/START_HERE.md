# START HERE — Command 360, from zero to building

Your complete run sheet. Three parts: **get the files in → set up accounts/services → run the build.** Follow top to bottom.

> **You have 3 downloads:**
> 1. `Command360_Build_Pack_v17.zip` → into the repo at **docs/spec/**
> 2. `CLAUDE.md` → the repo **ROOT**
> 3. `START_HERE.md` → this file (also inside the zip)

---

## PART 0 — Sync your LOCAL repo first (do this before anything)
You've been working in the online repo, so your local copy is behind. Paste this into your local Antigravity / Claude Code first:
```
Sync this local repo with GitHub before we add anything:
1. Run `git status`. If there are uncommitted local changes, STOP and list them for me — do not discard anything without my say-so.
2. If clean (or after I decide), run `git checkout main` and `git pull origin main` so local matches the online repo exactly.
3. Confirm with `git log --oneline -5` and tell me the latest commit message.
Do not push anything yet.
```
✅ **Done when:** local `main` matches GitHub's latest commit. THEN do Part 1 (add the pack + CLAUDE.md locally, commit, and push to main).

## PART 1 — Get the files into the GitHub repo

Your coding agent builds from the **GitHub repo**. *(Google Drive is fine as a personal backup, but it's NOT part of the path — the agent can't build from Drive. The files must land in GitHub.)*

**Easiest — let Antigravity do it (no file juggling).** Unzip the pack, then paste into Antigravity:
```
The unzipped "Command360_Build_Pack_v17" folder is in my Downloads, and CLAUDE.md is there too.
1. Copy the CONTENTS of Command360_Build_Pack_v17 into this repo at docs/spec/ (flattened — files directly in docs/spec/, not a nested subfolder). Create docs/spec/ if needed.
2. Put CLAUDE.md in the repo ROOT.
3. Never stage or commit any .env file or secret.
4. Stage everything, commit "chore: Command 360 spec pack + build rules", and push.
5. List docs/spec/ and confirm CLAUDE.md is at the root.
```
**Or by hand (no terminal):** github.com → your Command360 repo → **Add file → Upload files** → drag the pack's files into a `docs/spec/` folder → also add `CLAUDE.md` at the root → Commit.

✅ **Done when:** `docs/spec/` holds the spec files and `CLAUDE.md` is at the repo root, pushed to GitHub.

---

## PART 2 — Accounts + baseline setup (services, domain, secrets)

### 2a. Sign in / create these (you already have GitHub + 123-reg + **Supabase (live)** + **a Gemini API key**)
- **Supabase** — ALREADY SET UP ✔ (runbook only verifies region/keys/MFA — no new project)
- **Google AI Studio** — key ALREADY HELD ✔ (runbook only verifies it's in `.env.local`)
- **Vercel** (hosting) — vercel.com
- **Cloudflare** (DNS + protection) — cloudflare.com  ← you already use it
- **Resend** (email) — resend.com  ← only when you build email (launch phase)

### 2b. Let Claude for Chrome do the setup
Log into the sites above first, then paste **`CHROME_SETUP_RUNBOOK.md`** (in the pack) into **Claude for Chrome**. Pausing for your logins / 2FA / payment / key-copying, it will:
- **Supabase:** create the project in **London (eu-west-2)**, hand you the keys, apply the schema, turn on MFA.
- **Google AI Studio:** create your Gemini key.
- **Vercel:** import the repo, add your 5 env vars, set Functions region **London (lhr1)**, deploy, add the domain.
- **Cloudflare:** add `command360.co.uk`, give you the nameservers, set DNS (proxied) + SSL Full (strict), create a **Turnstile** widget (bot protection).
- **123-reg:** swap the nameservers to Cloudflare's so the domain points the right way.

**Security:** secret keys go into **Vercel env** and your local **.env.local** — never pasted into chat.

### 2c. Confirm it runs locally
Create `.env.local` at the repo root (details in `SETUP_EXTERNAL_SERVICES.md`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
GEMINI_API_KEY=
```
Then: `npm install` → `npm run dev` → the app loads.

✅ **Done when:** Supabase exists (London), `.env.local` is filled, `npm run dev` works, and the domain points at Vercel via Cloudflare.

---

## PART 3 — Run the build (`/goal`)

Open Claude Code (cloud / Agent View, or CLI) on your repo and paste:
```
Read CLAUDE.md in the repo root, then read the spec pack in docs/spec/ — START WITH 24_REPO_REALITY_MAP.md and 25_DATA_FLOW_AND_CHANGE_IMPACT.md (the ground truth of what exists and how data flows), then MASTER_GOAL_BUILD_PROMPT.md, spec files 00–34, and MASTER_GOAL_CONDITIONS.md.

Work on a NEW branch `build/goal` — never commit to main. My live site stays untouched until I review and merge.

FIRST, before any coding: produce a written reconciliation plan — for each spec entity, name the existing table/route/component and state whether you will adapt / relabel / build. ADAPT existing code; do NOT create duplicate tables or rename storage without a data-preserving migration (see file 24). Show me this plan at the Phase 0 gate.

Then build the app in phase order 0 → 9. Use the DONE-WHEN checklist in MASTER_GOAL_CONDITIONS.md as the gate for each phase. Plan before coding each phase. Do NOT start a phase until every DONE-WHEN line of the previous phase is verified WITH EVIDENCE (test output, a clean `npx tsc --noEmit`, or the exact UI action performed) and checked by a fresh verifier subagent — a security-reviewer subagent for Phase 0.

Phase 0 is a hard gate: no feature work until tenancy + RLS isolation tests pass and zero USING (TRUE) policies remain.

Use subagents within a phase to parallelise independent work and to verify gates, but never run different phases at the same time. Commit after each green phase, write a 3-line note (what changed · what to verify · what's next), and STOP for my review before starting the next phase.

Begin with the reconciliation plan, then Phase 0.
```

> The agent works on a **`build/goal` branch** (your live site is safe) and shows a **reconciliation plan** first (mapping the spec to your existing code) — approve that at the Phase 0 gate.

### The cadence (Anthropic best practice)
- **Phase 0** builds → agent shows a report with **evidence** (isolation tests passing, zero `USING (TRUE)`, `tsc` clean) → **verify this one properly** (it's the security foundation) → say "continue".
- **Phases 1 → 8:** each builds → shows evidence → you **glance** (tests green, `tsc` clean, feature works, committed) → "continue". ~30 seconds a gate.
- Every phase is held to the locked criteria and checked by a fresh verifier subagent before the next starts. That gate-by-gate loop is what keeps the code clean.

---

## One-page checklist
- [ ] Pack files in `docs/spec/` (pushed)
- [ ] `CLAUDE.md` at repo root (pushed)
- [ ] Accounts: Supabase, AI Studio, Vercel, Cloudflare
- [ ] Chrome runbook run: Supabase (London) + keys · Vercel (London) + env + domain · Cloudflare DNS + Turnstile · 123-reg nameservers
- [ ] `.env.local` filled (5 keys), `npm run dev` works
- [ ] Paste the `/goal` prompt → verify Phase 0 → continue through Phase 9
