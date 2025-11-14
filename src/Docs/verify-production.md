# Production Verification Checklist

## Pre-Deployment Verification

### 1. Environment Configuration ✅
- [x] `.env` file created with production URL
- [x] `VITE_API_URL=https://dbx-system-production.up.railway.app`
- [x] API service configured to use environment variable

### 2. Backend API Health Check

Test the backend is accessible:

```bash
# Health check
curl https://dbx-system-production.up.railway.app/health

# Expected response: {"status": "healthy"} or similar
```

### 3. Build Test

```bash
# Install dependencies
npm install

# Run build
npm run build

# Check for errors - build should complete successfully
# Check dist/ folder is created with files
```

### 4. Local Production Preview

```bash
# Preview production build locally
npm run preview

# Open http://localhost:4173
# Test all functionality
```

## Post-Deployment Verification

### Authentication Flow
- [ ] Navigate to `/login`
- [ ] Enter credentials
- [ ] Verify successful login
- [ ] Check token stored in localStorage
- [ ] Verify redirect to appropriate dashboard based on role

### API Integration
- [ ] Open browser DevTools → Network tab
- [ ] Navigate through application
- [ ] Verify all API calls go to `https://dbx-system-production.up.railway.app`
- [ ] Check for 200 status codes
- [ ] Verify no CORS errors

### Role-Based Access Control
- [ ] Login as System Administrator
  - [ ] Can access all pages
  - [ ] Sidebar shows all menu items
- [ ] Login as Safety Analyst
  - [ ] Can access: Dashboard, Flight Analysis, Upload, Reports
  - [ ] Cannot access: User Management, System Admin
- [ ] Login as Fleet Manager
  - [ ] Can access: Dashboard, Fleet, Organizations
  - [ ] Cannot access: Flight Analysis, User Management
- [ ] Login as Data Analyst
  - [ ] Can access: Dashboard, Analysis, Reports, API Keys
  - [ ] Cannot access: Fleet, User Management
- [ ] Login as Viewer
  - [ ] Can access: Dashboard, Flight Analysis (read-only)
  - [ ] Cannot access: Upload, Reports, Management pages

### Core Features
- [ ] **Dashboard**
  - [ ] Metrics load from API
  - [ ] Auto-refresh works (30s)
  - [ ] Charts render correctly
  
- [ ] **Flight Analysis**
  - [ ] Flights list loads
  - [ ] Search works
  - [ ] Filters work
  - [ ] Infinite scroll / Load More works
  - [ ] Export to CSV works
  - [ ] Flight details modal opens
  
- [ ] **Fleet Management**
  - [ ] Aircraft list loads
  - [ ] Add aircraft modal works
  - [ ] Edit aircraft works
  - [ ] Delete aircraft works (with confirmation)
  
- [ ] **Upload Data**
  - [ ] File upload works
  - [ ] Progress indicator shows
  - [ ] Analysis starts after upload
  - [ ] Recent uploads display
  
- [ ] **Reports**
  - [ ] Reports list loads
  - [ ] Generate report works
  - [ ] Export PDF works
  - [ ] Export CSV works
  
- [ ] **User Management** (Admin only)
  - [ ] Users list loads
  - [ ] Add user works
  - [ ] Edit user works
  - [ ] Delete user works
  - [ ] Activity log loads
  
- [ ] **Organizations** (Admin/Fleet Manager)
  - [ ] Organizations list loads
  - [ ] Create organization works
  - [ ] Edit organization works
  - [ ] Delete organization works
  
- [ ] **System Admin** (Admin only)
  - [ ] System metrics load
  - [ ] Services status shows
  - [ ] System logs display
  - [ ] Settings can be updated
  
- [ ] **Notifications**
  - [ ] Notifications load
  - [ ] Unread count shows in header
  - [ ] Mark as read works
  - [ ] Delete notification works
  - [ ] Auto-refresh works (30s)
  
- [ ] **Profile**
  - [ ] Profile data loads
  - [ ] Edit mode works
  - [ ] Save changes works
  - [ ] Profile updates reflect immediately

### Real-Time Features
- [ ] Dashboard auto-refreshes every 30 seconds
- [ ] System metrics update every 10 seconds
- [ ] Notifications poll every 30 seconds
- [ ] Notification badge updates in real-time

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] 401 errors redirect to login
- [ ] 403 errors show access denied
- [ ] 500 errors show retry option
- [ ] Form validation errors display correctly

### Performance
- [ ] Initial page load < 3 seconds
- [ ] API calls complete < 2 seconds
- [ ] No console errors
- [ ] No console warnings (except dev warnings)
- [ ] Smooth transitions and animations
- [ ] No layout shifts during loading

### Mobile Responsiveness
- [ ] Test on mobile viewport (375px width)
- [ ] Sidebar collapses to hamburger menu
- [ ] All pages are readable
- [ ] Buttons are tappable
- [ ] Forms are usable
- [ ] Tables scroll horizontally if needed

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Security
- [ ] HTTPS enabled
- [ ] Tokens stored in localStorage
- [ ] Token refresh works automatically
- [ ] Logout clears all data
- [ ] Protected routes require authentication
- [ ] Role-based access enforced

## Common Issues and Solutions

### Issue: API calls fail with CORS error
**Solution:** 
- Check backend CORS settings
- Ensure frontend domain is in allowed origins
- Verify `VITE_API_URL` is correct

### Issue: Login works but redirects to 404
**Solution:**
- Check routing configuration
- Verify user role is set correctly
- Check default route for user role

### Issue: Blank page after deployment
**Solution:**
- Check browser console for errors
- Verify build completed successfully
- Check hosting configuration (SPA routing)
- Ensure environment variables are set

### Issue: Images or assets not loading
**Solution:**
- Check asset paths are relative
- Verify assets are in `dist/` after build
- Check hosting serves static files correctly

### Issue: Token refresh fails
**Solution:**
- Check refresh token endpoint
- Verify refresh token is stored
- Check token expiration times
- Verify backend refresh logic

## Production Metrics

### Target Performance
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Lighthouse Performance:** > 90
- **Lighthouse Accessibility:** > 95
- **Lighthouse Best Practices:** > 90
- **Lighthouse SEO:** > 90

### Monitor These Metrics
- API response times
- Error rates
- User session duration
- Page load times
- Bundle size
- Cache hit rates

## Rollback Procedure

If critical issues are found:

1. **Immediate:** Revert to previous deployment
2. **Investigate:** Check logs and error reports
3. **Fix:** Address issues in development
4. **Test:** Verify fixes locally
5. **Redeploy:** Deploy fixed version

## Sign-Off

- [ ] All verification steps completed
- [ ] No critical issues found
- [ ] Performance metrics acceptable
- [ ] Security checks passed
- [ ] Documentation updated
- [ ] Team notified of deployment

**Deployed By:** _________________
**Date:** _________________
**Version:** _________________
**Backend URL:** https://dbx-system-production.up.railway.app
**Frontend URL:** _________________

---

## Quick Test Script

```bash
# 1. Check backend health
curl https://dbx-system-production.up.railway.app/health

# 2. Build frontend
npm run build

# 3. Preview locally
npm run preview

# 4. Open browser to http://localhost:4173
# 5. Test login and core features
# 6. Check browser console for errors
# 7. Deploy to production
```

## Success Criteria

✅ All API endpoints responding
✅ Authentication working
✅ Role-based access working
✅ All core features functional
✅ No console errors
✅ Performance metrics good
✅ Mobile responsive
✅ Cross-browser compatible

**Status:** Ready for Production ✅
