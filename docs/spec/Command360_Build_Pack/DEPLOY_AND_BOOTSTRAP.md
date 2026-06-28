# DEPLOY & BOOTSTRAP — get the pack into the repo, then run /goal

## The one truth about how this works
Your coding agent (Claude Code CLI · Antigravity · Claude Code on the web) builds
from the **GitHub repo** — not from Google Drive. A local/CLI agent reads files on
disk; a cloud agent (Agent View / Code-on-web) reads what's **pushed to GitHub**.
So the only real requirement is:

> **The spec pack must end up committed in the repo.**

**You don't need Google Drive.** The files are already on your machine in the zip;
routing them through Drive is a detour, and a coding agent can't reliably pull
from a Drive *link* anyway. Use whichever route fits how you work:

### Route A — local CLI / Antigravity (you have a terminal)
1. Unzip → copy the `Command360_Build_Pack` folder into the repo as `docs/spec/`.
2. Ensure **your** `CLAUDE.md` is at the repo **root** (you already have it from
   your own zip — it is *not* in this pack).
3. Let the agent commit (Bootstrap prompt below) or commit yourself. For a *local*
   agent, files on disk are enough even before pushing.

### Route B — no terminal (easiest if you dislike the command line)
1. Unzip on your machine.
2. github.com → your **Command360** repo → **Add file → Upload files** → drag the
   unzipped files into a `docs/spec/` folder → **Commit**.
3. Put `CLAUDE.md` at the repo root the same way.
4. Agent View / Claude Code on the web now sees them.

*(No Drive step in either route.)*

## Bootstrap prompt (optional — agent does the filing + push for you)
Put the zip/folder inside the repo first, then paste this into Claude Code / Antigravity:
```
Unzip / move the Command360_Build_Pack into this repo at docs/spec/ (create it).
Confirm my CLAUDE.md is at the repo root (do not overwrite it). Create a .env.local
at the repo root from docs/spec/SETUP_EXTERNAL_SERVICES.md's template with EMPTY
values, and confirm it is git-ignored. Do NOT invent any secrets. Then stage
everything, commit "chore: add Command 360 build spec pack", and push to the
current branch. Print the final docs/spec/ tree when done.
```

## Wire up /goal as a real command
Save `goal-command.md` (in this pack) to your repo at **`.claude/commands/goal.md`**.
Then in Claude Code, typing **`/goal`** runs the kickoff automatically. (Your repo
already has a `.claude/` folder.)

## The full sequence
1. Files into repo (Route A or B). 2. Hosting per **`HOSTING_DECISION.md`** (locked): Supabase + Vercel in **London**,
**Cloudflare** in front for DNS/CDN/WAF/DDoS/Turnstile. Set it up via
`SETUP_EXTERNAL_SERVICES.md` or run `CHROME_SETUP_RUNBOOK.md` in Claude-for-Chrome.
3. `.env.local` filled + `npm install` + `npm run dev` works locally.
4. `/goal` → agent builds **Phase 0 → 7**, stopping at each gate in
`MASTER_GOAL_CONDITIONS.md` for your review.
5. **Email (launch phase, file 17):** wire **Resend** + `RESEND_API_KEY`, verify the
sending subdomains in DNS, build the file-17 emails. Add Resend to your
sub-processor list + DPA (spec 05).
