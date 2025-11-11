# 🔧 STORAGE BUCKET SETUP - Fix Upload Error

## Problem: Images not uploading to Supabase Storage

Follow these steps exactly:

---

## Step 1: Create Storage Bucket

1. Go to: https://supabase.com/dashboard/project/skpoeyztvhuyezgxjchx/storage/buckets
2. Click **"New bucket"** button
3. Fill in:
   - **Name**: `slider-images` (must be exact!)
   - **Public bucket**: ✅ **CHECK THIS BOX** (Important!)
   - **File size limit**: 50 MB (or leave default)
   - **Allowed MIME types**: Leave empty (allow all)
4. Click **"Create bucket"**

---

## Step 2: Set Storage Policies

### Option A: Using UI (Easier)

1. Click on the **`slider-images`** bucket
2. Click **"Policies"** tab at the top
3. Click **"New policy"** button

#### Policy 1: Allow Public Upload
- Click **"For full customization"**
- **Policy name**: `Allow public uploads`
- **Allowed operation**: `INSERT`
- **Target roles**: `public`
- **USING expression**: `true`
- **WITH CHECK expression**: `true`
- Click **"Review"** then **"Save policy"**

#### Policy 2: Allow Public Read
- Click **"New policy"** again
- **Policy name**: `Allow public read`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `true`
- Click **"Review"** then **"Save policy"**

#### Policy 3: Allow Public Delete
- Click **"New policy"** again
- **Policy name**: `Allow public delete`
- **Allowed operation**: `DELETE`
- **Target roles**: `public`
- **USING expression**: `true`
- Click **"Review"** then **"Save policy"**

### Option B: Using SQL (Faster)

1. Go to: https://supabase.com/dashboard/project/skpoeyztvhuyezgxjchx/sql/new
2. Paste this SQL:

```sql
-- Create storage policies for slider-images bucket
-- Allow public to insert (upload)
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'slider-images');

-- Allow public to select (view/download)
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'slider-images');

-- Allow public to delete
CREATE POLICY "Allow public delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'slider-images');

-- Allow public to update
CREATE POLICY "Allow public update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'slider-images')
WITH CHECK (bucket_id = 'slider-images');
```

3. Click **"RUN"**

---

## Step 3: Verify Bucket Settings

1. Go back to Storage: https://supabase.com/dashboard/project/skpoeyztvhuyezgxjchx/storage/buckets
2. Click on **`slider-images`**
3. Verify:
   - ✅ Bucket is **Public**
   - ✅ Has **4 policies** (INSERT, SELECT, DELETE, UPDATE)

---

## Step 4: Test Upload

1. Go to your app: http://localhost:3000/admin/slider
2. Try uploading an image
3. Should work now! ✅

---

## Common Issues & Solutions

### Issue: "Bucket not found"
**Solution**: Make sure bucket name is exactly `slider-images` (with hyphen, not underscore)

### Issue: "Permission denied"
**Solution**: Make sure:
- Bucket is set to **Public**
- All 4 storage policies are created
- Policies target role is `public`

### Issue: "File already exists"
**Solution**: The code generates unique filenames, but if it persists, check the `sliderService.ts` file

### Issue: Database insert fails after upload
**Solution**: Make sure you ran the database setup SQL:
```sql
ALTER TABLE public.sliders 
ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;
```

---

## Quick Verification Checklist

- [ ] Storage bucket `slider-images` created
- [ ] Bucket is set to **Public**
- [ ] Policy: Allow public uploads (INSERT)
- [ ] Policy: Allow public read (SELECT)
- [ ] Policy: Allow public delete (DELETE)
- [ ] Policy: Allow public update (UPDATE)
- [ ] Database table has `order_index` column
- [ ] `.env.local` has correct Supabase credentials
- [ ] Dev server is running (`npm run dev`)

---

## If Still Not Working

Check browser console (F12) for specific error message and:

1. **"new row violates row-level security policy"**
   - Run the storage policies SQL again
   - Make sure bucket is public

2. **"Bucket not found"**
   - Double-check bucket name spelling
   - Create bucket if missing

3. **"order_index column not found"**
   - Run database setup SQL
   - Refresh page

4. **Network error**
   - Check `.env.local` credentials
   - Verify Supabase project is active

---

**After completing these steps, your upload should work perfectly!** ✅
