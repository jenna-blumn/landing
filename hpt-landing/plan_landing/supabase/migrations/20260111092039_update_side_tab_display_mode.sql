/*
  # Update Side Tab Display Mode from 'overlay' to 'drawer'

  1. Changes
    - Update CHECK constraint on `display_mode` column to accept 'drawer' instead of 'overlay'
    - Migrate existing 'overlay' values to 'drawer'
    - Update default value from 'overlay' to 'drawer'

  2. Migration Details
    - Drop the existing CHECK constraint
    - Update all existing 'overlay' values to 'drawer'
    - Add new CHECK constraint with 'drawer' and 'floating'
    - Update the default value to 'drawer'
*/

-- First, update all existing 'overlay' values to 'drawer'
UPDATE side_tab_settings
SET display_mode = 'drawer'
WHERE display_mode = 'overlay';

-- Drop the old CHECK constraint
-- Note: PostgreSQL constraint names are auto-generated with pattern tablename_columnname_check
-- We need to find and drop it first
DO $$
BEGIN
  -- Drop the constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname LIKE '%side_tab_settings_display_mode%'
  ) THEN
    ALTER TABLE side_tab_settings DROP CONSTRAINT IF EXISTS side_tab_settings_display_mode_check;
  END IF;
END $$;

-- Alter the column to set new default and add new CHECK constraint
ALTER TABLE side_tab_settings
  ALTER COLUMN display_mode SET DEFAULT 'drawer',
  ADD CONSTRAINT side_tab_settings_display_mode_check
    CHECK (display_mode IN ('drawer', 'floating'));