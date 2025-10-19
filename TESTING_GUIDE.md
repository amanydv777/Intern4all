# 🧪 Complete Testing Guide - Intern4All Platform

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies (if needed)
cd ..
npm install
```

### Step 2: Seed Database
```bash
cd backend
node seeder.js -d  # Delete existing data
node seeder.js -i  # Import fresh data
```

### Step 3: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should see: 🚀 Server running in development mode on port 5000

# Terminal 2 - Frontend (new terminal)
npm start
# Should open: http://localhost:3000
```

---

## 👥 Test Accounts

### Intern Account
- **Email:** aman@example.com
- **Password:** password
- **Use for:** Profile completion, search, applications

### Recruiter Account
- **Email:** recruiter@example.com
- **Password:** password123
- **Use for:** Post internships, view applications

---

## ✅ Feature Testing Checklist

### 1. Authentication (No Google OAuth)

#### Test Login
- [ ] Open http://localhost:3000
- [ ] Verify NO "Continue with Google" button
- [ ] Enter: aman@example.com / password
- [ ] Click "Sign In"
- [ ] Should redirect to dashboard
- [ ] ✅ **Pass:** Login works without Google OAuth

#### Test Signup
- [ ] Click "Need an account? Sign up"
- [ ] Verify NO "Continue with Google" button
- [ ] Fill in name, email, password
- [ ] Select role (Intern/Recruiter)
- [ ] Click "Sign Up"
- [ ] Should redirect to profile completion (intern) or dashboard (recruiter)
- [ ] ✅ **Pass:** Signup works without Google OAuth

#### Test Forgot Password
- [ ] Click "Forgot password?"
- [ ] Enter email: aman@example.com
- [ ] Check browser console for reset URL
- [ ] Copy reset token from console
- [ ] Navigate to reset page
- [ ] Enter new password twice
- [ ] Click "Reset Password"
- [ ] Login with new password
- [ ] ✅ **Pass:** Password reset works

---

### 2. Enhanced Profile Completion (4 Steps)

#### Step 1: Basic Info (Enhanced)
- [ ] Login as intern: aman@example.com / password
- [ ] Should see 4-step stepper (not 3)
- [ ] Fill in Phone: +91 9876543210
- [ ] Select Location: Delhi
- [ ] Select Education: Undergraduate
- [ ] Enter Study Field: Computer Science
- [ ] **NEW:** Enter University: IIT Delhi
- [ ] **NEW:** Enter GitHub: https://github.com/username
- [ ] **NEW:** Enter LinkedIn: https://linkedin.com/in/username
- [ ] Click "Next →"
- [ ] ✅ **Pass:** All 7 fields save correctly

#### Test Validation
- [ ] Try invalid GitHub URL (without github.com)
- [ ] Should show error: "Please enter a valid GitHub URL"
- [ ] Try invalid LinkedIn URL (without linkedin.com)
- [ ] Should show error: "Please enter a valid LinkedIn URL"
- [ ] ✅ **Pass:** URL validation works

#### Step 2: Skills & Interests
- [ ] Add skills by typing and pressing Enter
- [ ] Click popular skills to add
- [ ] Remove skills by clicking X
- [ ] Select at least one sector
- [ ] Click "Next →"
- [ ] ✅ **Pass:** Skills save correctly

#### Step 3: Resume Upload (NEW)
- [ ] Should see "Resume Upload" as step 3
- [ ] Click "Choose File"
- [ ] Select a PDF file < 300KB
- [ ] Should show filename and size
- [ ] Click "Upload & Continue →"
- [ ] Should see "Resume uploaded successfully!"
- [ ] Should auto-proceed to step 4 after 1.5s
- [ ] ✅ **Pass:** Resume uploads successfully

#### Test Resume Validation
- [ ] Try uploading non-PDF file
- [ ] Should show error: "Please upload a PDF file only"
- [ ] Try uploading PDF > 300KB
- [ ] Should show error: "File size must not exceed 300KB"
- [ ] ✅ **Pass:** File validation works

#### Test Skip Option
- [ ] Click "Skip for Now"
- [ ] Should proceed to step 4 without uploading
- [ ] ✅ **Pass:** Skip works

#### Step 4: Preferences
- [ ] Select preferred location
- [ ] Select availability
- [ ] Click "Complete Profile"
- [ ] Should redirect to dashboard
- [ ] Profile should be marked complete
- [ ] ✅ **Pass:** Profile completion works

---

### 3. Advanced Internship Search

#### Test Basic Search
- [ ] Go to "Find Internships"
- [ ] Type in search bar: "developer"
- [ ] Click "Search"
- [ ] Should show filtered results
- [ ] ✅ **Pass:** Text search works

#### Test Filters Panel
- [ ] Click "Filters" button
- [ ] Should expand filter panel
- [ ] Should show 4 filter groups:
  - Stipend Range
  - Location Type
  - Duration
  - (Skills - if implemented)
- [ ] ✅ **Pass:** Filter panel displays

#### Test Stipend Filter
- [ ] Enter Min: 5000
- [ ] Enter Max: 20000
- [ ] Click "Search"
- [ ] Should show internships in that range
- [ ] ✅ **Pass:** Stipend filter works

#### Test Location Type Filter
- [ ] Check "Remote"
- [ ] Check "Hybrid"
- [ ] Click "Search"
- [ ] Should show only Remote and Hybrid internships
- [ ] ✅ **Pass:** Location filter works

#### Test Duration Filter
- [ ] Select "3 months"
- [ ] Click "Search"
- [ ] Should show 3-month internships
- [ ] ✅ **Pass:** Duration filter works

#### Test Multiple Filters
- [ ] Set search: "developer"
- [ ] Set stipend: 10000-30000
- [ ] Check "Remote"
- [ ] Select duration: "6 months"
- [ ] Click "Search"
- [ ] Should show results matching ALL filters
- [ ] ✅ **Pass:** Multiple filters work together

#### Test Filter Count
- [ ] Apply 3 filters
- [ ] Filter button should show "Filters (3)"
- [ ] ✅ **Pass:** Filter count displays

#### Test Clear Filters
- [ ] Click "Clear All"
- [ ] All filters should reset
- [ ] Should show all internships
- [ ] ✅ **Pass:** Clear filters works

#### Test View Details
- [ ] Click "View Details" on any internship
- [ ] Should navigate to detail page
- [ ] Should show full information
- [ ] Click "Apply Now"
- [ ] Should submit application
- [ ] ✅ **Pass:** Detail page works

---

### 4. Resume Upload System

#### Test Upload Endpoint
- [ ] Complete profile to step 3
- [ ] Upload a valid PDF
- [ ] Check browser Network tab
- [ ] Should POST to: /api/upload/resume
- [ ] Should return 200 status
- [ ] Should return success: true
- [ ] ✅ **Pass:** Upload endpoint works

#### Test File Storage
- [ ] After upload, check backend folder
- [ ] Navigate to: backend/uploads/resumes/
- [ ] Should see file: resume_[userId]_[timestamp].pdf
- [ ] ✅ **Pass:** File stored correctly

#### Test Database Update
- [ ] After upload, check user profile
- [ ] User.profile.resumePath should be set
- [ ] Should be: /uploads/resumes/[filename]
- [ ] ✅ **Pass:** Database updated

---

### 5. Styling & Responsiveness

#### Test Profile Completion Styling
- [ ] Check stepper design
  - [ ] Numbers in circles
  - [ ] Active step highlighted in blue
  - [ ] Completed steps in green
  - [ ] Line connecting steps
- [ ] Check form styling
  - [ ] Consistent input borders
  - [ ] Proper padding and spacing
  - [ ] Labels bold and clear
  - [ ] Error messages in red
- [ ] Check buttons
  - [ ] "Back" button white with border
  - [ ] "Next" button blue
  - [ ] Hover effects work
  - [ ] Disabled state visible
- [ ] ✅ **Pass:** Profile styling professional

#### Test Post Internship Form Styling
- [ ] Login as recruiter
- [ ] Click "Post Internship"
- [ ] Check form design:
  - [ ] White card with shadow
  - [ ] Section headers with borders
  - [ ] Two-column grid layout
  - [ ] Consistent input styling
  - [ ] Proper spacing
- [ ] ✅ **Pass:** Form styling consistent

#### Test Search Filter Styling
- [ ] Go to "Find Internships"
- [ ] Check search bar:
  - [ ] Search icon visible
  - [ ] Proper padding
  - [ ] Focus state works
- [ ] Open filters panel:
  - [ ] Clean white panel
  - [ ] Grid layout
  - [ ] Checkbox styling
  - [ ] Proper spacing
- [ ] ✅ **Pass:** Filter styling clean

#### Test Mobile Responsiveness
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Select iPhone 12 Pro (390px)
- [ ] Test profile completion:
  - [ ] Single column layout
  - [ ] Full-width buttons
  - [ ] Stepper readable
  - [ ] Forms usable
- [ ] Test search filters:
  - [ ] Stacked layout
  - [ ] Full-width inputs
  - [ ] Buttons full-width
- [ ] Test internship cards:
  - [ ] Single column
  - [ ] Readable text
  - [ ] Clickable areas large
- [ ] ✅ **Pass:** Mobile responsive

---

### 6. Error Handling

#### Test Network Errors
- [ ] Stop backend server
- [ ] Try to login
- [ ] Should show error message
- [ ] Try to upload resume
- [ ] Should show error message
- [ ] ✅ **Pass:** Network errors handled

#### Test Validation Errors
- [ ] Try to submit empty form
- [ ] Should show validation errors
- [ ] Try invalid file type
- [ ] Should show file error
- [ ] ✅ **Pass:** Validation works

#### Test Loading States
- [ ] Submit any form
- [ ] Button should show "Loading..." or "Uploading..."
- [ ] Button should be disabled
- [ ] ✅ **Pass:** Loading states work

---

### 7. Backend API Testing

#### Test Upload Endpoint Directly
```bash
# Get auth token first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aman@example.com","password":"password"}'

# Copy token from response

# Test upload (replace [TOKEN] and [FILE_PATH])
curl -X POST http://localhost:5000/api/upload/resume \
  -H "Authorization: Bearer [TOKEN]" \
  -F "resume=@[FILE_PATH]"
```
- [ ] Should return 200 status
- [ ] Should return success: true
- [ ] ✅ **Pass:** API endpoint works

#### Test Search Filters
```bash
# Test with filters
curl "http://localhost:5000/api/internships?search=developer&minStipend=10000&locationType=Remote"
```
- [ ] Should return filtered results
- [ ] ✅ **Pass:** Filter API works

---

## 🎯 Success Criteria

### All Tests Pass When:
- [x] Login works without Google OAuth
- [x] Signup works without Google OAuth
- [x] Profile has 4 steps (not 3)
- [x] University, GitHub, LinkedIn fields present
- [x] Resume upload validates file type
- [x] Resume upload validates file size
- [x] Resume uploads successfully
- [x] Advanced search filters work
- [x] Multiple filters work together
- [x] Styling is professional
- [x] Mobile responsive on all pages
- [x] No console errors
- [x] Loading states work
- [x] Error messages display

---

## 🐛 Common Issues & Solutions

### Issue: "Route not found" on resume upload
**Solution:** 
- Check backend server is running
- Verify route in `backend/routes/upload.js`
- Check `backend/server.js` has upload routes mounted
- Install express-fileupload: `npm install express-fileupload`

### Issue: File upload fails
**Solution:**
- Check file is PDF
- Check file size < 300KB
- Check Authorization header is set
- Check uploads folder exists

### Issue: Filters don't work
**Solution:**
- Check backend internship controller has filter logic
- Check query parameters are being sent
- Check network tab for API call

### Issue: Styling looks broken
**Solution:**
- Clear browser cache (Ctrl+Shift+R)
- Check App.css is loaded
- Check no CSS conflicts

### Issue: Mobile view broken
**Solution:**
- Check viewport meta tag in index.html
- Check media queries in CSS
- Test with actual device or DevTools

---

## 📊 Performance Checklist

- [ ] Page loads in < 2 seconds
- [ ] Search results load in < 1 second
- [ ] File upload completes in < 3 seconds
- [ ] No memory leaks (check DevTools Memory)
- [ ] No console errors
- [ ] No console warnings (except dev warnings)

---

## 🎉 Final Verification

### Complete Flow Test (15 minutes)

1. **Signup & Profile (5 min)**
   - [ ] Signup as new intern
   - [ ] Complete all 4 profile steps
   - [ ] Upload resume
   - [ ] Verify profile complete

2. **Search & Apply (5 min)**
   - [ ] Search for internships
   - [ ] Apply filters
   - [ ] View internship details
   - [ ] Submit application

3. **Recruiter Flow (5 min)**
   - [ ] Login as recruiter
   - [ ] Post new internship
   - [ ] View applications
   - [ ] Check applicant details

4. **Mobile Test (5 min)**
   - [ ] Test all above on mobile view
   - [ ] Verify responsive design
   - [ ] Check touch interactions

### ✅ **All Tests Pass:** Ready for Production! 🚀

---

## 📝 Test Report Template

```
Test Date: [DATE]
Tester: [NAME]
Environment: [Development/Staging/Production]

Feature Tests:
✅ Authentication: PASS
✅ Profile Completion: PASS
✅ Resume Upload: PASS
✅ Advanced Search: PASS
✅ Styling: PASS
✅ Mobile Responsive: PASS

Issues Found: [NONE/LIST]

Status: READY FOR PRODUCTION
```

---

## 🚀 Deployment Checklist

Before deploying to production:
- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database seeded
- [ ] File upload directory exists
- [ ] CORS configured for production domain
- [ ] SSL certificate installed
- [ ] Backup database
- [ ] Monitor logs

---

**Happy Testing! 🎉**
