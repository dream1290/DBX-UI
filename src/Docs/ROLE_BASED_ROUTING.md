# Role-Based Routing System

This document describes the role-based access control (RBAC) system implemented in the DBX Aviation application.

## Overview

The application uses a role-based routing system that controls access to different pages based on user roles. Users are automatically redirected to appropriate pages based on their permissions.

## User Roles

The system supports 5 user roles with different access levels:

### 1. **System Administrator**
- **Full Access** to all features
- Can manage users, organizations, system settings
- Access to security and admin panels
- Default route: `/dashboard`

### 2. **Safety Analyst**
- Focus on flight analysis and safety
- Access to: Dashboard, Flight Analysis, Fleet Management, Upload Data, Reports
- Cannot access: User Management, System Admin, Security
- Default route: `/analysis`

### 3. **Fleet Manager**
- Focus on fleet and aircraft management
- Access to: Dashboard, Fleet Management, Upload Data, Organizations
- Cannot access: User Management, System Admin, Security, API Keys
- Default route: `/fleet`

### 4. **Data Analyst**
- Focus on data analysis and reporting
- Access to: Dashboard, Flight Analysis, Upload Data, Reports, API Keys
- Cannot access: Fleet Management, User Management, Organizations, System Admin, Security
- Default route: `/analysis`

### 5. **Viewer**
- Read-only access
- Access to: Dashboard, Flight Analysis, Notifications, Profile
- Cannot access: Upload Data, Reports, Fleet Management, User Management, Organizations, System Admin, Security, API Keys
- Default route: `/dashboard`

## Route Permissions Matrix

| Route | System Admin | Safety Analyst | Fleet Manager | Data Analyst | Viewer |
|-------|--------------|----------------|---------------|--------------|--------|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/analysis` | ✅ | ✅ | ❌ | ✅ | ✅ |
| `/fleet` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `/upload` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `/reports` | ✅ | ✅ | ❌ | ✅ | ❌ |
| `/users` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/organizations` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `/admin` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/security` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api-keys` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `/notifications` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/profile` | ✅ | ✅ | ✅ | ✅ | ✅ |

## Implementation

### 1. Protected Route Component

The `ProtectedRoute` component wraps protected pages and checks:
- If user is authenticated
- If user has the required role

```typescript
<ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.DASHBOARD}>
  <MainLayout>
    <Dashboard />
  </MainLayout>
</ProtectedRoute>
```

### 2. Role Configuration

Roles and permissions are defined in `src/config/roles.ts`:

```typescript
export const ROLES = {
  SYSTEM_ADMIN: 'System Administrator',
  SAFETY_ANALYST: 'Safety Analyst',
  FLEET_MANAGER: 'Fleet Manager',
  DATA_ANALYST: 'Data Analyst',
  VIEWER: 'Viewer',
};

export const ROUTE_PERMISSIONS = {
  DASHBOARD: [ROLES.SYSTEM_ADMIN, ROLES.SAFETY_ANALYST, ...],
  // ... other routes
};
```

### 3. Dynamic Sidebar

The sidebar automatically shows/hides menu items based on user role:

```typescript
const filteredMainNavItems = useMemo(() => {
  return mainNavItems.filter(item => 
    hasRouteAccess(userRole, item.permission)
  );
}, [userRole]);
```

## User Flow

### Login Flow

1. User enters credentials on `/login`
2. System authenticates and retrieves user role
3. User is redirected to their default route based on role:
   - System Admin → `/dashboard`
   - Safety Analyst → `/analysis`
   - Fleet Manager → `/fleet`
   - Data Analyst → `/analysis`
   - Viewer → `/dashboard`

### Access Denied Flow

1. User tries to access a restricted page
2. `ProtectedRoute` checks user role
3. If access denied:
   - User is redirected to `/dashboard`
   - Access denied message is shown (optional)

### Unauthenticated Flow

1. Unauthenticated user tries to access protected route
2. User is redirected to `/login`
3. After login, user is redirected back to original page (if they have access)

## Adding New Routes

To add a new protected route:

1. **Define permission in `src/config/roles.ts`:**
```typescript
export const ROUTE_PERMISSIONS = {
  // ... existing routes
  NEW_FEATURE: [ROLES.SYSTEM_ADMIN, ROLES.SAFETY_ANALYST],
};
```

2. **Add route in `src/App.tsx`:**
```typescript
<Route 
  path="/new-feature" 
  element={
    <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.NEW_FEATURE}>
      <MainLayout>
        <NewFeature />
      </MainLayout>
    </ProtectedRoute>
  } 
/>
```

3. **Add to sidebar (optional) in `src/components/layout/AppSidebar.tsx`:**
```typescript
const mainNavItems = [
  // ... existing items
  { 
    title: "New Feature", 
    url: "/new-feature", 
    icon: IconName, 
    permission: ROUTE_PERMISSIONS.NEW_FEATURE 
  },
];
```

## Testing Role-Based Access

### Test User Accounts

Create test users with different roles to verify access:

```typescript
// System Administrator
{ email: "admin@dbx.com", role: "System Administrator" }

// Safety Analyst
{ email: "analyst@dbx.com", role: "Safety Analyst" }

// Fleet Manager
{ email: "fleet@dbx.com", role: "Fleet Manager" }

// Data Analyst
{ email: "data@dbx.com", role: "Data Analyst" }

// Viewer
{ email: "viewer@dbx.com", role: "Viewer" }
```

### Verification Checklist

- [ ] Each role can only access permitted routes
- [ ] Sidebar shows only accessible menu items
- [ ] Unauthorized access redirects to dashboard
- [ ] Login redirects to role-appropriate default page
- [ ] Deep links work with proper access control
- [ ] Logout clears all permissions

## Security Considerations

1. **Backend Validation**: Always validate permissions on the backend. Frontend routing is for UX only.
2. **Token Expiry**: Tokens are automatically refreshed. On failure, user is logged out.
3. **Role Changes**: If user role changes, they must log out and log back in.
4. **API Endpoints**: Ensure API endpoints also check user roles.

## Troubleshooting

### User Can't Access Expected Page

1. Check user role in profile: `/profile`
2. Verify role matches expected permissions in `roles.ts`
3. Check browser console for access denied messages
4. Verify user is authenticated (check localStorage for `auth_token`)

### Sidebar Items Not Showing

1. Verify `permission` property is set on nav item
2. Check if user role is included in permission array
3. Ensure `hasRouteAccess` function is working correctly

### Redirect Loop

1. Check if default route for role is accessible
2. Verify `ProtectedRoute` is not wrapping public routes
3. Check for conflicting route definitions

## Future Enhancements

- [ ] Permission-based feature flags within pages
- [ ] Granular permissions (read/write/delete)
- [ ] Role hierarchy (inherit permissions)
- [ ] Dynamic role assignment
- [ ] Audit log for access attempts
- [ ] Session timeout based on role
