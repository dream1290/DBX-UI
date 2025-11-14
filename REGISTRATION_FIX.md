# Registration Fix - Organization ID Issue

## 🐛 Issue

Registration was failing with error:
```
ApiError: Invalid organization ID. Please leave blank or contact your administrator.
```

## 🔍 Root Cause

The frontend was sending `organization_id: null` when no organization was selected, but the backend's database has a foreign key constraint that rejects `null` values for `organization_id`.

### Backend Behavior
- The backend catches foreign key constraint violations
- When `organization_id` is `null` or invalid, it throws a 400 error
- The field should either be omitted entirely or be a valid organization ID

## ✅ Solution

Updated the `register` method in `src/lib/api.ts` to:
1. Only include `organization_id` in the request if it's provided
2. Validate that the organization ID is not empty before sending
3. Omit the field entirely if no organization is selected

### Before
```typescript
async register(email: string, password: string, fullName: string, organizationId?: string) {
  const response = await this.request<any>('/api/v2/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      organization_id: organizationId || null  // ❌ Sends null
    }),
  });
}
```

### After
```typescript
async register(email: string, password: string, fullName: string, organizationId?: string) {
  // Build request body - only include organization_id if it's provided and not empty
  const requestBody: any = {
    email,
    password,
    full_name: fullName,
  };
  
  // Only add organization_id if it's a valid non-empty string
  if (organizationId && organizationId.trim() !== '') {
    requestBody.organization_id = organizationId;
  }
  
  const response = await this.request<any>('/api/v2/auth/register', {
    method: 'POST',
    body: JSON.stringify(requestBody),  // ✅ Omits organization_id if not provided
  });
}
```

## 🧪 Testing

### Test Case 1: Register without Organization
```javascript
// Should succeed - organization_id field is omitted
await apiService.register('user@example.com', 'password123', 'John Doe');
```

### Test Case 2: Register with Organization
```javascript
// Should succeed - organization_id is included
await apiService.register('user@example.com', 'password123', 'John Doe', '1');
```

### Test Case 3: Register with Empty Organization
```javascript
// Should succeed - organization_id field is omitted
await apiService.register('user@example.com', 'password123', 'John Doe', '');
```

## 📦 Deployment

The fix has been applied and the frontend rebuilt:
```bash
✓ built in 4.94s
```

### Files Changed
- `dbxui/src/lib/api.ts` - Updated register method

### Build Output
- `dist/assets/index-Dq0-Fc7x.js` - 830.67 kB (227.33 kB gzipped)

## 🚀 Next Steps

1. **Test the registration flow:**
   - Try registering a new user without selecting an organization
   - Verify the registration succeeds
   - Check that the user can log in after registration

2. **Deploy the updated build:**
   ```bash
   # Deploy to your hosting platform
   vercel --prod
   # or
   netlify deploy --prod --dir=dist
   ```

3. **Verify in production:**
   - Test registration on the deployed site
   - Check browser console for any errors
   - Confirm successful user creation

## 📝 Notes

- The backend's `organization_id` field has a foreign key constraint
- When creating users without an organization, the field must be omitted (not set to `null`)
- This is a common pattern in REST APIs with optional foreign key relationships
- The fix ensures compatibility with the backend's database schema

## ✅ Status

- [x] Issue identified
- [x] Fix implemented
- [x] Frontend rebuilt
- [ ] Deployed to production
- [ ] Tested in production
