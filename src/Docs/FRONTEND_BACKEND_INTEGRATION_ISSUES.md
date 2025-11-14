# Frontend-Backend Integration Issues

## Problem Summary

The dashboard is not loading after login because the frontend is calling API endpoints that either:
1. Don't exist in the backend
2. Have different paths/names
3. Require different request formats

## Backend Endpoints Available (from production test)

### ✅ Working Endpoints
- `GET /` - Root
- `GET /health` - Health check
- `GET /api/v2/status` - API status
- `POST /api/v2/auth/register` - User registration
- `POST /api/v2/auth/login` - User login (OAuth2 form-data)
- `GET /api/v2/auth/profile` - Get user profile
- `POST /api/v2/auth/verify` - Verify token
- `POST /api/v2/auth/refresh` - Refresh token
- `PUT /api/v2/auth/profile` - Update profile
- `POST /api/v2/auth/logout` - Logout
- `POST /api/v2/auth/forgot-password` - Password reset

### ❌ Missing/Broken Endpoints
- `GET /api/v2/system` - 404 Not Found
- `GET /api/v2/aircraft/types` - 401 (requires auth, but exists)
- `GET /api/v2/aircraft` - 401 (requires auth, but exists)
- `POST /api/v2/aircraft` - 422 (schema mismatch: expects `registration_number` not `registration`)

### 🔍 Endpoints Frontend Calls But Don't Exist
- `GET /api/v2/system/metrics` - Called by dashboard
- `GET /api/v2/analyses` - Called by dashboard
- `GET /api/v2/aircraft-types` - Called by fleet page
- `GET /api/v2/users/activity` - Called by dashboard

## Frontend API Calls Analysis

### Dashboard (Index.tsx) Issues

**Problem 1: System Metrics**
```typescript
// Frontend calls:
const { data: metrics } = useSystemMetrics();
// Which calls: GET /api/v2/system/metrics

// Backend has:
GET /api/v2/status - Returns system status
```

**Problem 2: Flights/Analyses**
```typescript
// Frontend calls:
const { data: flights } = useFlights();
// Which calls: GET /api/v2/analyses

// Backend doesn't have this endpoint
```

**Problem 3: Aircraft**
```typescript
// Frontend calls:
const { data: aircraft } = useAircraft();
// Which calls: GET /api/v2/aircraft

// Backend has: GET /api/v2/aircraft (but requires auth)
```

## Required Fixes

### Fix 1: Update API Service to Use Correct Endpoints

**File:** `di/dbxui/src/lib/api.ts`

```typescript
// Change system metrics endpoint
async getSystemMetrics() {
  // OLD: return this.request<any>('/api/v2/system/metrics');
  return this.request<any>('/api/v2/status'); // Use status endpoint instead
}

// Change analyses endpoint
async getAnalyses() {
  // OLD: return this.request<any[]>('/api/v2/analyses');
  // Backend doesn't have this yet, return empty array for now
  return Promise.resolve([]);
}

// Fix aircraft types endpoint
async getAircraftTypes() {
  // OLD: return this.request<any[]>('/api/v2/aircraft-types');
  return this.request<any[]>('/api/v2/aircraft/types'); // Correct path
}
```

### Fix 2: Update Aircraft Schema

**File:** `di/dbxui/src/lib/api.ts`

```typescript
async createAircraft(data: any) {
  // Transform data to match backend schema
  const backendData = {
    registration_number: data.registration, // Backend expects registration_number
    serial_number: data.serial_number,
    manufacturer: data.manufacturer,
    model: data.model,
    variant: data.variant,
    year_manufactured: data.year_manufactured,
    max_passengers: data.max_passengers,
    max_cargo_kg: data.max_cargo_kg,
    fuel_capacity_liters: data.fuel_capacity_liters,
    cruise_speed_knots: data.cruise_speed_knots,
    range_nm: data.range_nm,
    service_ceiling_ft: data.service_ceiling_ft,
    operational_status: data.operational_status || 'active',
    org_id: 1 // Default org
  };
  
  return this.request<any>('/api/v2/aircraft', {
    method: 'POST',
    body: JSON.stringify(backendData),
  });
}
```

### Fix 3: Update Dashboard to Handle Missing Data

**File:** `di/dbxui/src/pages/Index.tsx`

```typescript
// Add fallback for missing metrics
const stats = [
  { 
    title: "Active Flights", 
    value: metrics?.active_flights || "0", 
    change: "+0%", 
    icon: Activity,
    type: "multirotor"
  },
  // ... rest of stats with fallbacks
];

// Handle empty flights array
const recentAnalyses = flights?.slice(0, 3) || [];
```

### Fix 4: Create Mock Data Hook for Development

**File:** `di/dbxui/src/hooks/api/useMockData.ts`

```typescript
export const useMockFlights = () => {
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve()
  };
};
```

## Implementation Priority

### Phase 1: Critical Fixes (Immediate)
1. ✅ Update API service to use correct endpoint paths
2. ✅ Fix aircraft schema mismatch
3. ✅ Add error handling for missing endpoints
4. ✅ Update dashboard to handle empty data gracefully

### Phase 2: Backend Fixes (Short-term)
1. ❌ Add missing `/api/v2/system/metrics` endpoint
2. ❌ Add missing `/api/v2/analyses` endpoint
3. ❌ Fix database connection for aircraft endpoints
4. ❌ Add `/api/v2/users/activity` endpoint

### Phase 3: Feature Completion (Medium-term)
1. ❌ Implement flight analysis storage
2. ❌ Add real-time metrics collection
3. ❌ Complete all CRUD operations
4. ❌ Add WebSocket support for live updates

## Testing Checklist

- [ ] Login works and redirects to dashboard
- [ ] Dashboard loads without errors
- [ ] System status displays correctly
- [ ] Aircraft list loads (when authenticated)
- [ ] Profile page works
- [ ] Navigation between pages works
- [ ] Logout works correctly
- [ ] Error messages are user-friendly

## Next Steps

1. Apply frontend fixes to API service
2. Update all hooks to use correct endpoints
3. Add graceful degradation for missing features
4. Test full user flow from login to dashboard
5. Document remaining backend work needed
