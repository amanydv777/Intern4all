# Migration Guide - v1.0 to v2.0

## 🔄 Overview

This guide helps you migrate from version 1.0 to version 2.0 of Intern4All, which introduces **security key-based password recovery** and **complete application submission**.

---

## ⚠️ Breaking Changes

### 1. Security Key Requirement
**What Changed:** The `User` model now requires a `securityKey` field.

**Impact:** 
- All new registrations must include a security key
- Existing users without security keys cannot use password recovery
- Database schema has changed

### 2. Application Submission
**What Changed:** Application submission now requires a cover letter.

**Impact:**
- Applications without cover letters will be rejected
- Frontend application modal is now mandatory

---

## 📋 Migration Steps

### Step 1: Backup Your Database

**CRITICAL:** Always backup before migration!

```bash
# MongoDB dump
mongodump --uri="mongodb://localhost:27017/intern4all" --out=./backup

# Or using MongoDB Atlas
# Use the Atlas UI to create a backup snapshot
```

### Step 2: Update Code

```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
cd backend
npm install

cd ..
npm install
```

### Step 3: Update Environment Variables

Ensure all required variables are set:

**Backend `.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:3000
```

The server will now validate these on startup.

### Step 4: Migrate Existing Users

You have **two options**:

#### Option A: Fresh Start (Recommended for Development)

```bash
cd backend

# Delete all existing data
node seeder.js -d

# Import fresh data with security keys
node seeder.js -i
```

**Note:** This will delete all existing users and data!

#### Option B: Add Security Keys to Existing Users (Production)

Create a migration script:

```javascript
// backend/migrations/addSecurityKeys.js
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function migrateUsers() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Find users without security key
    const users = await User.find({ securityKey: { $exists: false } });
    console.log(`Found ${users.length} users to migrate`);

    for (const user of users) {
      // Generate a temporary security key
      const tempKey = 'TEMP' + Math.random().toString(36).substring(7).toUpperCase();
      
      // Hash the security key
      const salt = await bcrypt.genSalt(10);
      user.securityKey = await bcrypt.hash(tempKey, salt);
      
      // Save without validation to avoid password re-hashing
      await user.save({ validateBeforeSave: false });
      
      console.log(`✅ User ${user.email} - Temp Security Key: ${tempKey}`);
      console.log(`   Please inform user to update their security key!`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('⚠️  IMPORTANT: Send temporary security keys to users securely!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers();
```

Run the migration:
```bash
cd backend
node migrations/addSecurityKeys.js
```

**Important:** 
- Save the output with temporary security keys
- Send them to users securely (encrypted email, secure portal, etc.)
- Users should update their security keys immediately

### Step 5: Test the Migration

1. **Test New Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "intern",
    "securityKey": "mySecretKey123"
  }'
```

2. **Test Existing User Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@example.com",
    "password": "existingPassword"
  }'
```

3. **Test Password Recovery:**
```bash
curl -X POST http://localhost:5000/api/auth/forgotpassword \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "securityKey": "mySecretKey123"
  }'
```

### Step 6: Update Frontend

The frontend changes are backward compatible, but you should:

1. Clear browser cache
2. Clear localStorage:
```javascript
localStorage.clear();
```

3. Test all authentication flows:
   - Registration with security key
   - Login
   - Forgot password with security key
   - Application submission with cover letter

---

## 🔧 Rollback Procedure

If migration fails, you can rollback:

### Step 1: Stop the Application
```bash
# Stop backend
# Stop frontend
```

### Step 2: Restore Database
```bash
# Restore from backup
mongorestore --uri="mongodb://localhost:27017/intern4all" ./backup/intern4all
```

### Step 3: Revert Code
```bash
# Checkout previous version
git checkout v1.0

# Reinstall dependencies
cd backend && npm install
cd .. && npm install
```

### Step 4: Restart Application
```bash
# Start backend
cd backend && npm run dev

# Start frontend
npm start
```

---

## 📝 User Communication Template

### Email Template for Existing Users

**Subject:** Important: Security Update - Action Required

```
Dear [User Name],

We've upgraded our platform with enhanced security features. As part of this update, we've implemented a new password recovery system using security keys.

ACTION REQUIRED:
1. Your temporary security key is: [TEMP_KEY]
2. Please login and update your security key immediately
3. Go to Profile > Security Settings > Update Security Key

WHAT IS A SECURITY KEY?
A security key is a personal phrase you'll use to recover your password if you forget it. Choose something memorable but secure.

IMPORTANT:
- Keep your security key private and secure
- You'll need it to reset your password
- Update it from the temporary key as soon as possible

If you have any questions, please contact our support team.

Best regards,
Intern4All Team
```

---

## 🆕 New Features Guide

### For Users

#### Security Key Setup
1. During registration, you'll be asked to provide a security key
2. This key should be:
   - At least 4 characters long
   - Memorable to you
   - Kept private and secure
3. You'll need this key to reset your password

#### Password Recovery
1. Click "Forgot password?" on login page
2. Enter your email address
3. Enter your security key
4. If verified, you'll be redirected to reset your password
5. Enter your new password

#### Application Submission
1. Browse internships
2. Click "Apply Now" on an internship
3. A modal will open
4. Write your cover letter (required)
5. Submit your application

### For Developers

#### New API Endpoints
- `POST /api/auth/forgotpassword` - Now requires `securityKey`
- `POST /api/applications` - Now requires `coverLetter`

#### New Database Fields
- `User.securityKey` - Hashed security key
- `Application.coverLetter` - Application cover letter

#### New Frontend Components
- Security key input in registration
- Security key input in forgot password
- Application modal with cover letter

---

## 🧪 Testing Checklist

After migration, verify:

- [ ] New users can register with security key
- [ ] Existing users can login
- [ ] Migrated users can use password recovery
- [ ] Password recovery with security key works
- [ ] Application submission with cover letter works
- [ ] All existing data is intact
- [ ] No console errors
- [ ] API endpoints respond correctly
- [ ] Frontend displays properly
- [ ] Database queries are optimized

---

## 🐛 Common Issues

### Issue 1: "Security key is required"
**Cause:** User model doesn't have security key  
**Solution:** Run migration script or reseed database

### Issue 2: "Invalid security key"
**Cause:** Security key doesn't match  
**Solution:** Ensure user is using correct temporary key or their updated key

### Issue 3: "Application validation failed"
**Cause:** Cover letter is missing  
**Solution:** Ensure cover letter is provided in application submission

### Issue 4: Environment validation fails
**Cause:** Missing required environment variables  
**Solution:** Check all required variables are set in `.env`

---

## 📊 Migration Checklist

### Pre-Migration
- [ ] Backup database
- [ ] Backup code
- [ ] Review breaking changes
- [ ] Test in development environment
- [ ] Prepare user communication
- [ ] Schedule maintenance window

### During Migration
- [ ] Stop application
- [ ] Update code
- [ ] Run migration script
- [ ] Verify database changes
- [ ] Test critical flows
- [ ] Update environment variables

### Post-Migration
- [ ] Start application
- [ ] Monitor error logs
- [ ] Test all features
- [ ] Verify user access
- [ ] Send user communications
- [ ] Monitor performance
- [ ] Collect user feedback

---

## 📞 Support

If you encounter issues during migration:

1. **Check Logs:** Review server and database logs
2. **Rollback:** Use rollback procedure if needed
3. **Documentation:** Check PRODUCTION_READINESS.md
4. **GitHub Issues:** Create an issue with details
5. **Email Support:** Contact support team

---

## 🎯 Success Criteria

Migration is successful when:

- ✅ All existing users can login
- ✅ New users can register with security key
- ✅ Password recovery works with security key
- ✅ Applications can be submitted with cover letter
- ✅ No data loss
- ✅ No critical errors
- ✅ Performance is maintained
- ✅ All features work as expected

---

## 📈 Post-Migration Monitoring

### First 24 Hours
- Monitor error rates
- Check user login success rate
- Verify password recovery usage
- Track application submissions

### First Week
- Collect user feedback
- Monitor performance metrics
- Review security logs
- Check database performance

### First Month
- Analyze feature adoption
- Review security incidents
- Optimize based on usage patterns
- Plan next improvements

---

**Migration Version:** 1.0 to 2.0  
**Last Updated:** December 2024  
**Estimated Time:** 30-60 minutes  
**Difficulty:** Medium

---

**Good luck with your migration! 🚀**
