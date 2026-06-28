# START HERE — Command 360 launch plan

> Do these three phases in order. **Skip Google Drive** — Claude Code in the cloud
> builds from your **GitHub repo**, so files go into GitHub (the same drag-and-drop,
> just into the place the agent actually reads from).

## At a glance
**A. Files into the repo** → **B. Set up the services** → **C. Run `/goal`** (the build loop).

---

## PHASE A — Get the files into the GitHub repo (one-time, ~10 min, no terminal)

1. Download `Command360_Build_Pack_v6.zip` and **unzip** it on your computer.
2. github.com → your **Command360** repo → **Add file → Upload files** → drag the
   unzipped **`Command360_Build_Pack` folder** in → put it under the path
   **`docs/spec/`** → **Commit**.
3. Upload your **`CLAUDE.md`** (from your own zip) to the repo **root** the same way.
4. Upload **`docs/spec/goal-command.md`** to **`.claude/commands/goal.md`** (so typing
   `/goal` runs it). *(Your repo already has a `.claude/` folder.)*

### Where each file goes
| File / folder | Goes to |
|---|---|
| `Command360_Build_Pack/` (the whole pack) | `docs/spec/` |
| `CLAUDE.md` (your own) | repo **root** |
| `goal-command.md` (from the pack) | `.claude/commands/goal.md` |

---

## PHASE B — Set up the services (do at least Supabase before the build)

The infrastructure is **locked** in `HOSTING_DECISION.md`: **Supabase + Vercel in
London**, **Cloudflare in front** (DNS + CDN + WAF + DDoS + Turnstile, free — your
bot/hack protection).

- **Easiest:** open **Claude for Chrome** and paste `CHROME_SETUP_RUNBOOK.md`. It
  walks Supabase (London) → Google AI Studio → Vercel (London) → Cloudflare
  (DNS + Turnstile), pausing for your logins, 2FA, and keys.
- **Or by hand:** follow `SETUP_EXTERNAL_SERVICES.md`.
- Then fill **`.env.local`** with the 5 keys and confirm `npm install` + `npm run dev`
  runs locally. *(Phase 0 of the build needs the Supabase project to exist so it can
  apply migrations and run the isolation tests.)*

---

## PHASE C — Run the build (the `/goal` loop)

1. Open **Claude Code in the cloud** (Agent View) on your `Command360` repo.
2. Type **`/goal`** (if you added the command file) **or** paste the initial prompt
   below.
3. The agent reads the spec and builds **Phase 0 → 7**, stopping at each gate for
   your review. Read its 3-line note, check the gate, tell it to continue.

### The initial prompt (paste this, or use `/goal`)
```
You are the lead engineer for Command 360. The build spec pack is in this repo at docs/spec/.

1. Read docs/spec/MASTER_GOAL_BUILD_PROMPT.md, then spec files 00–17, then docs/spec/MASTER_GOAL_CONDITIONS.md. These are the source of truth. CLAUDE.md (repo root) holds standing rules.
2. Build in phase order 0 → 7. Use the DONE-WHEN checklist in MASTER_GOAL_CONDITIONS.md as the gate for each phase. Do NOT start a phase until EVERY DONE-WHEN line of the previous phase is verified — by a passing test, a clean `npx tsc --noEmit`, or the exact UI action performed.
3. Phase 0 is a hard gate: no feature work until tenancy + RLS isolation tests pass and zero `USING (TRUE)` policies remain.
4. UI: follow the repo's own design system in spec file 15 (v5 tokens in src/app/globals.css and src/app/page.tsx). Never invent tokens. IGNORE design-system/command-360/MASTER.md — it is a stale template.
5. Infrastructure is LOCKED — see docs/spec/HOSTING_DECISION.md (Supabase + Vercel in London; Cloudflare in front). Do NOT re-architect infra.
6. Subagents are allowed WITHIN a phase to parallelise independent work (e.g. migration + isolation tests at once). Do NOT parallelise across phases — they form a dependency chain.
7. After each phase, write a 3-line note (what changed · what to verify · what's next) and STOP at the gate for my review.

Begin with Phase 0.
```

### How the loop + multi-agents work
- **Loop (sequential):** one phase at a time; the agent must verify every DONE-WHEN
  line before moving on. The phases are a dependency chain — Phase 0 blocks everything.
- **Multi-agents (within a phase):** the agent can spin up subagents to do independent
  work in parallel *inside* a phase (e.g. one writes the SQL migration while another
  writes the RLS isolation tests). It must **not** run different phases in parallel.
- **Your role at each gate:** read the 3-line note, sanity-check, say "continue".

---

## Quick checklist
- [ ] Pack uploaded to `docs/spec/`
- [ ] `CLAUDE.md` at repo root
- [ ] `goal-command.md` → `.claude/commands/goal.md`
- [ ] Supabase project created (London) + schema/migrations applied
- [ ] Vercel imported, Functions region London, 5 env vars set
- [ ] Cloudflare site added, nameservers switched, DNS proxied, Turnstile created
- [ ] `.env.local` filled, `npm run dev` works
- [ ] `/goal` → Phase 0 running
