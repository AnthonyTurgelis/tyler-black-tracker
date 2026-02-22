-- ============================================================
-- Tyler Black Tracker - Supabase Setup
-- Run this ONCE in your Supabase SQL Editor (Database > SQL Editor)
-- ============================================================

-- 1. Create the key-value storage table
CREATE TABLE IF NOT EXISTS collection_kv (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Auto-update the timestamp on every write
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER collection_kv_timestamp
  BEFORE UPDATE ON collection_kv
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 3. Enable Row Level Security
ALTER TABLE collection_kv ENABLE ROW LEVEL SECURITY;

-- 4. ANYONE can read (visitors see your collection)
CREATE POLICY "Public read access"
  ON collection_kv
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. Only YOU (authenticated) can write
CREATE POLICY "Owner insert access"
  ON collection_kv
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Owner update access"
  ON collection_kv
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Owner delete access"
  ON collection_kv
  FOR DELETE
  TO authenticated
  USING (true);

-- 6. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_collection_kv_updated 
  ON collection_kv (updated_at DESC);

-- ============================================================
-- DONE! Now go to Authentication > Users > Add User
-- to create your login account (email + password).
-- ============================================================
