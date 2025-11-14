# DBX Aviation System - Frontend Authentication Requirements

## ✅ CONFIRMED WORKING AUTHENTICATION FLOW

Based on actual testing, here's exactly what the frontend needs to send for each authentication endpoint:

---

## 1. USER REGISTRATION ✅ Working

### Endpoint
```
POST /api/v2/auth/register
```

### Frontend Must Send
```javascript
// Headers
Content-Type: application/json

// Body (JSON)
{
  "email": "user@example.com",        // REQUIRED - valid email format
  "password": "SecurePass123!",       // REQUIRED - min 8 characters
  "full_name": "John Doe",            // REQUIRED - user's full name
  "organization": "Airline Name",     // OPTIONAL - defaults to "Default Organization"
  "role": "user"                      // OPTIONAL - defaults to "user"
}
```

### Response (Success - 201)
```json
{
  "access_token": "eyJhbGci...",     // JWT token (expires in 30 min)
  "refresh_token": "eyJhbGci...",    // Refresh token (expires in 7 days)
  "token_type": "bearer"
}
```

### Common Errors
- **500**: Organization code already exists (use unique org name)
- **400**: Email already registered
- **422**: Missing required fields or invalid email format

### Frontend Implementation
```javascript
async function register(email, password, fullName, organization = null) {
  const response = await fetch('http://localhost:8000/api/v2/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      organization: organization || `Org_${Date.now()}`, // Make unique
      role: 'user'
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    // Store tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  }
  throw new Error(await response.text());
}
```

---

## 2. USER LOGIN ✅ Working

### Endpoint
```
POST /api/v2/auth/login
```

### ⚠️ CRITICAL: Must use Form-Data, NOT JSON!

### Frontend Must Send
```javascript
// Headers
Content-Type: application/x-www-form-urlencoded

// Body (Form-Data)
username=user@example.com&password=SecurePass123!

// IMPORTANT: Field is "username" not "email"!
```

### Response (Success - 200)
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

### Common Errors
- **401**: Invalid email or password
- **403**: Account is disabled
- **422**: Wrong format (if you send JSON instead of form-data)

### Frontend Implementation
```javascript
async function login(email, password) {
  // CRITICAL: Use URLSearchParams for form-data
  const formData = new URLSearchParams();
  formData.append('username', email);  // Note: 'username' not 'email'
  formData.append('password', password);
  
  const response = await fetch('http://localhost:8000/api/v2/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  }
  throw new Error(await response.text());
}
```

---

## 3. GET USER PROFILE ✅ Working

### Endpoint
```
GET /api/v2/auth/profile
```

### Frontend Must Send
```javascript
// Headers
Authorization: Bearer <access_token>
```

### Response (Success - 200)
```json
{
  "user_id": "10d80a41-8637-4e35-94f7-748cf69fd407",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "created_at": "2025-10-24 15:27:43.950196+00:00",
  "is_active": true
}
```

### Common Errors
- **401**: Not authenticated (missing or expired token)
- **500**: Invalid token format

### Frontend Implementation
```javascript
async function getProfile() {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:8000/api/v2/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.ok) {
    return await response.json();
  }
  if (response.status === 401) {
    // Token expired, try to refresh
    await refreshToken();
    return getProfile(); // Retry
  }
  throw new Error(await response.text());
}
```

---

## 4. REFRESH TOKEN ⚠️ Expects Query Parameter

### Endpoint
```
POST /api/v2/auth/refresh?refresh_token=<token>
```

### Frontend Must Send
```javascript
// Token must be in QUERY PARAMETER, not body!
POST /api/v2/auth/refresh?refresh_token=eyJhbGci...
```

### Response (Success - 200)
```json
{
  "access_token": "new_access_token",
  "refresh_token": "new_refresh_token",
  "token_type": "bearer"
}
```

### Frontend Implementation
```javascript
async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  // NOTE: Token in query parameter!
  const response = await fetch(
    `http://localhost:8000/api/v2/auth/refresh?refresh_token=${refreshToken}`,
    { method: 'POST' }
  );
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  }
  throw new Error('Session expired, please login again');
}
```

---

## 5. LOGOUT ✅ Working

### Endpoint
```
POST /api/v2/auth/logout
```

### Frontend Must Send
```javascript
// Headers
Authorization: Bearer <access_token>
```

### Response (Success - 204)
```
No Content (empty response)
```

### Frontend Implementation
```javascript
async function logout() {
  const token = localStorage.getItem('access_token');
  
  await fetch('http://localhost:8000/api/v2/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  // Clear stored tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}
```

---

## 6. FORGOT PASSWORD ⚠️ Expects Query Parameter

### Endpoint
```
POST /api/v2/auth/forgot-password?email=user@example.com
```

### Frontend Must Send
```javascript
// Email must be in QUERY PARAMETER, not body!
POST /api/v2/auth/forgot-password?email=user@example.com
```

### Response (Success - 200)
```json
{
  "message": "If the email exists, a reset link has been sent"
}
```

### Frontend Implementation
```javascript
async function forgotPassword(email) {
  const response = await fetch(
    `http://localhost:8000/api/v2/auth/forgot-password?email=${encodeURIComponent(email)}`,
    { method: 'POST' }
  );
  
  return await response.json();
}
```

---

## 7. RESET PASSWORD ⚠️ Expects Query Parameters

### Endpoint
```
POST /api/v2/auth/reset-password?token=<token>&new_password=<password>
```

### Frontend Must Send
```javascript
// Both parameters must be in QUERY STRING!
POST /api/v2/auth/reset-password?token=reset_token&new_password=NewPass123!
```

### Response (Success - 200)
```json
{
  "message": "Password reset successful"
}
```

### Frontend Implementation
```javascript
async function resetPassword(token, newPassword) {
  const response = await fetch(
    `http://localhost:8000/api/v2/auth/reset-password?token=${token}&new_password=${encodeURIComponent(newPassword)}`,
    { method: 'POST' }
  );
  
  return await response.json();
}
```

---

## 📋 VALIDATION RULES

### Email Validation
- Must be valid email format (contains @ and domain)
- Must be unique in the system

### Password Requirements
- Minimum 8 characters
- No maximum length specified
- No complexity requirements enforced (but recommended: uppercase, lowercase, number, special char)

### Token Expiration
- Access Token: 30 minutes
- Refresh Token: 7 days

---

## 🔧 COMPLETE FRONTEND AUTH SERVICE

```javascript
class AuthService {
  constructor() {
    this.baseUrl = 'http://localhost:8000';
  }
  
  async register(email, password, fullName, organization = null) {
    const response = await fetch(`${this.baseUrl}/api/v2/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        organization: organization || `Org_${Date.now()}`,
        role: 'user'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }
    
    const data = await response.json();
    this.saveTokens(data);
    return data;
  }
  
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);  // CRITICAL: 'username' not 'email'
    formData.append('password', password);
    
    const response = await fetch(`${this.baseUrl}/api/v2/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }
    
    const data = await response.json();
    this.saveTokens(data);
    return data;
  }
  
  async getProfile() {
    const token = this.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}/api/v2/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.status === 401) {
      await this.refreshToken();
      return this.getProfile();
    }
    
    if (!response.ok) {
      throw new Error('Failed to get profile');
    }
    
    return await response.json();
  }
  
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    
    const response = await fetch(
      `${this.baseUrl}/api/v2/auth/refresh?refresh_token=${refreshToken}`,
      { method: 'POST' }
    );
    
    if (!response.ok) {
      this.clearTokens();
      throw new Error('Session expired, please login again');
    }
    
    const data = await response.json();
    this.saveTokens(data);
    return data;
  }
  
  async logout() {
    const token = this.getAccessToken();
    
    await fetch(`${this.baseUrl}/api/v2/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    this.clearTokens();
  }
  
  async forgotPassword(email) {
    const response = await fetch(
      `${this.baseUrl}/api/v2/auth/forgot-password?email=${encodeURIComponent(email)}`,
      { method: 'POST' }
    );
    
    return await response.json();
  }
  
  async resetPassword(token, newPassword) {
    const response = await fetch(
      `${this.baseUrl}/api/v2/auth/reset-password?token=${token}&new_password=${encodeURIComponent(newPassword)}`,
      { method: 'POST' }
    );
    
    return await response.json();
  }
  
  // Token management
  saveTokens(data) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
  }
  
  getAccessToken() {
    return localStorage.getItem('access_token');
  }
  
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
  
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  
  isAuthenticated() {
    return !!this.getAccessToken();
  }
}

// Usage
const auth = new AuthService();

// Register
await auth.register('user@example.com', 'Pass123!', 'John Doe');

// Login
await auth.login('user@example.com', 'Pass123!');

// Get profile
const profile = await auth.getProfile();

// Logout
await auth.logout();
```

---

## ⚠️ CRITICAL POINTS FOR FRONTEND

1. **Login MUST use form-data** with `username` field (not JSON with `email`)
2. **Refresh token goes in query parameter**, not request body
3. **Forgot/Reset password use query parameters**, not request body
4. **Organization names should be unique** to avoid registration errors
5. **Tokens expire in 30 minutes** - implement auto-refresh
6. **Store tokens securely** - consider using httpOnly cookies in production

---

## 🧪 TEST CREDENTIALS (From Testing)

```
Email: testuser_1761319663@dbxaviation.com
Password: SecurePassword123!
```

These credentials are confirmed working and can be used for testing.

---

Last Updated: October 24, 2025
Tested and Verified: All endpoints confirmed working
