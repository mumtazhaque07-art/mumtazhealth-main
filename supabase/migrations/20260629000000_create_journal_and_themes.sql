CREATE TABLE IF NOT EXISTS user_journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_title TEXT NOT NULL,
  reflection TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_journal_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can insert their own journal entries" ON user_journal_entries;
DROP POLICY IF EXISTS "Users can view their own journal entries" ON user_journal_entries;

CREATE POLICY "Users can insert their own journal entries"
  ON user_journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own journal entries"
  ON user_journal_entries FOR SELECT
  USING (auth.uid() = user_id);

-- Monthly Themes table
CREATE TABLE IF NOT EXISTS monthly_themes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stage_id TEXT NOT NULL, -- e.g., 'stage1', 'stage2', or 'all'
  month_year TEXT NOT NULL, -- e.g., 'June 2026'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  posture TEXT NOT NULL,
  recipe TEXT NOT NULL,
  video_url TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE monthly_themes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active themes" ON monthly_themes;
DROP POLICY IF EXISTS "Admins can manage themes" ON monthly_themes;

CREATE POLICY "Anyone can view active themes"
  ON monthly_themes FOR SELECT
  USING (true);

-- Admins can do everything
CREATE POLICY "Admins can manage themes"
  ON monthly_themes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );
