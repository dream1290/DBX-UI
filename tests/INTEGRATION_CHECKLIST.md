# ✅ Frontend-Backend Integration Checklist

**Date:** November 12, 2024  
**Status:** 🔧 Integration in Progress

---

## 🎯 Quick Start

### What Was Fixed
1. ✅ Updated API URL from `dbx-system-production.up.railway.app` to `dbxmpv-production.up.railway.app`
2. ✅ Added trailing slashes to required endpoints
3. ✅ Fixed endpoint paths to match backend

### Files Modified
- ✅ `dbxui/.env`
- ✅ `dbxui/.env.example`
- ✅ `dbxui/src/lib/api.ts`

---

## 📋 Integration Steps

### Step 1: Verify Environment Variables ✅
```bash
cd dbxui
cat .env
```

Should show:
```
VITE_API_URL=https://dbxmpv-production.up.railway.app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Test Locally
```bash
npm run dev
```

Visit: http://localhost:5173

### Step 4: Test Authentication
1. Go to login page
2. Use credentials:
   - Email: `admin@dbx.com`
   - Password: `admin123`
3. Should successfully log in and redirect to dashboard

### Step 5: Test Core Features
- [ ] View Dashboard
- [ ] View Aircraft List
- [ ] Create New Aircraft
- [ ] View Analyses
- [ ] View Reports
- [ ] View Notifications
- [ ] View Alerts

### Step 6: Build for Production
```bash
npm run build
```

### Step 7: Deploy
Choose one:
- **Vercel:** `vercel --prod`
- **Netlify:** `netlify deploy --prod --dir=dist`
- **Railway:** `railway up`

---

## 🧪 Testing Guide

### Test 1: API Connection
Open browser console and run:
```javascript
fetch('https://dbxmpv-production.up.railway.app/health')
  .then(r => r.json())
  .then(data => console.log('✅ API Health:', data))
  .catch(err => console.error('❌ API Error:', err))
```

Expected output:
```json
{
  "status": "healthy",
  "version": "4.0.0",
  "environment": "production",
  "components": {
    "database": "connected",
    "ai_models": {
      "status": "healthy",
      "ready": true
    }
  }
}
```

### Test 2: Authentication
```javascript
// Login
const formData = new URLSearchParams();
formData.append('username', 'admin@dbx.com');
formData.append('password', 'admin123');

fetch('https://dbxmpv-production.up.railway.app/api/v2/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: formData
})
  .then(r => r.json())
  .then(data => {
    console.log('✅ Login Success:', data);
    localStorage.setItem('access_token', data.access_token);
  })
  .catch(err => console.error('❌ Login Error:', err))
```

### Test 3: Get Profile
```javascript
const token = localStorage.getItem('access_token');

fetch('https://dbxmpv-production.up.railway.app/api/v2/auth/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(data => console.log('✅ Profile:', data))
  .catch(err => console.error('❌ Profile Error:', err))
```

### Test 4: List Aircraft
```javascript
const token = localStorage.getItem('access_token');

fetch('https://dbxmpv-production.up.railway.app/api/v2/aircraft', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(data => console.log('✅ Aircraft:', data))
  .catch(err => console.error('❌ Aircraft Error:', err))
```

### Test 5: List Reports (with trailing slash)
```javascript
const token = localStorage.getItem('access_token');

fetch('https://dbxmpv-production.up.railway.app/api/v2/reports/', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(data => console.log('✅ Reports:', data))
  .catch(err => console.error('❌ Reports Error:', err))
```

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Symptom:** Browser console shows CORS policy error

**Solution:** Add your frontend URL to backend CORS_ORIGINS:
```bash
# On Railway backend, add environment variable:
CORS_ORIGINS=https://your-frontend.vercel.app,https://dbxmpv-production.up.railway.app
```

### Issue: 401 Unauthorized
**Symptom:** All API calls return 401

**Solutions:**
1. Check if token is stored: `localStorage.getItem('access_token')`
2. Try logging in again
3. Check token expiration
4. Verify Authorization header format: `Bearer <token>`

### Issue: 404 Not Found
**Symptom:** Specific endpoints return 404

**Solutions:**
1. Check if endpoint has trailing slash (reports, notifications, alerts, api-keys)
2. Verify endpoint path matches backend
3. Check API documentation: https://dbxmpv-production.up.railway.app/docs

### Issue: Network Error
**Symptom:** "Network error" or "Failed to fetch"

**Solutions:**
1. Verify API URL is correct: `https://dbxmpv-production.up.railway.app`
2. Check if backend is running: https://dbxmpv-production.up.railway.app/health
3. Check browser network tab for actual error
4. Verify no typos in API_BASE_URL

---

## 📊 Endpoint Status

### ✅ Working Endpoints (Tested)
- `POST /api/v2/auth/login` - Login
- `GET /api/v2/auth/profile` - Get profile
- `GET /api/v2/users` - List users
- `GET /api/v2/organizations` - List organizations
- `GET /api/v2/aircraft` - List aircraft
- `GET /api/v2/analyses/` - List analyses
- `GET /api/v2/reports/` - List reports
- `GET /api/v2/notifications/` - List notifications
- `GET /api/v2/alerts/` - List alerts
- `GET /api/v2/api-keys/` - List API keys
- `GET /api/v2/system/status` - System status
- `GET /health` - Health check

### ⚠️ Endpoints Requiring Trailing Slash
- `/api/v2/reports/` ✅
- `/api/v2/notifications/` ✅
- `/api/v2/alerts/` ✅
- `/api/v2/api-keys/` ✅
- `/api/v2/analyses/` ✅

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Environment variables set correctly
- [ ] Build completes without errors
- [ ] No console errors in browser

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd dbxui
vercel

# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://dbxmpv-production.up.railway.app

# Deploy to production
vercel --prod
```

### Netlify Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Set environment variables in Netlify dashboard:
# VITE_API_URL=https://dbxmpv-production.up.railway.app
```

### Post-Deployment
- [ ] Test login on production URL
- [ ] Test all major features
- [ ] Check browser console for errors
- [ ] Verify API calls are going to correct URL
- [ ] Test on mobile devices
- [ ] Update CORS on backend if needed

---

## 📞 Support & Resources

### Backend API
- **Production URL:** https://dbxmpv-production.up.railway.app
- **API Docs:** https://dbxmpv-production.up.railway.app/docs
- **Health Check:** https://dbxmpv-production.up.railway.app/health

### Test Credentials
```
Admin:
  Email: admin@dbx.com
  Password: admin123

Analyst:
  Email: analyst@dbx.com
  Password: analyst123
```

### Documentation
- **Integration Guide:** `/FRONTEND_BACKEND_INTEGRATION.md`
- **API Guide:** `/FRONTEND_INTEGRATION_GUIDE.md`
- **Endpoint Report:** `/ENDPOINT_TEST_REPORT.md`

### Quick Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test:api

# Lint code
npm run lint
```

---

## ✨ Success Criteria

### ✅ Integration Complete When:
- [ ] Frontend connects to correct API URL
- [ ] Login works with test credentials
- [ ] Dashboard loads without errors
- [ ] All major features accessible
- [ ] No CORS errors
- [ ] No 404 errors on known endpoints
- [ ] Token refresh works automatically
- [ ] Logout clears all data
- [ ] Production build deploys successfully
- [ ] Mobile responsive works

---

## 🎉 Next Steps

1. **Test Locally:**
   ```bash
   cd dbxui
   npm install
   npm run dev
   ```

2. **Login with:**
   - Email: admin@dbx.com
   - Password: admin123

3. **Verify Features:**
   - Dashboard loads
   - Aircraft list shows
   - Can create new aircraft
   - Reports accessible
   - Notifications work

4. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

5. **Update Backend CORS:**
   Add your frontend URL to CORS_ORIGINS on Railway

**Your integration is ready! Just test and deploy! 🚀**
