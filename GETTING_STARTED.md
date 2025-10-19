# Getting Started with Intern4All

## 📋 Pre-Installation Checklist

Before you begin, make sure you have:

- [ ] **Node.js** installed (v14 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- [ ] **npm** installed (comes with Node.js)
  - Check: `npm --version`

- [ ] **MongoDB** installed OR MongoDB Atlas account
  - Local: https://www.mongodb.com/try/download/community
  - Atlas: https://www.mongodb.com/cloud/atlas
  - Check: `mongod --version`

- [ ] **Git** installed (optional)
  - Check: `git --version`
  - Download: https://git-scm.com/

## 🚀 Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd /Users/amanyadav/Intern4all
```

### Step 2: Run Automated Setup

```bash
# Make script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

**The script will:**
- ✅ Check prerequisites
- ✅ Install frontend dependencies
- ✅ Install backend dependencies
- ✅ Create environment files
- ✅ Generate secure JWT secret
- ✅ Optionally seed the database

### Step 3: Verify Environment Files

#### Check Frontend .env
```bash
cat .env
```

Should contain:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GEMINI_API_KEY=AIzaSyBe5lGUCkiDO7cBphomKyUeU-9dYevXQ80
```

#### Check Backend .env
```bash
cat backend/.env
```

Should contain:
- `NODE_ENV=development`
- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/intern4all`
- `JWT_SECRET=<generated-secret>`
- Other configuration values

**Important:** If using MongoDB Atlas, update `MONGODB_URI` with your connection string.

### Step 4: Start MongoDB

#### If using local MongoDB:

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

#### If using MongoDB Atlas:
- Ensure your connection string is in `backend/.env`
- Whitelist your IP address in Atlas dashboard

### Step 5: Seed the Database (If not done by setup script)

```bash
cd backend
node seeder.js -i
cd ..
```

This creates:
- 3 test users
- 5 sample internships
- Sample data for testing

### Step 6: Start Backend Server

**Open Terminal 1:**
```bash
cd backend
npm run dev
```

**Wait for:**
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

### Step 7: Start Frontend Server

**Open Terminal 2:**
```bash
# From project root
npm start
```

**Browser will automatically open:** `http://localhost:3000`

## ✅ Verification Steps

### 1. Check Backend Health

Open a new terminal:
```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-15T..."
}
```

### 2. Test Login

1. Browser should open at `http://localhost:3000`
2. You'll see the login page
3. Use test credentials:
   - **Email:** `aman@example.com`
   - **Password:** `password`
4. Click "Sign In"

### 3. Verify Dashboard

After login, you should see:
- ✅ Welcome message with your name
- ✅ Statistics cards (Active Applications, AI Matches, Success Rate)
- ✅ AI-Recommended internships section
- ✅ Your Progress section
- ✅ Sidebar navigation

### 4. Test Profile Completion

1. Click "Profile" in sidebar
2. Fill in the 3-step form:
   - **Step 1:** Basic Info (phone, location, education)
   - **Step 2:** Skills & Interests
   - **Step 3:** Work Preferences
3. Click "Complete Profile"
4. You should be redirected to dashboard
5. AI recommendations should now appear

### 5. Test Applications

1. Click "My Applications" in sidebar
2. Initially empty (no applications yet)
3. You can apply to internships from the dashboard

### 6. Test AI Assistant

1. Click the "Ask Assistant" button in sidebar
2. AI chat modal should open
3. Try asking: "How do I apply for internships?"
4. You should get a response from Gemini AI

### 7. Test Language Switching

1. Click the globe icon (🌐) in header
2. Select a language (e.g., हिन्दी)
3. UI should switch to selected language
4. Switch back to English

## 🎯 What You Can Do Now

### As a Student (Regular User)

1. **Complete Your Profile**
   - Go to Profile page
   - Add your skills, education, preferences
   - Save each step

2. **Browse Internships**
   - View AI-recommended internships on dashboard
   - Click "View All" to see more
   - Check different sectors and locations

3. **Apply to Internships**
   - Click "View Details" on any internship
   - Fill in cover letter
   - Submit application

4. **Track Applications**
   - Go to "My Applications"
   - See status of each application
   - View AI match scores

5. **Get Help**
   - Use AI Assistant for questions
   - Ask about application process
   - Get career advice

### As an Admin

Login with admin credentials:
- **Email:** `admin@intern4all.com`
- **Password:** `password123`

You can:
- View all users
- Manage internships
- Review applications
- Update application status

### As a Company

Login with company credentials:
- **Email:** `company@example.com`
- **Password:** `password123`

You can:
- Post internships
- View applications
- Review candidates
- Accept/reject applications

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError`

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: Module Not Found

**Error:** `Cannot find module 'axios'`

**Solution:**
```bash
# Reinstall dependencies
npm install

# For backend
cd backend
npm install
```

### Issue: Can't Login

**Problem:** Invalid credentials error

**Solution:**
1. Make sure database is seeded:
   ```bash
   cd backend
   node seeder.js -i
   ```
2. Use correct credentials:
   - Email: `aman@example.com`
   - Password: `password`

### Issue: No Recommendations Showing

**Problem:** Dashboard shows "Complete your profile"

**Solution:**
1. Go to Profile page
2. Complete all 3 steps
3. Return to dashboard
4. Recommendations should appear

## 📚 Next Steps

### 1. Explore the Documentation

- **[README.md](./README.md)** - Main project overview
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick reference
- **[INSTALLATION.md](./INSTALLATION.md)** - Detailed installation
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to production
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete summary

### 2. Customize the Application

- Update branding and colors in CSS files
- Add your own internship listings
- Configure Google OAuth (optional)
- Set up email notifications (future)

### 3. Test All Features

- [ ] User registration
- [ ] Login with email
- [ ] Google OAuth login (if configured)
- [ ] Profile completion
- [ ] Internship browsing
- [ ] Application submission
- [ ] Application tracking
- [ ] AI recommendations
- [ ] AI assistant chat
- [ ] Language switching
- [ ] Logout

### 4. Prepare for Deployment

When ready to deploy:
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Set up MongoDB Atlas
3. Configure production environment variables
4. Deploy backend to Render/Heroku
5. Deploy frontend to Vercel/Netlify

## 🎓 Learning Resources

### Understanding the Code

**Backend:**
- `backend/server.js` - Entry point, middleware setup
- `backend/models/` - Database schemas
- `backend/controllers/` - Business logic
- `backend/routes/` - API endpoints
- `backend/middleware/` - Auth, validation, errors

**Frontend:**
- `src/App.js` - Main component with all UI
- `src/services/` - API integration layer
- `src/App.css` - Styling

### Key Concepts

1. **Authentication Flow:**
   - User logs in → Backend validates → Returns JWT token
   - Token stored in localStorage
   - Token sent with each API request
   - Backend verifies token → Allows access

2. **Profile Completion:**
   - 3-step form (Basic Info, Skills, Preferences)
   - Each step saves to backend
   - Profile marked complete when all steps done
   - Unlocks AI recommendations

3. **AI Recommendations:**
   - Backend matches user skills with internship requirements
   - Considers sector and location preferences
   - Calculates match score (0-100)
   - Returns top matches sorted by score

4. **Application Process:**
   - User applies to internship
   - Backend creates application record
   - Calculates AI match score
   - Company can review and update status

## 💡 Tips for Success

1. **Keep Both Servers Running**
   - Backend on port 5000
   - Frontend on port 3000
   - Don't close the terminals

2. **Check Logs for Errors**
   - Backend terminal shows API errors
   - Browser console shows frontend errors
   - MongoDB logs show database issues

3. **Use Test Accounts**
   - Regular user: `aman@example.com`
   - Admin: `admin@intern4all.com`
   - Company: `company@example.com`
   - All passwords: `password` or `password123`

4. **Database Management**
   - Seed: `node seeder.js -i`
   - Clear: `node seeder.js -d`
   - Re-seed if data gets corrupted

5. **Development Workflow**
   - Make changes to code
   - Frontend auto-reloads (React hot reload)
   - Backend auto-restarts (nodemon)
   - No need to manually restart

## 📞 Getting Help

### If You're Stuck

1. **Check the error message** - Read it carefully
2. **Check the logs** - Backend terminal and browser console
3. **Review documentation** - Especially INSTALLATION.md
4. **Verify prerequisites** - Node.js, MongoDB running
5. **Check environment files** - Correct values in .env files
6. **Try restarting** - Stop and start both servers

### Resources

- **Documentation:** All .md files in project root
- **Backend API:** http://localhost:5000/api/health
- **Frontend:** http://localhost:3000
- **MongoDB:** Check connection in backend terminal

## ✅ Final Checklist

Before you start using the application:

- [ ] Node.js installed and verified
- [ ] MongoDB installed/Atlas configured
- [ ] Project dependencies installed
- [ ] Environment files created
- [ ] MongoDB running
- [ ] Database seeded
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can login with test credentials
- [ ] Dashboard loads successfully

## 🎉 You're All Set!

Your Intern4All platform is now fully set up and ready to use!

**Start exploring:**
1. Login with `aman@example.com` / `password`
2. Complete your profile
3. Browse AI-recommended internships
4. Apply to internships
5. Track your applications
6. Chat with AI assistant

**Happy coding! 🚀**

---

**Need help?** Check the documentation files or review the error messages in your terminal.
