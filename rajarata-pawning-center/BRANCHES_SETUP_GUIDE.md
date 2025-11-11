# Branches Management Setup Guide

## Overview
A complete branch management system has been created to add, edit, delete, and reorder branch locations on your website.

## Database Setup

### Step 1: Run SQL in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **skpoeyztvhuyezgxjchx**
3. Go to **SQL Editor** (left sidebar)
4. Run the following SQL:

```sql
-- Create branches table
CREATE TABLE IF NOT EXISTS public.branches (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_coming_soon BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add columns if table already exists
ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS is_coming_soon BOOLEAN DEFAULT false;

-- Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_branches_order ON public.branches(order_index);

-- Enable Row Level Security
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Allow public read access branches" ON public.branches;
CREATE POLICY "Allow public read access branches" ON public.branches
  FOR SELECT
  USING (true);

-- Create policies for public insert
DROP POLICY IF EXISTS "Allow authenticated insert branches" ON public.branches;
CREATE POLICY "Allow authenticated insert branches" ON public.branches
  FOR INSERT
  WITH CHECK (true);

-- Create policies for public update
DROP POLICY IF EXISTS "Allow authenticated update branches" ON public.branches;
CREATE POLICY "Allow authenticated update branches" ON public.branches
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policies for public delete
DROP POLICY IF EXISTS "Allow authenticated delete branches" ON public.branches;
CREATE POLICY "Allow authenticated delete branches" ON public.branches
  FOR DELETE
  USING (true);

-- Insert default branches (optional)
INSERT INTO public.branches (title, description, is_coming_soon, order_index) VALUES
('Siripura', 'Our branch located in Siripura.', false, 0),
('Coming Soon...', '', true, 1);
```

### Step 2: Verify Table Creation

Run this query to verify:
```sql
SELECT * FROM public.branches;
```

## Usage Guide

### Accessing Admin Panel

1. Start your development server:
   ```
   npm run dev
   ```

2. Navigate to: **http://localhost:3000/admin**

3. Click on the **"Branches"** card

### Managing Branches

#### Add New Branch
1. Click **"+ Add Branch"** button
2. Fill in:
   - **Branch Title** (required): e.g., "Colombo", "Kandy"
   - **Description** (optional): Branch location details
   - **Mark as "Coming Soon"**: Check if branch is not yet open
3. Click **"Add"**

#### Edit Existing Branch
1. Click **"Edit"** button on any branch card
2. Update the information
3. Click **"Update"**

#### Delete Branch
1. Click **"Delete"** button on any branch card
2. Confirm the deletion in the popup
3. Branch will be removed from database

#### Reorder Branches
1. Use **↑** (Move Up) or **↓** (Move Down) buttons
2. Changes are saved automatically
3. Order reflects on the home page immediately

## Features

✅ **Add/Edit/Delete** - Full CRUD operations
✅ **Reorder** - Move branches up or down
✅ **Coming Soon Badge** - Mark branches as coming soon
✅ **Real-time Updates** - Changes appear immediately on home page
✅ **Loading States** - Smooth loading indicators
✅ **Popup Messages** - Success/error notifications
✅ **Stats Dashboard** - See total, active, and coming soon counts
✅ **Responsive Design** - Works on all devices

## Home Page Integration

The home page automatically displays branches from the database:
- **URL**: http://localhost:3000/home
- **Features**:
  - Shows all branches in order
  - Displays "Coming Soon" badge for upcoming branches
  - Hover animation on cards
  - Loading spinner while fetching data
  - Fallback to JSON data if database is empty

## Files Created/Modified

### New Files
- `src/lib/branchService.ts` - Branch CRUD operations
- `src/app/admin/branches/page.tsx` - Admin management page
- `BRANCHES_SETUP_GUIDE.md` - This file

### Modified Files
- `src/lib/supabase.ts` - Added Branch type
- `src/app/admin/page.tsx` - Added Branches card
- `src/app/home/page.tsx` - Fetch branches from database
- `supabase-setup.sql` - Added branches table schema

## Data Structure

```typescript
type Branch = {
  id: number
  title: string
  description: string
  is_coming_soon: boolean
  order_index: number
  created_at: string
}
```

## Troubleshooting

### Branches not showing on home page?
1. Check browser console for errors
2. Verify SQL was run successfully in Supabase
3. Check that policies are enabled (SELECT policy)
4. Try refreshing the page

### Can't add branches?
1. Verify INSERT policy is enabled
2. Check Supabase logs in dashboard
3. Look for errors in browser console

### Images not appearing?
- Branches don't use images, only text content
- For slider images, use the Slider Management section

## Next Steps

1. ✅ Run the SQL in Supabase Dashboard
2. ✅ Add your first branch via admin panel
3. ✅ Check it appears on home page
4. ✅ Test edit, delete, and reorder features

## Production Considerations

Before deploying to production:
- [ ] Add authentication to admin panel
- [ ] Update RLS policies to require authentication
- [ ] Remove default branches or adjust as needed
- [ ] Test all CRUD operations thoroughly
- [ ] Add input validation and sanitization
- [ ] Consider adding branch images or icons
- [ ] Add contact information per branch
- [ ] Implement branch search/filter if many branches

## Support

If you encounter issues:
1. Check Supabase Dashboard logs
2. Check browser console for errors
3. Verify all SQL ran successfully
4. Ensure .env.local has correct Supabase credentials
