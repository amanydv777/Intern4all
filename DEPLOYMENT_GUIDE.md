# Production Deployment Guide

## 🚀 Quick Start Deployment

This guide will help you deploy the Intern4All application to production.

---

## Prerequisites

- Node.js v14+ installed
- MongoDB Atlas account (or MongoDB instance)
- Git installed
- Netlify/Vercel account (for frontend)
- Render/Heroku/Railway account (for backend)

---

## Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
5. Get your connection string

### 1.2 Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/intern4all?retryWrites=true&w=majority
```

Replace:
- `username` with your database username
- `password` with your database password
- `cluster` with your cluster name

---

## Step 2: Backend Deployment (Render)

### 2.1 Prepare Backend
1. Ensure all code is committed to Git
2. Push to GitHub/GitLab

### 2.2 Deploy to Render
1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure:
   - **Name**: intern4all-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Free (or paid for better performance)

### 2.3 Set Environment Variables
In Render dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
FRONTEND_URL=https://your-frontend-url.netlify.app
```

**Important**: 
- Generate a strong JWT_SECRET (at least 32 characters)
- Use your actual MongoDB Atlas connection string
- Update FRONTEND_URL after deploying frontend

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://intern4all-backend.onrender.com`)

---

## Step 3: Frontend Deployment (Netlify)

### 3.1 Prepare Frontend
1. Update `.env` file with your backend URL:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

2. Build the project locally to test:
```bash
npm run build
```

### 3.2 Deploy to Netlify

#### Option A: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option B: Netlify Dashboard
1. Go to [Netlify](https://www.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Environment variables**:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```

### 3.3 Configure Redirects
Create `public/_redirects` file (if not exists):
```
/*    /index.html   200
```

This ensures React Router works properly.

### 3.4 Deploy
1. Click "Deploy site"
2. Wait for deployment
3. Note your frontend URL (e.g., `https://intern4all.netlify.app`)

---

## Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable with your Netlify URL
3. Redeploy backend

---

## Step 5: Database Seeding (Optional)

If you want to add sample data:

```bash
# SSH into your Render instance or run locally
cd backend
node seeder.js -i
```

Or create initial admin user via API:
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@intern4all.com",
    "password": "SecurePassword123!",
    "role": "admin",
    "securityKey": "AdminSecurityKey123"
  }'
```

---

## Step 6: Verification

### 6.1 Test Backend
```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

### 6.2 Test Frontend
1. Visit your Netlify URL
2. Try to register a new account
3. Login with the account
4. Test forgot password feature
5. Browse internships
6. Submit an application

### 6.3 Check Logs
- **Render**: Check logs in Render dashboard
- **Netlify**: Check deploy logs in Netlify dashboard

---

## Alternative Deployment Options

### Backend Alternatives

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create intern4all-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
# ... set all other variables

# Deploy
git push heroku main
```

#### Railway
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy

### Frontend Alternatives

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## Post-Deployment Checklist

### Security
- [ ] All environment variables are set correctly
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] CORS is configured with actual frontend URL
- [ ] MongoDB Atlas IP whitelist is configured
- [ ] SSL/HTTPS is enabled (automatic on Netlify/Render)

### Functionality
- [ ] User registration works
- [ ] User login works
- [ ] Forgot password works with security key
- [ ] Application submission works
- [ ] Profile update works
- [ ] Internship browsing works

### Performance
- [ ] Frontend loads quickly
- [ ] API responses are fast
- [ ] Images are optimized
- [ ] No console errors

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Monitor database performance

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend

**Solution**:
- Verify FRONTEND_URL in backend environment variables
- Check backend CORS configuration
- Ensure both HTTP/HTTPS protocols match

#### 2. Database Connection Failed
**Problem**: Backend can't connect to MongoDB

**Solution**:
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

#### 3. Environment Variables Not Loading
**Problem**: Server crashes on startup

**Solution**:
- Check all required variables are set
- Verify no typos in variable names
- Check .env file is not committed to Git

#### 4. Build Fails
**Problem**: Frontend build fails on Netlify

**Solution**:
- Check for syntax errors
- Verify all dependencies are in package.json
- Check Node version compatibility

#### 5. 404 on Frontend Routes
**Problem**: React routes return 404

**Solution**:
- Ensure `_redirects` file exists in `public/` folder
- Content: `/*    /index.html   200`

---

## Maintenance

### Regular Tasks

#### Daily
- Check error logs
- Monitor uptime
- Review user feedback

#### Weekly
- Update dependencies: `npm update`
- Check security vulnerabilities: `npm audit`
- Review performance metrics

#### Monthly
- Database backup verification
- Security audit
- Performance optimization review

### Updates
```bash
# Update dependencies
npm update

# Check for security issues
npm audit
npm audit fix

# Test thoroughly before deploying
npm test
npm run build
```

---

## Scaling Considerations

### When to Scale

#### Backend
- Response time > 1 second
- CPU usage > 80%
- Memory usage > 80%
- Request queue building up

**Solutions**:
- Upgrade Render instance
- Add Redis caching
- Optimize database queries
- Add load balancer

#### Frontend
- Slow page loads
- Large bundle size

**Solutions**:
- Implement code splitting
- Add lazy loading
- Optimize images
- Use CDN

#### Database
- Slow queries
- High CPU usage

**Solutions**:
- Add database indexes
- Upgrade MongoDB Atlas tier
- Implement caching
- Optimize queries

---

## Cost Estimates

### Free Tier (Development/Testing)
- **MongoDB Atlas**: Free (512MB storage)
- **Render**: Free (750 hours/month)
- **Netlify**: Free (100GB bandwidth)
- **Total**: $0/month

### Production Tier (Recommended)
- **MongoDB Atlas**: $9/month (Shared M2)
- **Render**: $7/month (Starter)
- **Netlify**: Free or $19/month (Pro)
- **Total**: $16-35/month

### Enterprise Tier
- **MongoDB Atlas**: $57+/month (Dedicated)
- **Render**: $25+/month (Standard)
- **Netlify**: $99/month (Business)
- **Total**: $181+/month

---

## Support Resources

### Documentation
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)

### Community
- Stack Overflow
- GitHub Issues
- Discord/Slack communities

---

## Rollback Procedure

If deployment fails:

### Backend (Render)
1. Go to Render dashboard
2. Click on your service
3. Go to "Deploys" tab
4. Click "Rollback" on previous successful deploy

### Frontend (Netlify)
1. Go to Netlify dashboard
2. Click on your site
3. Go to "Deploys" tab
4. Click "Publish deploy" on previous version

### Database
1. Restore from MongoDB Atlas backup
2. Or use your manual backup

---

## Next Steps

After successful deployment:

1. **Set up monitoring**: UptimeRobot, Sentry
2. **Configure analytics**: Google Analytics
3. **Add custom domain**: Configure DNS
4. **Set up CI/CD**: Automate deployments
5. **Implement backups**: Automated database backups
6. **Security hardening**: Review security checklist
7. **Performance optimization**: Implement caching
8. **User testing**: Get feedback from real users

---

**Need Help?**
- Check the logs first
- Review this guide
- Search for error messages
- Ask in community forums
- Create GitHub issue

**Good luck with your deployment! 🚀**
