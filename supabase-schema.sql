-- ==============================================================================
-- COMMAND 360 - Complete Database Schema
-- Run this in your Supabase SQL Editor (supabase.com > SQL Editor > New Query)
-- ==============================================================================


-- ==============================================================================
-- PRESENTATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  thumbnail_url TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_presentations_user_id ON presentations(user_id);
CREATE INDEX idx_presentations_updated_at ON presentations(updated_at DESC);

ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "presentations_select_owner" ON presentations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "presentations_insert_authenticated" ON presentations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "presentations_update_owner" ON presentations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "presentations_delete_owner" ON presentations FOR DELETE USING (auth.uid() = user_id);


-- ==============================================================================
-- SLIDES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id UUID NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  slide_type TEXT NOT NULL CHECK (slide_type IN ('poll', 'word_cloud', 'quiz', 'qna', 'survey', 'content')),
  position INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_slides_presentation_id ON slides(presentation_id);
CREATE INDEX idx_slides_position ON slides(presentation_id, position);

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "slides_select_public" ON slides FOR SELECT USING (TRUE);
CREATE POLICY "slides_insert_authenticated" ON slides FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM presentations WHERE presentations.id = slides.presentation_id AND presentations.user_id = auth.uid())
);
CREATE POLICY "slides_update_owner" ON slides FOR UPDATE USING (
  EXISTS (SELECT 1 FROM presentations WHERE presentations.id = slides.presentation_id AND presentations.user_id = auth.uid())
);
CREATE POLICY "slides_delete_owner" ON slides FOR DELETE USING (
  EXISTS (SELECT 1 FROM presentations WHERE presentations.id = slides.presentation_id AND presentations.user_id = auth.uid())
);


-- ==============================================================================
-- SESSIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id UUID NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  host_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_code VARCHAR(10) NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'paused', 'ended')),
  current_slide_id UUID REFERENCES slides(id) ON DELETE SET NULL,
  voting_open BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_presentation_id ON sessions(presentation_id);
CREATE INDEX idx_sessions_host_user_id ON sessions(host_user_id);
CREATE INDEX idx_sessions_room_code ON sessions(room_code);
CREATE INDEX idx_sessions_status ON sessions(status);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_select_public" ON sessions FOR SELECT USING (TRUE);
CREATE POLICY "sessions_insert_authenticated" ON sessions FOR INSERT WITH CHECK (auth.uid() = host_user_id);
CREATE POLICY "sessions_update_host" ON sessions FOR UPDATE USING (auth.uid() = host_user_id);


-- ==============================================================================
-- PARTICIPANTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  score INTEGER DEFAULT 0,
  client_token UUID DEFAULT gen_random_uuid(),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_participants_session_id ON participants(session_id);
CREATE INDEX idx_participants_client_token ON participants(client_token);
CREATE INDEX idx_participants_score ON participants(session_id, score DESC);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "participants_select_public" ON participants FOR SELECT USING (TRUE);
CREATE POLICY "participants_insert_public" ON participants FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "participants_update_own" ON participants FOR UPDATE USING (TRUE);


-- ==============================================================================
-- RESPONSES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  slide_id UUID NOT NULL REFERENCES slides(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  answer JSONB NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_responses_session_id ON responses(session_id);
CREATE INDEX idx_responses_slide_id ON responses(slide_id);
CREATE INDEX idx_responses_participant_id ON responses(participant_id);
CREATE UNIQUE INDEX idx_responses_unique_per_slide ON responses(slide_id, participant_id);

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "responses_select_public" ON responses FOR SELECT USING (TRUE);
CREATE POLICY "responses_insert_public" ON responses FOR INSERT WITH CHECK (TRUE);


-- ==============================================================================
-- QNA_QUESTIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS qna_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  slide_id UUID NOT NULL REFERENCES slides(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  upvote_count INTEGER DEFAULT 0,
  is_answered BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  ai_suggested_answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_qna_questions_slide_id ON qna_questions(slide_id);
CREATE INDEX idx_qna_questions_session_id ON qna_questions(session_id);
CREATE INDEX idx_qna_questions_upvotes ON qna_questions(slide_id, upvote_count DESC);

ALTER TABLE qna_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qna_questions_select_public" ON qna_questions FOR SELECT USING (TRUE);
CREATE POLICY "qna_questions_insert_public" ON qna_questions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "qna_questions_update_host" ON qna_questions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM sessions WHERE sessions.id = qna_questions.session_id AND sessions.host_user_id = auth.uid())
);


-- ==============================================================================
-- QNA_UPVOTES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS qna_upvotes (
  question_id UUID NOT NULL REFERENCES qna_questions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (question_id, participant_id)
);

ALTER TABLE qna_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qna_upvotes_select_public" ON qna_upvotes FOR SELECT USING (TRUE);
CREATE POLICY "qna_upvotes_insert_public" ON qna_upvotes FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "qna_upvotes_delete_public" ON qna_upvotes FOR DELETE USING (TRUE);


-- ==============================================================================
-- UPDATED_AT TRIGGERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_presentations_updated_at
  BEFORE UPDATE ON presentations FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slides_updated_at
  BEFORE UPDATE ON slides FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- ENABLE REALTIME on key tables
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE qna_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE responses;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
