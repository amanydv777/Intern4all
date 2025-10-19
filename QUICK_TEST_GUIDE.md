# Quick Test Guide - Intern4All

## 🚀 Start the Application

### Terminal 1 - Backend
```bash
cd backend
node seeder.js -d && node seeder.js -i
npm run dev
```

### Terminal 2 - Frontend
```bash
npm start
```

Browser opens at: `http://localhost:3000`

---

## 🧪 Test Scenarios

### 1. Test Intern Signup & Login

**Signup:**
1. Click "Need an account? Sign up"
2. Enter name: "Test Intern"
3. **Select "Intern" role** (should highlight in blue)
4. Enter email: "testintern@example.com"
5. Enter password: "password123"
6. Confirm password: "password123"
7. Click "Sign Up"
8. ✅ Should redirect to Intern Dashboard

**Login:**
- Email: `aman@example.com`
- Password: `password`
- ✅ Should see Intern Dashboard with "Find Internships" button

### 2. Test Recruiter Signup & Login

**Signup:**
1. Click "Need an account? Sign up"
2. Enter name: "Test Recruiter"
3. **Select "Recruiter" role** (should highlight in blue)
4. Enter email: "testrecruiter@example.com"
5. Enter password: "password123"
6. Confirm password: "password123"
7. Click "Sign Up"
8. ✅ Should redirect to Recruiter Dashboard

**Login:**
- Email: `recruiter@example.com`
- Password: `password123`
- ✅ Should see Recruiter Dashboard with "Post Internship" button

### 3. Test Time-Based Greeting

**Current time determines greeting:**
- Before 12:00 PM → "Good morning"
- 12:00 PM - 5:00 PM → "Good afternoon"
- 5:00 PM - 9:00 PM → "Good evening"
- After 9:00 PM → "Good night"

✅ Greeting should match current time

### 4. Test Language Switching

1. Open sidebar (click hamburger menu)
2. Scroll to bottom
3. Click language selector (shows current language)
4. Select "हिन्दी" (Hindi)
   - ✅ UI should switch to Hindi
5. Select "తెలుగు" (Telugu)
   - ✅ UI should switch to Telugu
6. Select "ગુજરાતી" (Gujarati)
   - ✅ UI should switch to Gujarati
7. Select "English"
   - ✅ UI should switch back to English

### 5. Test Recruiter Dashboard

**Login as recruiter:**
1. Email: `recruiter@example.com`
2. Password: `password123`

**Should see:**
- ✅ Time-based greeting with recruiter name
- ✅ "Post Internship" button (top right)
- ✅ 4 stat cards:
  - Total Postings
  - Total Applications
  - Accepted
  - Response Rate
- ✅ "My Internship Postings" section
- ✅ Empty state or list of postings

### 6. Test Post Internship

**As recruiter:**
1. Click "Post Internship" button
2. Fill in form:
   - Job Title: "Software Engineer Intern"
   - Company: "Tech Corp"
   - Description: "Great opportunity..."
   - Location: "Mumbai"
   - Stipend: "₹ 15,000/month"
   - Duration: "3 months"
   - Start Date: (select future date)
   - Application Deadline: (select date before start)
   - Sector: "Technology"
   - Number of Openings: 2
3. Click "Post Internship"
4. ✅ Should see success alert
5. ✅ Should redirect to dashboard
6. ✅ New posting should appear in "My Postings"

### 7. Test Intern Dashboard

**Login as intern:**
1. Email: `aman@example.com`
2. Password: `password`

**Should see:**
- ✅ Time-based greeting with intern name
- ✅ "Find Internships" button (top right)
- ✅ 3 stat cards:
  - Active Applications
  - AI Matches
  - Success Rate
- ✅ "AI-Recommended For You" section
- ✅ List of recommended internships

### 8. Test Sidebar Navigation

**For Intern:**
- ✅ Dashboard
- ✅ Find Internships
- ✅ My Applications
- ✅ Profile

**For Recruiter:**
- ✅ Dashboard
- ✅ My Applications (shows postings)
- ✅ Profile

**Both should have:**
- ✅ Language selector at bottom
- ✅ Notifications button at bottom
- ✅ User info showing correct role

### 9. Test Find Internships

**As intern:**
1. Click "Find Internships" button
2. ✅ Should see grid of internships
3. ✅ Each card shows:
   - Title
   - Company
   - Location
   - Stipend
   - Tags
   - "View Details" button

### 10. Test Profile Completion

**As intern:**
1. Click "Profile" in sidebar
2. ✅ Should see 3-step form
3. Fill in Step 1 (Basic Info)
4. Click "Next"
5. Fill in Step 2 (Skills & Interests)
6. Click "Next"
7. Fill in Step 3 (Preferences)
8. Click "Complete Profile"
9. ✅ Should redirect to dashboard
10. ✅ AI recommendations should appear

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property 'role' of undefined"
**Solution:** Reseed database and restart backend

### Issue: No statistics showing on recruiter dashboard
**Solution:** Post at least one internship first

### Issue: Language not switching
**Solution:** Check browser console for errors, refresh page

### Issue: Role selection not working
**Solution:** Clear browser cache and localStorage

### Issue: "Failed to fetch" errors
**Solution:** Ensure backend is running on port 5000

---

## ✅ Success Checklist

- [ ] Backend running without errors
- [ ] Frontend running on localhost:3000
- [ ] Can signup as Intern
- [ ] Can signup as Recruiter
- [ ] Can login as Intern
- [ ] Can login as Recruiter
- [ ] Time-based greeting works
- [ ] Language switching works (all 4 languages)
- [ ] Intern sees "Find Internships" button
- [ ] Recruiter sees "Post Internship" button
- [ ] Recruiter dashboard shows statistics
- [ ] Can post internship as recruiter
- [ ] Sidebar shows language switcher
- [ ] Sidebar shows notifications button
- [ ] Role displays correctly in sidebar
- [ ] Navigation items are role-specific

---

## 📊 Expected Results

### Intern Dashboard
```
Good [morning/afternoon/evening], Aman Yadav! 👋
Ready to explore new opportunities?

[Find Internships →]

Stats:
- Active Applications: 0
- AI Matches: 5
- Success Rate: 0%

AI-Recommended For You:
[Grid of internship cards]
```

### Recruiter Dashboard
```
Good [morning/afternoon/evening], Tech Recruiter! 👋
Manage your internship postings

[Post Internship →]

Stats:
- Total Postings: 0
- Total Applications: 0
- Accepted: 0
- Response Rate: 0%

My Internship Postings:
[Empty state or list of postings]
```

### Sidebar (Bottom Section)
```
┌─────────────────────┐
│ 🌐 English         │ ← Language selector
└─────────────────────┘
┌─────────────────────┐
│ 🔔 Notifications   │ ← Notifications button
└─────────────────────┘
┌─────────────────────┐
│ A  Aman Yadav      │
│    Intern          │ ← Role display
│                  ⎋ │ ← Logout
└─────────────────────┘
```

---

## 🎯 Quick Commands

```bash
# Reseed database
cd backend && node seeder.js -d && node seeder.js -i

# Restart backend
cd backend && npm run dev

# Restart frontend
npm start

# Clear browser storage (in browser console)
localStorage.clear()

# Check backend health
curl http://localhost:5000/api/health
```

---

## 🎉 All Features Working!

If all tests pass, you have successfully implemented:
- ✅ Role-based user system
- ✅ Time-aware greetings
- ✅ Multi-language support (4 languages)
- ✅ Recruiter dashboard
- ✅ Post internship functionality
- ✅ Enhanced sidebar
- ✅ Role-specific navigation
- ✅ Beautiful UI with proper styling

**Your Intern4All platform is now fully functional! 🚀**
