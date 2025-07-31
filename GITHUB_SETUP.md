# How to Push Your Code to GitHub

## Method 1: Using Replit's Built-in Git (Recommended)

### Step 1: Initialize Git Repository
1. Open the Shell in Replit (bottom panel)
2. Run these commands:

```bash
git init
git add .
git commit -m "Initial commit - Campaign Management System"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it: `campaign-management-system`
4. Keep it **Public** (for free Render deployment)
5. **Don't** initialize with README (your code already has files)
6. Click "Create repository"

### Step 3: Connect and Push
1. Copy the repository URL from GitHub (looks like: `https://github.com/yourusername/campaign-management-system.git`)
2. In Replit Shell, run:

```bash
git remote add origin https://github.com/yourusername/campaign-management-system.git
git branch -M main
git push -u origin main
```

## Method 2: Using Replit's GitHub Integration

### Step 1: Connect GitHub Account
1. In Replit, click your profile → "Account"
2. Go to "Connected accounts"
3. Connect your GitHub account

### Step 2: Export to GitHub
1. In your Replit project, click the three dots menu
2. Select "Publish to GitHub"
3. Choose repository name: `campaign-management-system`
4. Click "Publish"

## Method 3: Download and Upload

### Step 1: Download Project
1. In Replit, click the three dots menu
2. Select "Download as zip"
3. Extract the zip file on your computer

### Step 2: Upload to GitHub
1. Create new repository on GitHub
2. Click "uploading an existing file"
3. Drag and drop all your project files
4. Commit the changes

## Important Files to Include

Make sure these files are in your repository:
- ✅ `render.yaml` (deployment config)
- ✅ `DEPLOYMENT.md` (deployment guide)
- ✅ `.env.example` (environment template)
- ✅ All your source code (`client/`, `server/`, `shared/`)
- ✅ `package.json` and `package-lock.json`

## Files to Exclude (.gitignore)

Your project already has a `.gitignore` file that excludes:
- `node_modules/`
- `dist/`
- `.env` (sensitive data)
- Build artifacts

## After Pushing to GitHub

1. **Verify Upload**: Check that all files appear on GitHub
2. **Ready for Render**: Your repository is now ready for deployment
3. **Follow Deployment Guide**: Use the `DEPLOYMENT.md` guide to deploy on Render

## Troubleshooting

### "Permission denied" Error
- Use personal access token instead of password
- Generate one at: GitHub → Settings → Developer settings → Personal access tokens

### "Repository already exists" Error
- The repo name is taken, choose a different name
- Or delete the existing empty repository first

### Missing Files
- Check that `.gitignore` isn't excluding important files
- Use `git status` to see what's being tracked

## Next Steps

Once your code is on GitHub:
1. Follow the `DEPLOYMENT.md` guide
2. Deploy to Render using the repository URL
3. Your app will be live within minutes!

Your GitHub repository URL will be:
`https://github.com/yourusername/campaign-management-system`