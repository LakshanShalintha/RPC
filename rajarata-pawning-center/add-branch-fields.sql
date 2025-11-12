-- ============================================
-- COMPLETE BRANCHES TABLE SETUP WITH ALL FIELDS
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Step 1: Create branches table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.branches (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  title_si TEXT,
  description_si TEXT,
  address TEXT,
  address_si TEXT,
  contact_number TEXT,
  map_url TEXT,
  is_coming_soon BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Add columns if table already exists (safe to run even if columns exist)
ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS title_si TEXT;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS description_si TEXT;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS address_si TEXT;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS contact_number TEXT;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS map_url TEXT;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS is_coming_soon BOOLEAN DEFAULT false;

-- Step 3: Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_branches_order ON public.branches(order_index);

-- Step 4: Enable Row Level Security
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access branches" ON public.branches;
DROP POLICY IF EXISTS "Allow authenticated insert branches" ON public.branches;
DROP POLICY IF EXISTS "Allow authenticated update branches" ON public.branches;
DROP POLICY IF EXISTS "Allow authenticated delete branches" ON public.branches;

-- Step 6: Create policies for public read access
CREATE POLICY "Allow public read access branches" ON public.branches
  FOR SELECT
  USING (true);

-- Step 7: Create policies for public insert
CREATE POLICY "Allow authenticated insert branches" ON public.branches
  FOR INSERT
  WITH CHECK (true);

-- Step 8: Create policies for public update
CREATE POLICY "Allow authenticated update branches" ON public.branches
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Step 9: Create policies for public delete
CREATE POLICY "Allow authenticated delete branches" ON public.branches
  FOR DELETE
  USING (true);

-- Step 10: Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'branches' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Expected columns:
-- id, title, description, title_si, description_si, address, address_si, 
-- contact_number, map_url, is_coming_soon, order_index, created_at

-- DONE! Your branches table is now ready with all fields for:
-- - Bilingual support (English/Sinhala)
-- - Address details
-- - Contact numbers
-- - Google Maps integration
