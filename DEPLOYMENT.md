# Deployment Guide - Intern4All

Complete guide for deploying Intern4All to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- ✅ All features tested locally
- ✅ Environment variables configured
- ✅ MongoDB Atlas cluster created
- ✅ Google OAuth credentials (if using)
- ✅ Gemini API key configured
- ✅ Code pushed to Git repository
- ✅ Production build tested locally

---

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Verify your email

### 2. Create a Cluster

1. Click "Build a Cluster"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (closest to your users)
4. Click "Create Cluster"
5. Wait 3-5 minutes for cluster creation

### 3. Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 4. Whitelist IP Addresses

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IPs of your deployment platform
5. Click "Confirm"

### 5. Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `intern4all`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/intern4all?retryWrites=true&w=majority
```

---

## Backend Deployment

### Option 1: Deploy to Render (Recommended)

#### Step 1: Prepare Repository

1. Ensure `backend/` directory is in your Git repository
2. Commit all changes:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

#### Step 2: Create Render Account

1. Go to [Render](https://render.com/)
2. Sign up with GitHub
3. Authorize Render to access your repositories

#### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name:** `intern4all-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

#### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_generated_secret
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-url.onrender.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend-url.vercel.app
GEMINI_API_KEY=your_gemini_api_key
```

#### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend will be live at: `https://your-app-name.onrender.com`

#### Step 6: Seed Database (Optional)

1. Go to "Shell" tab in Render dashboard
2. Run: `node seeder.js -i`

---

### Option 2: Deploy to Heroku

#### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Verify
heroku --version
```

#### Step 2: Login and Create App

```bash
heroku login
cd backend
heroku create intern4all-backend
```

#### Step 3: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_generated_secret"
heroku config:set JWT_EXPIRE=7d
heroku config:set JWT_COOKIE_EXPIRE=7
heroku config:set FRONTEND_URL="https://your-frontend-url.vercel.app"
heroku config:set GEMINI_API_KEY="your_gemini_api_key"
```

#### Step 4: Deploy

```bash
git push heroku main
```

#### Step 5: Seed Database

```bash
heroku run node seeder.js -i
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Configure Environment Variables

Create `.env.production` in project root:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

#### Step 4: Deploy

```bash
# From project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? intern4all
# - In which directory is your code? ./
# - Override settings? No
```

#### Step 5: Add Environment Variables in Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add:
   - `REACT_APP_API_URL`
   - `REACT_APP_GEMINI_API_KEY`
5. Redeploy

#### Step 6: Production Deploy

```bash
vercel --prod
```

Your app will be live at: `https://your-app-name.vercel.app`

---

### Option 2: Deploy to Netlify

#### Step 1: Build Production

```bash
npm run build
```

#### Step 2: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 3: Login and Deploy

```bash
netlify login
netlify deploy

# Follow prompts:
# - Create new site
# - Publish directory: build
```

#### Step 4: Add Environment Variables

1. Go to Netlify dashboard
2. Site settings → Build & deploy → Environment
3. Add variables:
   - `REACT_APP_API_URL`
   - `REACT_APP_GEMINI_API_KEY`

#### Step 5: Production Deploy

```bash
netlify deploy --prod
```

---

## Environment Variables

### Backend Production Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/intern4all
JWT_SECRET=<64-character-random-string>
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend.vercel.app
GEMINI_API_KEY=<your-gemini-api-key>
```

### Frontend Production Variables

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_GEMINI_API_KEY=<your-gemini-api-key>
```

### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Post-Deployment

### 1. Update Google OAuth

If using Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "Credentials"
4. Edit OAuth 2.0 Client
5. Add authorized redirect URIs:
   - `https://your-backend.onrender.com/api/auth/google/callback`
6. Save

### 2. Test Deployment

#### Backend Health Check

```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

#### Frontend Check

1. Open `https://your-frontend.vercel.app`
2. Test login
3. Test profile completion
4. Test internship browsing
5. Test applications

### 3. Seed Production Database

```bash
# If using Render
# Go to Shell tab and run:
node seeder.js -i

# If using Heroku
heroku run node seeder.js -i
```

### 4. Monitor Application

#### Render Monitoring

- Go to your service dashboard
- Check "Logs" tab for errors
- Monitor "Metrics" for performance

#### Vercel Monitoring

- Go to project dashboard
- Check "Deployments" for build status
- Review "Analytics" for usage

### 5. Set Up Custom Domain (Optional)

#### For Backend (Render)

1. Go to service settings
2. Click "Custom Domain"
3. Add your domain (e.g., `api.intern4all.com`)
4. Update DNS records as instructed

#### For Frontend (Vercel)

1. Go to project settings
2. Click "Domains"
3. Add your domain (e.g., `intern4all.com`)
4. Update DNS records as instructed

---

## Troubleshooting

### Backend Won't Start

**Check:**
- Environment variables are set correctly
- MongoDB connection string is valid
- MongoDB Atlas IP whitelist includes deployment platform
- Build logs for errors

### Frontend Can't Connect to Backend

**Check:**
- `REACT_APP_API_URL` points to correct backend URL
- Backend is running and accessible
- CORS is configured correctly in backend
- `FRONTEND_URL` in backend matches frontend URL

### Database Connection Failed

**Check:**
- MongoDB Atlas cluster is running
- Connection string is correct
- Database user has correct permissions
- IP whitelist includes deployment platform

### Google OAuth Not Working

**Check:**
- Google OAuth credentials are correct
- Redirect URIs are updated in Google Console
- Callback URL matches in both frontend and Google Console

---

## Performance Optimization

### Backend

1. **Enable Compression** (already configured)
2. **Use CDN** for static assets
3. **Database Indexing** (already configured)
4. **Caching** - Add Redis for session storage

### Frontend

1. **Code Splitting** - Already enabled with React
2. **Image Optimization** - Use WebP format
3. **Lazy Loading** - Load components on demand
4. **CDN** - Vercel/Netlify provide automatic CDN

---

## Security Checklist

- ✅ HTTPS enabled (automatic on Vercel/Render)
- ✅ Environment variables secured
- ✅ JWT secret is strong and random
- ✅ MongoDB user has limited permissions
- ✅ CORS configured for specific origin
- ✅ Rate limiting enabled
- ✅ Input validation on all endpoints
- ✅ Passwords hashed with bcrypt
- ✅ Helmet.js security headers
- ✅ MongoDB sanitization enabled

---

## Maintenance

### Regular Tasks

1. **Monitor Logs** - Check for errors daily
2. **Update Dependencies** - Monthly security updates
3. **Backup Database** - MongoDB Atlas auto-backup
4. **Review Analytics** - Check usage patterns
5. **Update Content** - Add new internships regularly

### Updating Application

```bash
# Make changes locally
git add .
git commit -m "Update: description"
git push origin main

# Vercel/Render will auto-deploy
# Or manually deploy:
vercel --prod
```

---

## Scaling

### When to Scale

- Response time > 2 seconds
- CPU usage > 80%
- Memory usage > 80%
- Error rate > 1%

### How to Scale

#### Render

1. Upgrade to paid plan
2. Increase instance size
3. Add more instances

#### Database

1. Upgrade MongoDB Atlas tier
2. Add read replicas
3. Enable sharding for large datasets

---

## Support

For deployment issues:

- **Render:** https://render.com/docs
- **Vercel:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Heroku:** https://devcenter.heroku.com/

---

**Your Intern4All platform is now live! 🚀**
