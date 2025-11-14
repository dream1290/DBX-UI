# DBX Aviation Analytics - Frontend Deployment Guide

Your frontend is **built and ready for deployment**! The production build is in the `dist` folder.

## Backend Configuration ✅
- **Backend URL**: https://dbx-system-production.up.railway.app/
- **Status**: Already configured in `.env` file

## Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)
1. Visit https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository: https://github.com/dream1290/dbxui
5. Vercel will auto-detect Vite configuration
6. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: `https://dbx-system-production.up.railway.app`
7. Click "Deploy"
8. Your app will be live in ~2 minutes!

### Option 2: Netlify (Alternative)
1. Visit https://app.netlify.com
2. Sign up/Login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://dbx-system-production.up.railway.app`
7. Click "Deploy site"

### Option 3: Netlify Drop (No Account Needed)
1. Visit https://app.netlify.com/drop
2. Drag and drop your `dist` folder onto the page
3. Your site will be instantly deployed with a random URL
4. Note: This is temporary - claim the site to make it permanent

### Option 4: Railway (Same as Backend)
1. Visit https://railway.app
2. Create new project
3. Deploy from GitHub repository
4. Add environment variable:
   - `VITE_API_URL`: `https://dbx-system-production.up.railway.app`
5. Railway will auto-build and deploy

### Option 5: GitHub Pages (Free)
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json` scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. Update `vite.config.ts` to add base path:
   ```typescript
   export default defineConfig({
     base: '/dbxui/',  // Your repo name
     // ... rest of config
   })
   ```

4. Run:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages in repository settings
6. Your app will be at: https://dream1290.github.io/dbxui/

## Manual Deployment (Any Static Host)

Since your build is ready in the `dist` folder, you can upload it to any static hosting service:

### Files to Upload
Upload the entire contents of the `dist` folder:
- `index.html`
- `assets/` folder (contains JS, CSS, and images)

### Compatible Hosting Services
- **Cloudflare Pages**: https://pages.cloudflare.com
- **Surge.sh**: https://surge.sh
- **Render**: https://render.com
- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**

## Post-Deployment Checklist

1. ✅ **Test Authentication**
   - Try login/register
   - Verify token refresh works

2. ✅ **Test API Connection**
   - Check if data loads from backend
   - Verify CORS is working

3. ✅ **Test Core Features**
   - Upload flight data
   - View analyses
   - Check real-time updates

4. ✅ **Mobile Responsiveness**
   - Test on mobile devices
   - Check touch interactions

5. ✅ **Performance**
   - Run Lighthouse audit
   - Check load times

## Environment Variables

Make sure these are set in your deployment platform:
```
VITE_API_URL=https://dbx-system-production.up.railway.app
```

## CORS Configuration

Your backend at https://dbx-system-production.up.railway.app should allow your frontend domain. Common CORS headers needed:
```
Access-Control-Allow-Origin: [your-frontend-url]
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## Troubleshooting

### API Connection Issues
- Check browser console for CORS errors
- Verify VITE_API_URL is set correctly
- Test backend directly: https://dbx-system-production.up.railway.app/health

### Build Issues
- Clear node_modules and reinstall: `npm ci`
- Clear build cache: `rm -rf dist`
- Rebuild: `npm run build`

### Authentication Issues
- Check if tokens are being stored in localStorage
- Verify refresh token endpoint works
- Check CORS allows credentials

## Quick Deploy Commands

```bash
# Vercel
npx vercel --prod

# Netlify
npx netlify deploy --prod --dir dist

# Surge
npx surge dist

# GitHub Pages
npm run deploy
```

## Your Build is Ready! 🚀

Your production build in the `dist` folder is optimized and ready to deploy. Choose any of the options above based on your preference. Vercel and Netlify are the easiest with automatic CI/CD from your GitHub repository.

**Estimated deployment time**: 2-5 minutes

**Your backend is ready at**: https://dbx-system-production.up.railway.app/
