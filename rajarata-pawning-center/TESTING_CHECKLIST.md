# 🧪 Testing Checklist for Slider Management System

## Pre-Testing Setup
- [ ] Supabase SQL setup completed (`supabase-setup.sql`)
- [ ] Storage bucket `slider-images` created
- [ ] Storage bucket is set to **Public**
- [ ] Storage policies configured (3 policies: SELECT, INSERT, DELETE)
- [ ] `.env.local` has correct Supabase credentials
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)

---

## 1. ✅ Admin Panel - Access

### Test: Can access admin panel
- [ ] Navigate to `http://localhost:3000/admin`
- [ ] Page loads without errors
- [ ] UI displays correctly (dark theme)
- [ ] No console errors in browser

**Expected Result**: Admin panel loads with upload section and empty slider list

---

## 2. 📤 Admin Panel - Upload Image

### Test: Upload first image
- [ ] Click file input or drag image
- [ ] Select a valid image file (JPG/PNG/WEBP)
- [ ] File size < 5MB
- [ ] Upload progress shows
- [ ] Success message appears
- [ ] Image appears in the list below

**Expected Result**: Image uploads successfully and displays in grid

### Test: Upload validation
- [ ] Try uploading file > 5MB
- [ ] Try uploading non-image file (PDF, TXT, etc.)
- [ ] Appropriate error messages appear

**Expected Result**: Invalid files are rejected with clear error messages

### Test: Upload multiple images
- [ ] Upload 3-5 different images
- [ ] Each upload succeeds
- [ ] All images appear in order
- [ ] Each has correct order number (#1, #2, #3, etc.)

**Expected Result**: All images upload and display correctly

---

## 3. 🔄 Admin Panel - Reorder Sliders

### Test: Move slider up
- [ ] Click "Move Up" on second slider
- [ ] Slider moves to first position
- [ ] Order numbers update
- [ ] Success message appears

**Expected Result**: Slider position changes immediately

### Test: Move slider down
- [ ] Click "Move Down" on first slider
- [ ] Slider moves to second position
- [ ] Order numbers update
- [ ] Success message appears

**Expected Result**: Slider position changes immediately

### Test: Boundary conditions
- [ ] "Move Up" is disabled for first slider
- [ ] "Move Down" is disabled for last slider
- [ ] Buttons are greyed out when disabled

**Expected Result**: Boundary controls work correctly

---

## 4. 🗑️ Admin Panel - Delete Slider

### Test: Delete confirmation
- [ ] Click "Delete" button
- [ ] Confirmation dialog appears
- [ ] Click "Cancel" - nothing happens
- [ ] Click "Delete" again
- [ ] Click "OK" - slider deletes

**Expected Result**: Confirmation prevents accidental deletion

### Test: Delete functionality
- [ ] Delete a slider
- [ ] Success message appears
- [ ] Slider removed from list
- [ ] Remaining sliders reorder automatically

**Expected Result**: Slider deleted from both UI and database

### Test: Delete all sliders
- [ ] Delete all sliders one by one
- [ ] Empty state message appears: "No slider images yet..."

**Expected Result**: Clean empty state when no sliders exist

---

## 5. 🏠 Home Page - Display Sliders

### Test: View sliders on home page
- [ ] Navigate to `http://localhost:3000/home`
- [ ] Sliders load from database
- [ ] First slider displays immediately
- [ ] Loading spinner shows briefly (if slow connection)

**Expected Result**: Sliders display correctly on home page

### Test: Auto-rotation
- [ ] Wait 4 seconds
- [ ] Slider automatically transitions to next
- [ ] Smooth fade effect
- [ ] Continues rotating through all sliders
- [ ] Loops back to first slider

**Expected Result**: Auto-rotation works smoothly

### Test: Order matches admin panel
- [ ] Compare slider order with admin panel
- [ ] Order matches exactly
- [ ] After reordering in admin, refresh home page
- [ ] New order reflects correctly

**Expected Result**: Order is consistent between admin and home

---

## 6. 🔄 Real-time Updates

### Test: Immediate updates
- [ ] Open admin panel in one tab
- [ ] Open home page in another tab
- [ ] Upload image in admin
- [ ] Refresh home page
- [ ] New image appears

**Expected Result**: Changes in admin appear on home (after refresh)

---

## 7. 💾 Supabase Storage

### Test: Verify storage
- [ ] Go to Supabase Dashboard > Storage
- [ ] Open `slider-images` bucket
- [ ] Open `sliders` folder
- [ ] Uploaded images are present
- [ ] File names have format: `{random}-{timestamp}.{ext}`

**Expected Result**: All images stored in Supabase

### Test: Verify deletion
- [ ] Note a specific image filename
- [ ] Delete it from admin panel
- [ ] Check Supabase storage
- [ ] File is removed

**Expected Result**: Deleted images are removed from storage

---

## 8. 🗄️ Supabase Database

### Test: Verify database records
- [ ] Go to Supabase Dashboard > Table Editor
- [ ] Open `sliders` table
- [ ] Records match uploaded images
- [ ] `image_url` points to storage
- [ ] `order_index` is correct
- [ ] `created_at` timestamp is accurate

**Expected Result**: Database records match uploaded sliders

---

## 9. 🚨 Error Handling

### Test: Network error simulation
- [ ] Turn off internet/VPN
- [ ] Try to upload image
- [ ] Error message appears
- [ ] Turn on internet
- [ ] Try again - works

**Expected Result**: Graceful error handling with helpful messages

### Test: Invalid Supabase credentials
- [ ] Temporarily break `.env.local` credentials
- [ ] Restart dev server
- [ ] Admin panel shows connection error
- [ ] Restore credentials
- [ ] Works again

**Expected Result**: Clear error messages for configuration issues

---

## 10. 📱 Responsive Design

### Test: Mobile view (admin)
- [ ] Open admin panel
- [ ] Resize browser to mobile width (375px)
- [ ] All buttons visible and clickable
- [ ] File upload works
- [ ] Grid switches to single column

**Expected Result**: Fully functional on mobile

### Test: Mobile view (home)
- [ ] Open home page
- [ ] Resize to mobile width
- [ ] Sliders display correctly
- [ ] Auto-rotation works
- [ ] No horizontal scroll

**Expected Result**: Responsive on all screen sizes

---

## 11. 🌐 Language Toggle

### Test: Language switching
- [ ] On admin panel, click "English" button
- [ ] Button highlights
- [ ] Click "සිංහල" button
- [ ] Button highlights
- [ ] Toggle between languages

**Expected Result**: Language toggle buttons work (UI labels only)

---

## 12. 🔍 Browser Console

### Test: No errors
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Navigate through admin panel
- [ ] Upload, delete, reorder
- [ ] Check for errors or warnings
- [ ] No critical errors present

**Expected Result**: Clean console with no errors

---

## 13. ⚡ Performance

### Test: Load time
- [ ] Clear browser cache
- [ ] Reload admin panel
- [ ] Page loads in < 2 seconds
- [ ] Reload home page
- [ ] Sliders appear quickly

**Expected Result**: Fast loading times

### Test: Upload speed
- [ ] Upload 2MB image
- [ ] Completes in < 5 seconds
- [ ] Progress indicator shows

**Expected Result**: Reasonable upload speeds

---

## 14. 🎨 UI/UX

### Test: Visual consistency
- [ ] Admin panel matches site theme
- [ ] Colors consistent (dark brown/amber theme)
- [ ] Buttons have hover effects
- [ ] Smooth transitions
- [ ] Readable text
- [ ] Proper spacing

**Expected Result**: Professional, polished appearance

---

## 15. 🔐 Security (Optional)

### Test: Public access
- [ ] Admin panel currently accessible to anyone
- [ ] Home page publicly viewable
- [ ] Consider adding authentication

**Note**: For production, implement authentication using `useAuth` hook

---

## Test Results Summary

| Test Category | Pass | Fail | Notes |
|--------------|------|------|-------|
| Admin Access | [ ] | [ ] | |
| Upload | [ ] | [ ] | |
| Reorder | [ ] | [ ] | |
| Delete | [ ] | [ ] | |
| Home Display | [ ] | [ ] | |
| Real-time | [ ] | [ ] | |
| Storage | [ ] | [ ] | |
| Database | [ ] | [ ] | |
| Errors | [ ] | [ ] | |
| Responsive | [ ] | [ ] | |
| Language | [ ] | [ ] | |
| Console | [ ] | [ ] | |
| Performance | [ ] | [ ] | |
| UI/UX | [ ] | [ ] | |

---

## 🐛 Common Issues & Solutions

### Issue: Images not loading
**Solution**: 
1. Check bucket is public
2. Verify storage policies
3. Check browser console for CORS errors

### Issue: Upload fails
**Solution**:
1. Verify bucket exists: `slider-images`
2. Check file size < 5MB
3. Verify `.env.local` credentials

### Issue: Can't delete
**Solution**:
1. Check delete policy in Supabase
2. Verify RLS is enabled
3. Check console for errors

### Issue: Order not updating
**Solution**:
1. Refresh the page
2. Check database update query
3. Verify `order_index` field exists

---

## ✅ Sign-off

- [ ] All tests passed
- [ ] No critical errors
- [ ] Performance acceptable
- [ ] UI looks professional
- [ ] Ready for production (with auth)

**Tester**: _________________
**Date**: _________________
**Notes**: _________________

---

**Status**: 🎉 System Ready for Use!
