# Deployment Guide - Render

This guide explains how to deploy your Campaign Management application to Render.

## Why Render is Perfect for This App

- **Single Service**: Deploy your entire Express + React app as one service
- **Built-in Database**: Render offers PostgreSQL databases with easy connection
- **Simpler Setup**: No need to convert to serverless functions
- **Better for Express**: Keeps your existing Express server structure intact

## Prerequisites

1. GitHub account
2. Render account (free to start)
3. Your code pushed to GitHub repository

## Step 1: Prepare Your Repository

Make sure your repository has these files:
- `render.yaml` (already created)
- Your existing `package.json` 
- All your application code

## Step 2: Create Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Choose a name: `campaign-db`
4. Select the free tier
5. Click "Create Database"
6. **Important**: Save the connection details (you'll need the DATABASE_URL)

## Step 3: Deploy Your Application

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub including the `render.yaml` file
2. In Render Dashboard, click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` and create:
   - Web service for your app
   - PostgreSQL database
   - Environment variables

### Option B: Manual Setup

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Node Version**: 18+ (latest)

## Step 4: Set Environment Variables

In your Render service settings, add:

```
NODE_ENV=production
DATABASE_URL=[your-postgres-connection-string-from-step-2]
```

## Step 5: Deploy

1. Click "Create Web Service"
2. Render will:
   - Install dependencies
   - Build your React frontend
   - Bundle your Express backend
   - Start your server

## Step 6: Configure Database Schema

Once deployed, you'll need to set up your database tables:

1. In Render Dashboard, go to your PostgreSQL database
2. Click "Connect" → "External Connection"
3. Use the provided connection details to run your migrations

## Expected Build Process

When you deploy, Render will:
1. Run `npm ci` to install dependencies
2. Run `npm run build` which:
   - Builds React frontend with Vite → `dist/public/`
   - Bundles Express backend with ESBuild → `dist/index.js`
3. Start with `npm start` → runs `node dist/index.js`

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure build commands work locally first

### Database Connection Issues
- Verify DATABASE_URL is set correctly
- Check that database allows external connections

### Static Files Not Loading
- Your Express server already serves static files from `dist/public`
- Make sure the build process completes successfully

## Production Considerations

1. **Database Migration**: Set up proper database migration process
2. **Environment Variables**: Keep sensitive data in Render environment variables
3. **Monitoring**: Use Render's built-in logging and monitoring
4. **Scaling**: Render can auto-scale based on traffic

Your app will be available at: `https://your-app-name.onrender.com`

## Cost

- **Web Service**: Free tier available (with limitations)
- **PostgreSQL**: Free tier includes 1GB storage
- **Upgrades**: Available for higher traffic/storage needs

This setup maintains your current architecture while providing a production-ready deployment platform.