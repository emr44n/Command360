-- Add rating_scale and open_text to the slides_slide_type_check constraint
-- Also add speaker_notes column if it doesn't exist

ALTER TABLE slides DROP CONSTRAINT IF EXISTS slides_slide_type_check;

ALTER TABLE slides ADD CONSTRAINT slides_slide_type_check
  CHECK (slide_type IN ('poll', 'word_cloud', 'quiz', 'qna', 'survey', 'content', 'rating_scale', 'open_text'));

ALTER TABLE slides ADD COLUMN IF NOT EXISTS speaker_notes TEXT DEFAULT '';
