# API Integration Migration Guide

This guide documents the changes made during the API integration migration and provides examples for developers working with the codebase.

## Overview

The application has been migrated from using hardcoded mock data to a full API integration using React Query (TanStack Query) for data fetching, caching, and state management.

## Breaking Changes

### 1. Removed Mock Data

**Before:**
```typescript
const analyses = [
  { id: '1', aircraft: 'AC-001', status: 'completed' },
  { id: '2', aircraft: 'AC-002', status: 'processing' },
];
```

**After:**
```typescript
import { useFlights } from '@/hooks/api/useFlights';

const { data: analyses, isLoading, error } = useFlights();
```

### 2. Authentication Changes

**Before:**
```typescript
// Tokens stored in context only
const { user, login } = useAuth();
```

**After:**
```typescript
// Tokens stored in localStorage with automatic refresh
const { user, login } = useAuth();
// Access token: localStorage.getItem('auth_token')
// Refresh token: localStorage.getItem('refresh_token')
```

### 3. API Service Changes

**Before:**
```typescript
// Direct fetch calls
const response = await fetch('/api/analyses');
```

**After:**
```typescript
// Use apiService with automatic token handling
import { apiService } from '@/lib/api';
const data = await apiService.getAnalyses();
```

## New Features

### 1. Automatic Token Refresh

Tokens are now automatically refreshed when they expire:

```typescript
// Handled automatically by apiService
// No manual intervention required
// On refresh failure, user is logged out automatically
```

### 2. Optimistic Updates

Create, update, and delete operations now update the UI immediately:

```typescript
const deleteAircraft = useDeleteAircraft();

// UI updates immediately, rolls back on error
deleteAircraft.mutate('aircraft-123');
```

### 3. Auto-Refresh

Data automatically refreshes at configured intervals:

```typescript
// Dashboard metrics refresh every 30 seconds
const { data } = useSystemMetrics({ autoRefresh: true });

// System status refreshes every 10 seconds
const { data } = useSystemStatus({ autoRefresh: true });
```

### 4. Infinite Scroll

Flight analysis page now supports infinite scrolling:

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteFlights();

// Load more flights
if (hasNextPage) {
  fetchNextPage();
}
```

## Migration Examples

### Migrating a Page Component

**Before:**
```typescript
const MyPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return <div>{/* render data */}</div>;
};
```

**After:**
```typescript
import { useMyData } from '@/hooks/api/useMyData';
import { MyDataSkeleton } from '@/components/shared/LoadingStates';
import { ErrorState } from '@/components/shared/ErrorState';

const MyPage = () => {
  const { data, isLoading, error, refetch } = useMyData();

  if (isLoading) return <MyDataSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  return <div>{/* render data */}</div>;
};
```

### Creating a New API Hook

```typescript
// src/hooks/api/useMyData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch my data
 */
export const useMyData = () => {
  return useQuery({
    queryKey: ['myData'],
    queryFn: () => apiService.getMyData(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to create my data with optimistic updates
 */
export const useCreateMyData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiService.createMyData(data),
    onMutate: async (newData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['myData'] });
      
      // Save previous data for rollback
      const previousData = queryClient.getQueryData(['myData']);
      
      // Optimistically update cache
      queryClient.setQueryData(['myData'], (old: any) => [
        ...(old || []),
        { ...newData, id: `temp-${Date.now()}` }
      ]);
      
      return { previousData };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      queryClient.setQueryData(['myData'], context?.previousData);
      toast({
        title: "Failed to create",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Created successfully",
      });
    },
    onSettled: () => {
      // Refetch to get server data
      queryClient.invalidateQueries({ queryKey: ['myData'] });
    },
  });
};
```

### Adding a New API Endpoint

1. **Add to API Service** (`src/lib/api.ts`):
```typescript
async getMyData() {
  return this.request<MyData[]>('/api/v2/my-data');
}

async createMyData(data: any) {
  return this.request<MyData>('/api/v2/my-data', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

2. **Create Hook** (`src/hooks/api/useMyData.ts`):
```typescript
export const useMyData = () => {
  return useQuery({
    queryKey: ['myData'],
    queryFn: () => apiService.getMyData(),
  });
};
```

3. **Use in Component**:
```typescript
const { data, isLoading, error } = useMyData();
```

## Query Key Patterns

Follow these patterns for consistent caching:

```typescript
// List queries
['users']                    // All users
['flights']                  // All flights
['aircraft']                 // All aircraft

// Detail queries
['users', id]                // Single user
['flights', id]              // Single flight
['aircraft', id]             // Single aircraft

// Filtered queries
['flights', { status: 'completed' }]
['users', { role: 'admin' }]

// Nested resources
['users', 'activity', limit]
['system', 'metrics']
['system', 'status']
```

## Cache Invalidation

Invalidate queries after mutations:

```typescript
// After creating
queryClient.invalidateQueries({ queryKey: ['myData'] });

// After updating
queryClient.invalidateQueries({ queryKey: ['myData'] });
queryClient.invalidateQueries({ queryKey: ['myData', id] });

// After deleting
queryClient.invalidateQueries({ queryKey: ['myData'] });
```

## Error Handling

All hooks include automatic error handling with toast notifications:

```typescript
const createData = useCreateMyData();

// Errors are automatically shown in toast
createData.mutate(newData);

// Or handle manually
createData.mutate(newData, {
  onError: (error) => {
    // Custom error handling
  }
});
```

## Testing

When testing components that use API hooks:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing/library/react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('useMyData fetches data', async () => {
  const { result } = renderHook(() => useMyData(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

## Environment Setup

Ensure your `.env` file includes:

```env
VITE_API_URL=http://localhost:8000
```

## Common Issues

### Issue: Data not loading
**Solution**: Check browser console for API errors, verify backend is running

### Issue: Automatic logout
**Solution**: Check token refresh endpoint, verify refresh token is stored

### Issue: Stale data
**Solution**: Adjust `staleTime` in query configuration or manually invalidate

### Issue: Too many requests
**Solution**: Increase `staleTime`, disable `autoRefresh`, or use `refetchOnWindowFocus: false`

## Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [API Hooks README](./src/hooks/api/README.md)
- [Main README](./README.md)
