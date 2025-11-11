# Supabase Setup Instructions for Slider Images

## 1. Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `skpoeyztvhuyezgxjchx`
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Create a bucket with these settings:
   - **Name**: `slider-images`
   - **Public bucket**: ✅ Enable (so images can be accessed publicly)
   - Click **"Create bucket"**

## 2. Create Database Table

1. Navigate to **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Paste and run this SQL:

```sql
-- Create sliders table
CREATE TABLE IF NOT EXISTS public.sliders (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.sliders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.sliders
  FOR SELECT
  USING (true);

-- Create policy to allow public insert (you may want to restrict this later)
CREATE POLICY "Allow public insert" ON public.sliders
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public delete (you may want to restrict this later)
CREATE POLICY "Allow public delete" ON public.sliders
  FOR DELETE
  USING (true);
```

4. Click **"Run"**

## 3. Set Storage Policies

1. Go back to **Storage** → **Policies**
2. For the `slider-images` bucket, create these policies:

### Policy 1: Allow public read
- **Policy name**: "Public read access"
- **Allowed operation**: SELECT
- **Policy definition**: `true`

### Policy 2: Allow public upload
- **Policy name**: "Public upload access"
- **Allowed operation**: INSERT
- **Policy definition**: `true`

### Policy 3: Allow public delete
- **Policy name**: "Public delete access"
- **Allowed operation**: DELETE
- **Policy definition**: `true`

## 4. Test the Setup

1. Save all changes in Supabase
2. Restart your Next.js development server:
   ```bash
   npm run dev
   ```
3. Go to `localhost:3000/admin/sliders`
4. Try uploading an image

## Security Note

⚠️ The policies above allow public access for testing. For production, you should:
- Implement authentication
- Restrict upload/delete operations to authenticated admin users only
- Update the policies to check for user roles
