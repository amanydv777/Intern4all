# Render Frontend Deployment Instructions

## The Problem
Your build is succeeding, but Render can't find the `build` directory because of manual configuration issues.

## Solution: Manual Dashboard Configuration

Since you're deploying manually (not using Blueprint), configure these settings in your Render dashboard:

### 1. Service Settings
- **Name**: intern4all-frontend
- **Environment**: Static Site
- **Branch**: main

### 2. Build & Deploy Settings
- **Build Command**: 
  ```
  npm install && npm run build
  ```

- **Publish Directory**: 
  ```
  build
  ```
  ⚠️ **IMPORTANT**: Use `build` NOT `./build` or `/build`

### 3. Environment Variables
Add these in the "Environment" section:
- `CI` = `false`
- `REACT_APP_API_URL` = `https://intern4all-backend.onrender.com/api`
- `NODE_VERSION` = `22.16.0`

### 4. Advanced Settings
- **Auto-Deploy**: Yes
- **Root Directory**: Leave empty (or set to `.` if required)

## Alternative: Use Render Blueprint

If you want to use the `render.yaml` file instead:

1. Delete your current static site service in Render
2. Create a new service using "Blueprint"
3. Select your repository
4. Render will automatically read the `render.yaml` file

## Troubleshooting

If it still fails:
1. Check that you're deploying from the root of the repository (not from a subdirectory)
2. Verify the "Publish Directory" is exactly `build` with no extra characters
3. Make sure "Root Directory" is empty or set to `.`
4. Check the build logs to confirm the build folder is created successfully

## Current Status
- ✅ Build succeeds
- ✅ Build folder is created
- ❌ Render can't find the build folder (configuration issue)
