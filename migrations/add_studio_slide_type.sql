-- Add 'studio' to the allowed slide types
ALTER TABLE slides DROP CONSTRAINT IF EXISTS slides_slide_type_check;
ALTER TABLE slides ADD CONSTRAINT slides_slide_type_check
  CHECK (slide_type IN ('poll', 'word_cloud', 'quiz', 'qna', 'survey', 'content', 'rating_scale', 'open_text', 'studio'));
