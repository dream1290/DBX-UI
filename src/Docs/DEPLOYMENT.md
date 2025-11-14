# Production Deployment Guide

## Backend API

**Production URL:** `https://dbx-system-production.up.railway.app`

The backend is deployed on Railway and provides all API endpoints for the application.

## Frontend Deployment

### Prerequisites

1. Node.js 18+ installed
2. npm or yarn package manager
3. Backend API running at `https://dbx-system-production.up.railway.app`

### Environment Configuration

1. **Create `.env` file** (already configured):
```env
VITE_API_URL=https://dbx-system-production.up.railway.app
NODE_ENV=production
```

2. **Verify API connectivity**:
```bash
curl https://dbx.up.railway.app/health
```

Expected response: `{"status": "healthy"}` or similar

### Build for Production

1. **Install dependencies**:
```bash
npm install
```

2. **Build the application**:
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

3. **Preview the build locally** (optional):
```bash
npm run preview
```

### Deployment Options

#### Option 1: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` = `https://dbx.up.railway.app`

#### Option 2: Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod --dir=dist
```

3. Set environment variables in Netlify dashboard:
   - `VITE_API_URL` = `https://dbx.up.railway.app`

#### Option 3: Deploy to Railway (Frontend)

1. Create `railway.toml`:
```toml
[build]
builder = "nixpacks"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm run preview"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
```

2. Deploy via Railway CLI or GitHub integration

#### Option 4: Static Hosting (AWS S3, Cloudflare Pages, etc.)

1. Build the app: `npm run build`
2. Upload `dist/` folder contents to your hosting provider
3. Configure environment variables in hosting dashboard

### Post-Deployment Checklist

- [ ] Verify frontend loads at deployment URL
- [ ] Test login functionality
- [ ] Verify API calls work (check Network tab)
- [ ] Test all protected routes
- [ ] Verify role-based access control
- [ ] Test file upload functionality
- [ ] Check real-time updates (notifications, metrics)
- [ ] Verify export functionality (CSV, PDF)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

### Environment Variables

| Variable | Description | Production Value |
|----------|-------------|------------------|
| `VITE_API_URL` | Backend API base URL | `https://dbx.up.railway.app` |
| `NODE_ENV` | Environment mode | `production` |

### API Endpoints

All API endpoints are prefixed with `/api/v2/`:

**Authentication:**
- `POST /api/v2/auth/login`
- `POST /api/v2/auth/register`
- `POST /api/v2/auth/logout`
- `POST /api/v2/auth/refresh`
- `GET /api/v2/auth/profile`

**Flight Analysis:**
- `GET /api/v2/analyses`
- `POST /api/v2/analyze`
- `GET /api/v2/analyses/:id`
- `DELETE /api/v2/analyses/:id`
- `GET /api/v2/analyses/export`

**Fleet Management:**
- `GET /api/v2/aircraft`
- `POST /api/v2/aircraft`
- `GET /api/v2/aircraft/:id`
- `PUT /api/v2/aircraft/:id`
- `DELETE /api/v2/aircraft/:id`

**User Management:**
- `GET /api/v2/users`
- `POST /api/v2/users`
- `GET /api/v2/users/:id`
- `PUT /api/v2/users/:id`
- `DELETE /api/v2/users/:id`
- `GET /api/v2/users/activity`

**Organizations:**
- `GET /api/v2/organizations`
- `POST /api/v2/organizations`
- `GET /api/v2/organizations/:id`
- `PUT /api/v2/organizations/:id`
- `DELETE /api/v2/organizations/:id`

**Reports:**
- `GET /api/v2/reports`
- `POST /api/v2/reports`
- `GET /api/v2/reports/:id`
- `GET /api/v2/reports/:id/pdf`
- `GET /api/v2/reports/:id/csv`

**System:**
- `GET /api/v2/system/status`
- `GET /api/v2/system/metrics`
- `GET /api/v2/system/health-detailed`
- `GET /api/v2/system/logs`
- `GET /api/v2/system/settings`
- `PUT /api/v2/system/settings`

**Notifications:**
- `GET /api/v2/notifications`
- `PUT /api/v2/notifications/:id/read`
- `DELETE /api/v2/notifications/:id`
- `POST /api/v2/notifications/mark-all-read`

### CORS Configuration

Ensure the backend allows requests from your frontend domain:

```python
# Backend CORS settings
ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Development
    "https://your-frontend-domain.com",  # Production
]
```

### Troubleshooting

#### API Connection Issues

**Problem:** Frontend can't connect to backend

**Solutions:**
1. Verify `VITE_API_URL` is set correctly
2. Check backend is running: `curl https://dbx.up.railway.app/health`
3. Check browser console for CORS errors
4. Verify backend CORS settings allow your frontend domain

#### Authentication Issues

**Problem:** Login fails or token refresh doesn't work

**Solutions:**
1. Check backend `/api/v2/auth/login` endpoint
2. Verify JWT token is being stored in localStorage
3. Check token expiration settings
4. Verify refresh token endpoint is working

#### Build Errors

**Problem:** `npm run build` fails

**Solutions:**
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check for TypeScript errors: `npm run lint`
4. Verify all dependencies are installed

#### Performance Issues

**Problem:** Slow page loads or API calls

**Solutions:**
1. Enable gzip compression on hosting
2. Use CDN for static assets
3. Check backend response times
4. Verify React Query caching is working
5. Check Network tab for slow requests

### Monitoring

#### Frontend Monitoring

- Use browser DevTools Performance tab
- Monitor bundle size: `npm run build` shows sizes
- Check Lighthouse scores
- Monitor error rates in browser console

#### Backend Monitoring

- Monitor Railway dashboard for backend health
- Check API response times
- Monitor error rates
- Check database connection pool

### Security Checklist

- [ ] HTTPS enabled on both frontend and backend
- [ ] Environment variables not exposed in client code
- [ ] CORS properly configured
- [ ] JWT tokens stored securely (localStorage)
- [ ] Token refresh mechanism working
- [ ] API rate limiting enabled
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF protection for state-changing operations

### Performance Optimization

1. **Code Splitting**: Already implemented via React Router
2. **Lazy Loading**: Components loaded on demand
3. **Image Optimization**: Use WebP format where possible
4. **Caching**: React Query handles API caching
5. **Bundle Size**: Monitor with `npm run build`

### Rollback Plan

If deployment fails:

1. **Revert to previous version**:
   - Vercel/Netlify: Use dashboard to rollback
   - Railway: Redeploy previous commit

2. **Check logs**:
   - Frontend: Browser console
   - Backend: Railway logs

3. **Verify environment variables**:
   - Ensure `VITE_API_URL` is correct
   - Check all required variables are set

### Support

For issues or questions:
- Check documentation: `README.md`, `MIGRATION.md`, `ROLE_BASED_ROUTING.md`
- Review API integration: `src/hooks/api/README.md`
- Check backend logs in Railway dashboard

## Quick Start Commands

```bash
# Development
npm install
npm run dev

# Production Build
npm run build
npm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## Success Criteria

✅ Frontend loads without errors
✅ Login/logout works
✅ All API calls succeed
✅ Role-based routing works
✅ Real-time updates function
✅ File uploads work
✅ Export features work
✅ Mobile responsive
✅ Performance metrics good (Lighthouse > 90)
✅ No console errors

---

**Production Backend:** https://dbx.up.railway.app
**Last Updated:** 2024
