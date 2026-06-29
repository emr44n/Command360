-- Multi-scene live presentation: which studio scenes (slide IDs) a session is
-- currently broadcasting "live". Participants pick one of these to show
-- full-screen in their room. Empty array = no scenes selected yet.
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS live_scene_ids JSONB NOT NULL DEFAULT '[]'::jsonb;
