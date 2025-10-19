# Intern4All - Complete Installation Guide

This guide will walk you through the complete installation and setup process for the Intern4All platform.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Methods](#installation-methods)
3. [Step-by-Step Manual Installation](#step-by-step-manual-installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Verification](#verification)
7. [Common Issues](#common-issues)

## System Requirements

### Required Software

- **Node.js**: Version 14.x or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm**: Version 6.x or higher (comes with Node.js)
  - Verify: `npm --version`

- **MongoDB**: Version 4.4 or higher
  - Option 1: Local installation - https://www.mongodb.com/try/download/community
  - Option 2: MongoDB Atlas (cloud) - https://www.mongodb.com/cloud/atlas
  - Verify: `mongod --version`

### Optional Software

- **Git**: For version control
  - Download: https://git-scm.com/
  - Verify: `git --version`

- **Postman**: For API testing
  - Download: https://www.postman.com/downloads/

### System Specifications

- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free space
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)

## Installation Methods

### Method 1: Automated Setup (Recommended)

The fastest way to get started:

```bash
# Navigate to project directory
cd Intern4all

# Make setup script executable (Mac/Linux)
chmod +x setup.sh

# Run setup script
./setup.sh
```

The script will:
- Check all prerequisites
- Install all dependencies
- Create environment files
- Generate secure JWT secret
- Optionally seed the database

### Method 2: Manual Installation

Follow the detailed steps below for manual installation.

## Step-by-Step Manual Installation

### Step 1: Install Node.js and npm

#### Windows
1. Download Node.js installer from https://nodejs.org/
2. Run the installer
3. Follow the installation wizard
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### macOS
Using Homebrew:
```bash
brew install node
```

Or download from https://nodejs.org/

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install MongoDB

#### Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a service
5. Start MongoDB service from Services

#### macOS
Using Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### MongoDB Atlas (Cloud Alternative)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Whitelist your IP address
6. Create a database user

### Step 3: Clone/Download the Project

```bash
# If using Git
git clone <repository-url>
cd Intern4all

# Or download and extract the ZIP file
```

### Step 4: Install Frontend Dependencies

```bash
# In the project root directory
npm install
```

This will install:
- React and React DOM
- Axios for API calls
- React Icons
- Google Generative AI
- All other frontend dependencies

### Step 5: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

This will install:
- Express.js
- Mongoose
- JWT and Passport
- Security middleware
- All other backend dependencies

### Step 6: Configure Environment Variables

#### Frontend Configuration

Create `.env` file in the project root:

```bash
# In project root directory
touch .env
```

Add the following content:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GEMINI_API_KEY=AIzaSyBe5lGUCkiDO7cBphomKyUeU-9dYevXQ80
```

#### Backend Configuration

Create `.env` file in the backend directory:

```bash
# In backend directory
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database - Choose one:
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/intern4all

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intern4all

# JWT Configuration - Generate a secure secret
JWT_SECRET=your_generated_secret_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# AI Configuration
GEMINI_API_KEY=AIzaSyBe5lGUCkiDO7cBphomKyUeU-9dYevXQ80
```

**Generate a secure JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET`.

### Step 7: Seed the Database (Optional but Recommended)

This creates sample data for testing:

```bash
# Make sure you're in the backend directory
cd backend

# Seed the database
node seeder.js -i
```

This creates:
- 3 test users (admin, company, regular user)
- 5 sample internships
- Sample data for testing

**Test Credentials:**
- Email: `aman@example.com`
- Password: `password`

### Step 8: Verify Installation

Check that all dependencies are installed:

```bash
# In project root
npm list --depth=0

# In backend directory
cd backend
npm list --depth=0
```

## Configuration

### MongoDB Configuration

#### Local MongoDB
Ensure MongoDB is running:

```bash
# Check if MongoDB is running
# macOS/Linux:
ps aux | grep mongod

# Windows:
# Check Services for "MongoDB"

# Start MongoDB if not running
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
# Start from Services or run: net start MongoDB
```

#### MongoDB Atlas
1. Get your connection string from Atlas dashboard
2. Replace `<password>` with your database user password
3. Replace `<dbname>` with `intern4all`
4. Update `MONGODB_URI` in backend `.env`

### Google OAuth Configuration (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to backend `.env`

### Gemini AI Configuration

The API key is already configured. If you want to use your own:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Update `REACT_APP_GEMINI_API_KEY` in frontend `.env`
4. Update `GEMINI_API_KEY` in backend `.env`

## Running the Application

### Start MongoDB (if using local)

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Start Backend Server

Open a terminal:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

### Start Frontend Server

Open a new terminal:

```bash
# From project root
npm start
```

The application will open automatically at `http://localhost:3000`

## Verification

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-15T13:45:00.000Z"
}
```

### 2. Check Database Connection

Look for this message in backend terminal:
```
✅ MongoDB Connected: localhost
```

### 3. Test Login

1. Open `http://localhost:3000`
2. Use test credentials:
   - Email: `aman@example.com`
   - Password: `password`
3. You should be redirected to the dashboard

### 4. Verify Features

- ✅ Dashboard loads with stats
- ✅ Profile completion works
- ✅ AI recommendations appear (after profile completion)
- ✅ Applications page accessible
- ✅ AI Assistant chatbot works

## Common Issues

### Issue 1: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   # macOS/Linux
   ps aux | grep mongod
   ```

2. Start MongoDB:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. Verify connection string in `backend/.env`

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Kill the process using the port:
   ```bash
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. Or change the port in `backend/.env`:
   ```env
   PORT=5001
   ```

### Issue 3: Module Not Found

**Error:** `Cannot find module 'axios'`

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Verify `FRONTEND_URL` in `backend/.env`:
   ```env
   FRONTEND_URL=http://localhost:3000
   ```

2. Ensure backend is running before starting frontend

3. Clear browser cache and cookies

### Issue 5: JWT Authentication Fails

**Error:** `Not authorized to access this route`

**Solutions:**
1. Verify `JWT_SECRET` is set in `backend/.env`
2. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```
3. Login again

### Issue 6: Database Seeding Fails

**Error:** `Error importing data`

**Solutions:**
1. Ensure MongoDB is running
2. Check database connection
3. Delete existing data:
   ```bash
   node seeder.js -d
   ```
4. Try seeding again:
   ```bash
   node seeder.js -i
   ```

## Getting Help

If you encounter issues not covered here:

1. Check the [main README](./README.md)
2. Check the [backend README](./backend/README.md)
3. Review error messages carefully
4. Check MongoDB logs
5. Check browser console for frontend errors
6. Check terminal for backend errors

## Next Steps

After successful installation:

1. **Explore the Application**
   - Login with test credentials
   - Complete your profile
   - Browse internships
   - Apply to internships
   - Use the AI assistant

2. **Customize**
   - Update branding and colors
   - Add your own internships
   - Configure Google OAuth
   - Set up email notifications

3. **Deploy**
   - See deployment guide in main README
   - Configure production environment variables
   - Set up MongoDB Atlas for production
   - Deploy to Heroku, Vercel, or your preferred platform

## Support

For additional help:
- Email: support@intern4all.com
- GitHub Issues: [Create an issue]
- Documentation: See README files

---

**Congratulations! Your Intern4All platform is now ready to use! 🎉**
