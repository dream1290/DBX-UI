# Debugging Authentication Issues

## 🔍 Quick Diagnosis Steps

### Step 1: Test Backend Directly

Open `test-auth.html` in your browser:
```bash
# From dbxui directory
start test-auth.html
```

This will test:
- ✅ Health endpoint
- ✅ Login endpoint
- ✅ Registration endpoint
- ✅ Profile endpoint

### Step 2: Check Browser Console

Open Developer Tools (F12) and check:

1. **Console Tab** - Look for errors like:
   - `CORS policy` errors
   - `Network request failed`
   - `401 Unauthorized`
   - `400 Bad Request`

2. **Network Tab** - Check the requests:
   - Click on failed requests
   - Check "Headers" tab for request details
   - Check "Response" tab for error messages
   - Check "Preview" tab for formatted response

### Step 3: Verify Environment Variables

```bash
# Check if VITE_API_URL is set
cat .env

# Should show:
# VITE_API_URL=https://dbx-production-3690.up.railway.app
```

### Step 4: Test with cURL

```bash
# Test health
curl https://dbx-production-3690.up.railway.app/health

# Test login
curl -X POST "https://dbx-production-3690.up.railway.app/api/v2/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@dbx.com&password=admin123"

# Test registration
curl -X POST "https://dbx-production-3690.up.railway.app/api/v2/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'
```

## 🐛 Common Issues & Solutions

### Issue 1: "Network request failed"

**Cause:** Backend is down or URL is wrong

**Solution:**
```bash
# Check backend health
curl https://dbx-production-3690.up.railway.app/health

# Should return:
# {"status":"healthy","version":"1.0.0",...}
```

### Issue 2: CORS Error

**Symptoms:**
```
Access to fetch at 'https://...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:**
The backend is configured to allow all origins (`CORS_ORIGINS=["*"]`), so this shouldn't happen. If it does:

1. Check Railway logs:
   ```bash
   cd ../dbx-mpv
   railway logs
   ```

2. Verify CORS middleware is loaded

### Issue 3: "Invalid organization ID"

**Cause:** Sending `null` or invalid organization_id

**Solution:** Already fixed in latest build. The frontend now omits the field entirely.

### Issue 4: "401 Unauthorized"

**Cause:** Token expired or invalid

**Solution:**
```javascript
// Clear tokens and try again
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
// Then login again
```

### Issue 5: "Session expired" on every request

**Cause:** Token not being stored or sent correctly

**Check:**
```javascript
// In browser console
console.log('Access Token:', localStorage.getItem('access_token'));
console.log('Refresh Token:', localStorage.getItem('refresh_token'));
```

## 🧪 Manual Testing in Browser Console

### Test 1: Check API URL
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
// Should show: https://dbx-production-3690.up.railway.app
```

### Test 2: Test Login
```javascript
const formData = new URLSearchParams();
formData.append('username', 'admin@dbx.com');
formData.append('password', 'admin123');

fetch('https://dbx-production-3690.up.railway.app/api/v2/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: formData.toString()
})
.then(r => r.json())
.then(data => {
  console.log('✅ Login Success:', data);
  localStorage.setItem('access_token', data.access_token);
})
.catch(err => console.error('❌ Login Failed:', err));
```

### Test 3: Test Registration
```javascript
fetch('https://dbx-production-3690.up.railway.app/api/v2/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newuser@example.com',
    password: 'password123',
    full_name: 'New User'
    // organization_id is omitted
  })
})
.then(r => r.json())
.then(data => console.log('✅ Register Success:', data))
.catch(err => console.error('❌ Register Failed:', err));
```

### Test 4: Test Profile (after login)
```javascript
const token = localStorage.getItem('access_token');

fetch('https://dbx-production-3690.up.railway.app/api/v2/auth/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('✅ Profile:', data))
.catch(err => console.error('❌ Profile Failed:', err));
```

## 📊 Expected Responses

### Health Check
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development",
  "components": {
    "database": "connected",
    "ai_models": {
      "status": "healthy",
      "ready": true
    }
  }
}
```

### Login Success
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "email": "admin@dbx.com",
    "full_name": "Admin User",
    "role": "admin",
    "is_active": true
  }
}
```

### Registration Success
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "email": "newuser@example.com",
    "full_name": "New User",
    "role": "viewer",
    "is_active": true
  }
}
```

## 🔧 Rebuild & Restart

If nothing works, try a clean rebuild:

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build

# Or for dev
npm run dev
```

## 📝 Checklist

- [ ] Backend is healthy (`/health` returns 200)
- [ ] `.env` file has correct `VITE_API_URL`
- [ ] Frontend is rebuilt after changes
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows requests going to correct URL
- [ ] Tokens are being stored in localStorage
- [ ] Test credentials work: `admin@dbx.com` / `admin123`

## 🆘 Still Not Working?

Please provide:
1. **Exact error message** from browser console
2. **Network request details** (status code, response)
3. **Screenshot** of browser developer tools
4. **Which specific action fails** (login, register, profile, etc.)

This will help diagnose the exact issue!
