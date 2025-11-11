# Slider Management System - Setup Guide

This guide will help you set up the backend for managing slider images using Supabase.

## 📋 Prerequisites

- Supabase account and project created
- Node.js and npm installed
- Your Supabase credentials in `.env.local` (already configured)

## 🚀 Setup Instructions

### Step 1: Run SQL Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **"New query"**
5. Copy the contents of `supabase-setup.sql` and paste it into the editor
6. Click **"Run"** to execute the SQL

### Step 2: Create Storage Bucket

1. In your Supabase Dashboard, navigate to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Create a bucket with these settings:
   - **Name**: `slider-images`
   - **Public bucket**: ✅ Enable (so images can be accessed publicly)
   - Click **"Create bucket"**

### Step 3: Set Storage Policies

1. Click on the `slider-images` bucket
2. Go to the **Policies** tab
3. Add the following policies:

#### Policy 1: Public Read Access
- Click **"New Policy"**
- Select **"For full customization"**
- Policy name: `Public Access`
- Allowed operation: **SELECT**
- Policy definition: `true`
- Click **"Review"** then **"Save policy"**

#### Policy 2: Public Upload Access
- Click **"New Policy"**
- Policy name: `Allow uploads`
- Allowed operation: **INSERT**
- Policy definition: `true`
- Click **"Review"** then **"Save policy"**

#### Policy 3: Public Delete Access
- Click **"New Policy"**
- Policy name: `Allow deletes`
- Allowed operation: **DELETE**
- Policy definition: `true`
- Click **"Review"** then **"Save policy"**

### Step 4: Install Dependencies (if not already installed)

```bash
npm install
```

### Step 5: Run the Development Server

```bash
npm run dev
```

## 🎯 Usage

### Accessing the Admin Panel

Navigate to: `http://localhost:3000/admin`

### Admin Panel Features

1. **Upload Images**
   - Click the file input to select an image
   - Supported formats: JPG, PNG, GIF, WEBP
   - Maximum file size: 5MB
   - Images are automatically uploaded to Supabase Storage

2. **View All Sliders**
   - See all uploaded slider images
   - View them in order
   - See upload date for each image

3. **Reorder Sliders**
   - Use "Move Up" button to move a slider up in the order
   - Use "Move Down" button to move a slider down
   - Order is reflected immediately on the home page

4. **Delete Sliders**
   - Click "Delete" button on any slider
   - Confirm the deletion
   - Image is removed from both database and storage

### Home Page Slider

Navigate to: `http://localhost:3000/home`

- The slider automatically fetches images from Supabase
- If no images are in the database, it falls back to static images
- Auto-rotates every 4 seconds
- Smooth fade transitions between slides

## 📁 File Structure

```
src/
├── lib/
│   ├── supabase.ts           # Supabase client configuration
│   └── sliderService.ts      # Service for slider CRUD operations
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin panel UI
│   ├── api/
│   │   └── sliders/
│   │       └── route.ts      # API endpoints (optional)
│   └── home/
│       └── page.tsx          # Home page with slider (updated)
└── ...
```

## 🔧 API Endpoints (Optional)

If you prefer using API routes instead of direct client calls:

### GET `/api/sliders`
Fetch all sliders

### POST `/api/sliders`
Upload a new slider image
- Body: FormData with `file` field

### DELETE `/api/sliders?id={id}&imageUrl={url}`
Delete a slider

## 🎨 Customization

### Slider Timing
Edit `src/app/home/page.tsx` line ~33:
```typescript
}, 4000) // Change interval in milliseconds
```

### Image Size Limit
Edit `src/app/admin/page.tsx` line ~45:
```typescript
if (file.size > 5 * 1024 * 1024) // Change limit (currently 5MB)
```

### Styling
Both pages use Tailwind CSS. Modify the className attributes to change the appearance.

## 🔒 Security Recommendations

### For Production:

1. **Restrict Upload Access**
   - Update Supabase policies to require authentication
   - Add authentication to the admin panel
   
2. **Add Authentication**
   ```typescript
   // Example: Add auth check in admin page
   import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
   
   // Check if user is authenticated
   const supabase = createServerComponentClient({ cookies })
   const { data: { session } } = await supabase.auth.getSession()
   if (!session) {
     redirect('/login')
   }
   ```

3. **Update RLS Policies**
   ```sql
   -- Instead of allowing all, check for authenticated users
   CREATE POLICY "Authenticated users can insert" ON public.sliders
     FOR INSERT
     WITH CHECK (auth.role() = 'authenticated');
   ```

## 🐛 Troubleshooting

### Images not showing?
- Check Supabase Storage bucket is public
- Verify storage policies are set correctly
- Check browser console for errors

### Upload failing?
- Verify file size is under 5MB
- Check file format is supported
- Ensure storage bucket exists and is named `slider-images`

### Database errors?
- Verify SQL setup was run successfully
- Check RLS policies are enabled
- Ensure `.env.local` has correct credentials

## 📝 Database Schema

```sql
sliders (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## 🎉 Done!

Your slider management system is now ready to use. Visit the admin panel to start uploading images!

For questions or issues, check the Supabase documentation: https://supabase.com/docs
