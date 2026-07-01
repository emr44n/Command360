# Pending database migrations — RUN THESE

> Tracked so a future `/goal` run (or any session) picks them up. These are
> schema changes the app already expects but that have **not yet been applied**
> to the live Supabase database. Each ships with a graceful fallback so the app
> keeps working until you run it — but the feature is only fully persistent /
> synced once the SQL below has run.

To apply: open the Supabase project → **SQL Editor** → paste the SQL → Run.
All statements are idempotent (`IF NOT EXISTS`), so re-running is safe.

---

## 1. Slide Masters — `slide_masters` column  ⏳ pending

Enables server-side persistence + cross-device sync of Slide Masters (reusable
branded slide templates). Until this runs, masters save to per-device
localStorage only.

- Migration file: `supabase/migrations/20260701000000_add_slide_masters.sql`
- RLS: none needed — the value lives on the existing owner-scoped `presentations`
  row and inherits its policies.

```sql
ALTER TABLE presentations
  ADD COLUMN IF NOT EXISTS slide_masters jsonb DEFAULT '[]'::jsonb;
```

After running, tick this box and delete the section:
- [ ] Applied to production Supabase
