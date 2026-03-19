-- Add speaker_notes column to slides table
ALTER TABLE slides ADD COLUMN IF NOT EXISTS speaker_notes TEXT DEFAULT '';
