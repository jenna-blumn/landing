/*
  # Create Side Tab Settings Table

  1. New Tables
    - `side_tab_settings`
      - `id` (uuid, primary key) - Unique identifier for the settings
      - `user_id` (uuid, foreign key to auth.users) - User who owns the settings
      - `slot_id` (integer) - Side tab slot ID (1 or 2)
      - `tab_id` (text, nullable) - ID of the tab assigned to this slot
      - `is_visible` (boolean) - Whether the side tab is currently visible
      - `display_mode` (text) - Display mode ('overlay' or 'floating')
      - `width` (integer) - Width of the side tab in pixels
      - `color` (text) - Color of the side tab button
      - `position_x` (integer, nullable) - X position for floating mode
      - `position_y` (integer, nullable) - Y position for floating mode
      - `created_at` (timestamptz) - When the settings were created
      - `updated_at` (timestamptz) - When the settings were last updated

  2. Security
    - Enable RLS on `side_tab_settings` table
    - Add policies for users to manage their own side tab settings
*/

CREATE TABLE IF NOT EXISTS side_tab_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slot_id integer NOT NULL CHECK (slot_id IN (1, 2)),
  tab_id text,
  is_visible boolean DEFAULT false,
  display_mode text DEFAULT 'overlay' CHECK (display_mode IN ('overlay', 'floating')),
  width integer DEFAULT 350,
  color text DEFAULT '#FF6B35',
  position_x integer,
  position_y integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, slot_id)
);

ALTER TABLE side_tab_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own side tab settings"
  ON side_tab_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own side tab settings"
  ON side_tab_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own side tab settings"
  ON side_tab_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own side tab settings"
  ON side_tab_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_side_tab_settings_user_id ON side_tab_settings(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_side_tab_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_side_tab_settings_updated_at_trigger
  BEFORE UPDATE ON side_tab_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_side_tab_settings_updated_at();