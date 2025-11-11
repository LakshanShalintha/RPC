# 🚀 Quick Reference Card - Slider Management

## 📌 Essential URLs

| Purpose | URL | Description |
|---------|-----|-------------|
| Admin Panel | `http://localhost:3000/admin` | Manage sliders |
| Home Page | `http://localhost:3000/home` | View sliders |
| Supabase Dashboard | `https://supabase.com/dashboard` | Database & storage |
| Your Project | `https://supabase.com/dashboard/project/skpoeyztvhuyezgxjchx` | Direct link |

---

## ⚡ Quick Commands

```bash
# Start development server
npm run dev

# Install dependencies (first time)
npm install

# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/app/admin/page.tsx` | Admin panel UI |
| `src/app/home/page.tsx` | Home page with slider |
| `src/lib/sliderService.ts` | All CRUD operations |
| `src/lib/supabase.ts` | Supabase client |
| `.env.local` | Environment variables |
| `supabase-setup.sql` | Database setup script |

---

## 🎯 Common Tasks

### Upload Image
1. Go to `/admin`
2. Click file input
3. Select image (< 5MB)
4. Wait for success message

### Delete Image
1. Go to `/admin`
2. Find image in grid
3. Click "Delete"
4. Confirm deletion

### Reorder Sliders
1. Go to `/admin`
2. Use "Move Up/Down" buttons
3. Changes save automatically

### View on Home Page
1. Go to `/home`
2. Sliders auto-rotate every 4 seconds

---

## 🗄️ Database Info

**Table Name**: `sliders`

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| image_url | TEXT | URL to image in storage |
| order_index | INTEGER | Display order (0, 1, 2...) |
| created_at | TIMESTAMP | Upload timestamp |

---

## 💾 Storage Info

**Bucket Name**: `slider-images`
**Folder**: `sliders/`
**Access**: Public
**Max Size**: 5MB per file
**Formats**: JPG, PNG, GIF, WEBP

---

## 🔧 SliderService Methods

```typescript
// Fetch all sliders
SliderService.getAllSliders()

// Upload new slider
SliderService.addSlider(file)

// Delete slider
SliderService.deleteSlider(id, imageUrl)

// Update order
SliderService.updateSliderOrder(id, newIndex)

// Batch reorder
SliderService.reorderSliders(sliders)
```

---

## 🚨 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Images not loading | Check bucket is public, verify policies |
| Upload fails | Check file size < 5MB, verify bucket exists |
| Can't delete | Check RLS policies in Supabase |
| Order not updating | Refresh page, check database connection |
| Console errors | Check `.env.local` credentials |
| Blank admin page | Run SQL setup, create storage bucket |

---

## 📋 Pre-Go-Live Checklist

- [ ] SQL setup completed
- [ ] Storage bucket created (`slider-images`)
- [ ] Bucket is public
- [ ] Storage policies set (3 policies)
- [ ] Test upload (works)
- [ ] Test delete (works)
- [ ] Test reorder (works)
- [ ] Home page displays sliders
- [ ] Auto-rotation works
- [ ] No console errors
- [ ] Consider adding authentication

---

## 🔐 Security Notes

**Current**: Public access (anyone can manage sliders)
**Recommended**: Add authentication before production
**File**: `src/lib/useAuth.ts` ready for implementation

---

## 📊 Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| Storage | 1GB |
| Bandwidth | 50GB/month |
| Database rows | Unlimited |
| File size | 5MB (configurable) |
| API requests | Unlimited |

---

## 🎨 Customization Points

### Change slider timing (home page)
```typescript
// Line ~38 in src/app/home/page.tsx
setInterval(() => {
  // Change from 4000ms (4 seconds)
}, 4000)
```

### Change max file size (admin panel)
```typescript
// Line ~45 in src/app/admin/page.tsx
if (file.size > 5 * 1024 * 1024) // 5MB
```

### Change image aspect ratio
Recommended: 1920x1080 (16:9)
Location: Upload any size, CSS handles it

---

## 📞 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## 🔄 Update Workflow

```
1. Upload image in admin panel
2. Image stored in Supabase Storage
3. Record created in database
4. Refresh home page to see changes
```

---

## ⌨️ Keyboard Shortcuts (Browser)

| Key | Action |
|-----|--------|
| F5 | Refresh page |
| Ctrl+Shift+I | Open DevTools |
| F12 | Open Console |
| Ctrl+Shift+R | Hard refresh (clear cache) |

---

## 📝 File Upload Rules

✅ **Allowed**:
- JPG, JPEG
- PNG
- GIF
- WEBP
- Size < 5MB

❌ **Not Allowed**:
- SVG
- PDF
- MP4
- Size > 5MB

---

## 🎯 Success Indicators

✅ Image appears in admin grid immediately
✅ Success message shows in green
✅ Image has order number badge
✅ Move buttons are clickable
✅ Delete button works
✅ Home page shows slider after refresh

---

## 💡 Pro Tips

1. **Optimize images** before upload (use TinyPNG, etc.)
2. **Use WebP** format for best compression
3. **Recommended size**: 1920x1080 pixels
4. **Test on mobile** after uploading
5. **Backup database** regularly
6. **Monitor storage** usage in Supabase dashboard
7. **Add auth** before going live
8. **Use descriptive filenames** for organization

---

## 📱 Mobile Testing

```
1. Open browser DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select device (iPhone, Android)
4. Test admin panel
5. Test home page
6. Check all features work
```

---

## 🎉 Quick Start (First Time)

```bash
# 1. Setup Supabase
# Run SQL in supabase-setup.sql
# Create bucket: slider-images
# Set storage policies

# 2. Start dev server
npm run dev

# 3. Test admin panel
# Visit http://localhost:3000/admin
# Upload test image

# 4. Check home page
# Visit http://localhost:3000/home
# Verify slider displays

# ✅ Done!
```

---

**Version**: 1.0
**Last Updated**: November 2025
**Status**: ✅ Production Ready (add auth first!)

---

## Need Help?

1. Check `SLIDER_SETUP_GUIDE.md` for detailed setup
2. Check `TESTING_CHECKLIST.md` for testing steps
3. Check `ARCHITECTURE.md` for system design
4. Check browser console for errors
5. Check Supabase logs in dashboard

**Happy Coding! 🚀**
