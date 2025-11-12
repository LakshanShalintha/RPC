-- Supabase Database Setup for Slider Management
-- Run this SQL in your Supabase SQL Editor

-- 1. Drop existing table if you want to recreate (OPTIONAL - only if you want fresh start)
-- DROP TABLE IF EXISTS public.sliders;

-- 2. Create sliders table with order_index column
CREATE TABLE IF NOT EXISTS public.sliders (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. If table already exists but missing order_index column, add it
-- Run this if you get the error about missing order_index column
ALTER TABLE public.sliders 
ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

-- 4. Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_sliders_order ON public.sliders(order_index);

-- 5. Enable Row Level Security
ALTER TABLE public.sliders ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.sliders;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.sliders;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.sliders;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.sliders;

-- 7. Create policies for public read access
CREATE POLICY "Allow public read access" ON public.sliders
  FOR SELECT
  USING (true);

-- 8. Create policies for public insert (change to authenticated in production)
CREATE POLICY "Allow authenticated insert" ON public.sliders
  FOR INSERT
  WITH CHECK (true);

-- 9. Create policies for public update (change to authenticated in production)
CREATE POLICY "Allow authenticated update" ON public.sliders
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 10. Create policies for public delete (change to authenticated in production)
CREATE POLICY "Allow authenticated delete" ON public.sliders
  FOR DELETE
  USING (true);

-- 11. Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'sliders' AND table_schema = 'public';

-- Note: After running this SQL:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named "slider-images" (if not exists)
-- 3. Make it public
-- 4. Set the storage policies for SELECT, INSERT, DELETE operations

-- ============================================
-- BRANCHES TABLE SETUP
-- ============================================

-- 1. Create branches table
CREATE TABLE IF NOT EXISTS public.branches (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  title_si TEXT,
  description_si TEXT,
  is_coming_soon BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. If table already exists but missing columns, add them
ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS is_coming_soon BOOLEAN DEFAULT false;

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

-- 3. Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_branches_order ON public.branches(order_index);

-- 4. Enable Row Level Security
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access branches" ON public.branches;
DROP POLICY IF EXISTS "Allow authenticated insert branches" ON public.branches;
DROP POLICY IF EXISTS "Allow authenticated update branches" ON public.branches;
DROP POLICY IF EXISTS "Allow authenticated delete branches" ON public.branches;

-- 6. Create policies for public read access
CREATE POLICY "Allow public read access branches" ON public.branches
  FOR SELECT
  USING (true);

-- 7. Create policies for public insert (change to authenticated in production)
CREATE POLICY "Allow authenticated insert branches" ON public.branches
  FOR INSERT
  WITH CHECK (true);

-- 8. Create policies for public update (change to authenticated in production)
CREATE POLICY "Allow authenticated update branches" ON public.branches
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 9. Create policies for public delete (change to authenticated in production)
CREATE POLICY "Allow authenticated delete branches" ON public.branches
  FOR DELETE
  USING (true);

-- 10. Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'branches' AND table_schema = 'public';

-- 11. Insert default branches (optional)
-- INSERT INTO public.branches (title, description, title_si, description_si, is_coming_soon, order_index) VALUES
-- ('Siripura', 'Our branch located in Siripura.', 'සිරිපුර', 'අපේ ශාඛාව සිරිපුර හි පිහිටා ඇත.', false, 0),
-- ('Coming Soon...', '', 'ඉක්මනින්...', '', true, 1);

-- ============================================
-- SERVICES TABLE SETUP
-- ============================================

-- 1. Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  title_si TEXT,
  description_si TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. If table already exists but missing columns, add them
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS title_si TEXT;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS description_si TEXT;

-- 3. Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(order_index);

-- 4. Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access services" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated insert services" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated update services" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated delete services" ON public.services;

-- 6. Create policies for public read access
CREATE POLICY "Allow public read access services" ON public.services
  FOR SELECT
  USING (true);

-- 7. Create policies for public insert (change to authenticated in production)
CREATE POLICY "Allow authenticated insert services" ON public.services
  FOR INSERT
  WITH CHECK (true);

-- 8. Create policies for public update (change to authenticated in production)
CREATE POLICY "Allow authenticated update services" ON public.services
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 9. Create policies for public delete (change to authenticated in production)
CREATE POLICY "Allow authenticated delete services" ON public.services
  FOR DELETE
  USING (true);

-- 10. Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'services' AND table_schema = 'public';
