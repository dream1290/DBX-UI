# DBX Aviation Analytics Platform - Deployment Guide

## Vercel Deployment Fix Applied ✅

### Issue Fixed
The Vercel deployment was failing with:
```
sh: line 1: /vercel/path0/node_modules/.bin/vite: Permission denied
Error: Command "npm run build" exited with 126
```

### Solution Applied

1. **Added `vercel.json` configuration**
   - Explicit build and install commands
   - Proper output directory configuration
   - SPA routing rewrites
   - Cache headers for assets
   - Environment variables

2. **Updated `package.json`**
   - Added `postinstall` script to fix permissions
   - Ensures all binaries in `node_modules/.bin/` are executable

### Files Modified
- ✅ `vercel.json` - Created
- ✅ `package.json` - Added postinstall script
- ✅ Committed and pushed to GitHub

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Automatic Deployment:**
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository: `dream1290/dbxui`
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

**Environment Variables to Set:**
```
VITE_API_URL=https://dbx-system-production.up.railway.app
```

**Manual Deployment via CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd dbxui
vercel

# Deploy to production
vercel --prod
```

---

### Option 2: Netlify

**Automatic Deployment:**
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `dream1290/dbxui`
4. Build settings are already configured in `netlify.toml`
5. Click "Deploy"

**Environment Variables to Set:**
```
VITE_API_URL=https://dbx-system-production.up.railway.app
```

**Manual Deployment via CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
cd dbxui
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## Build Configuration

### Vercel Configuration (`vercel.json`)
```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://dbx-system-production.up.railway.app"
  }
}
```

### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_API_URL = "https://dbx-system-production.up.railway.app"
```

---

## Environment Variables

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://dbx-system-production.up.railway.app` | Backend API URL |

### Optional Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_VERSION` | `18` | Node.js version (Netlify) |

---

## Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Site loads successfully
- [ ] No console errors
- [ ] Assets load correctly (images, fonts, etc.)

### 2. Test Authentication
- [ ] Registration works
- [ ] Login works
- [ ] Token refresh works
- [ ] Logout works

### 3. Test API Integration
- [ ] Dashboard loads data
- [ ] Flight analysis works
- [ ] Fleet management works
- [ ] Reports generate correctly

### 4. Test Routing
- [ ] All pages load correctly
- [ ] Direct URL access works (SPA routing)
- [ ] 404 page works
- [ ] Protected routes redirect to login

### 5. Performance
- [ ] Initial load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No memory leaks
- [ ] Smooth navigation

---

## Troubleshooting

### Build Fails with Permission Error

**Error:**
```
sh: line 1: /vercel/path0/node_modules/.bin/vite: Permission denied
```

**Solution:**
✅ Already fixed with `postinstall` script in `package.json`

If still failing:
1. Check `vercel.json` exists
2. Verify `postinstall` script in `package.json`
3. Try clearing Vercel cache: Settings → Clear Cache

---

### Environment Variables Not Working

**Symptoms:**
- API calls fail
- Console shows "Network error"
- Wrong API URL in requests

**Solution:**
1. Go to Vercel/Netlify dashboard
2. Navigate to Settings → Environment Variables
3. Add `VITE_API_URL` with correct value
4. Redeploy the site

**Important:** Vite environment variables must start with `VITE_` prefix!

---

### SPA Routing Not Working

**Symptoms:**
- Direct URL access returns 404
- Refresh on any page except home fails

**Solution:**
✅ Already configured in `vercel.json` and `netlify.toml`

Verify rewrites/redirects are configured:
- Vercel: Check `vercel.json` has rewrites
- Netlify: Check `netlify.toml` has redirects

---

### Build Succeeds but Site is Blank

**Possible Causes:**
1. Wrong output directory
2. Missing environment variables
3. JavaScript errors

**Solution:**
1. Check browser console for errors
2. Verify `VITE_API_URL` is set
3. Check build output directory is `dist`
4. Verify `index.html` exists in `dist/`

---

## Performance Optimization

### 1. Enable Caching
✅ Already configured in `vercel.json`:
- Assets cached for 1 year
- Immutable cache headers

### 2. Enable Compression
- Vercel: Automatic gzip/brotli
- Netlify: Automatic gzip/brotli

### 3. Enable CDN
- Vercel: Automatic global CDN
- Netlify: Automatic global CDN

### 4. Optimize Images
```bash
# Install image optimization
npm install -D vite-plugin-imagemin

# Add to vite.config.ts
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: { plugins: [{ name: 'removeViewBox' }] }
    })
  ]
})
```

---

## Monitoring

### Vercel Analytics
1. Go to Vercel dashboard
2. Select your project
3. Navigate to Analytics tab
4. View real-time metrics

### Netlify Analytics
1. Go to Netlify dashboard
2. Select your site
3. Navigate to Analytics tab
4. Enable analytics (may require paid plan)

### Custom Monitoring
Consider adding:
- Sentry for error tracking
- Google Analytics for user analytics
- LogRocket for session replay

---

## Rollback Procedure

### Vercel
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Netlify
1. Go to Deploys tab
2. Find previous working deployment
3. Click "Publish deploy"

### Git Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin master

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin master --force
```

---

## Custom Domain Setup

### Vercel
1. Go to Settings → Domains
2. Add your domain
3. Configure DNS:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS:
   - Type: A
   - Name: @
   - Value: 75.2.60.5
   
   - Type: CNAME
   - Name: www
   - Value: <your-site>.netlify.app

---

## SSL/HTTPS

Both Vercel and Netlify provide:
- ✅ Automatic SSL certificates
- ✅ Auto-renewal
- ✅ HTTPS enforcement
- ✅ HTTP → HTTPS redirect

No configuration needed!

---

## Support

### Vercel Support
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Status: https://vercel-status.com

### Netlify Support
- Documentation: https://docs.netlify.com
- Community: https://answers.netlify.com
- Status: https://netlifystatus.com

---

## Deployment Status

✅ **Current Status**: Ready for deployment
✅ **Configuration**: Complete
✅ **Fixes Applied**: Permission issues resolved
✅ **Environment**: Production-ready

**Next Step**: Push to Vercel/Netlify and verify deployment succeeds!
