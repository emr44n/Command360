-- Slide Masters (reusable branded slide templates), stored per-presentation.
--
-- STATUS: NOT YET APPLIED to the deployed database (owner will run this later —
-- see MIGRATIONS_TODO.md). Until it runs, the app persists masters to per-device
-- localStorage as a graceful fallback; running this enables server-side
-- persistence + cross-device sync. Safe to run any time; it is idempotent.
--
-- RLS: the `slide_masters` value lives on the existing `presentations` row, so it
-- inherits that table's existing row-level-security policies (owner-scoped by
-- user_id). No new policy or table is introduced, so no new isolation test is
-- required.

ALTER TABLE presentations
  ADD COLUMN IF NOT EXISTS slide_masters jsonb DEFAULT '[]'::jsonb;
