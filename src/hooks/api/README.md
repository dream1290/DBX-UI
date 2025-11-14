# API Hooks Usage Guide

This directory contains React Query hooks for all backend API integrations.

## Quick Start

```typescript
import { useAnalyses, useCreateAnalysis } from '@/hooks/api';

function MyComponent() {
  // Fetch data with automatic caching and refetching
  const { data: analyses, isLoading, error } = useAnalyses({ 
    skip: 0, 
    limit: 50,
    autoRefresh: true // Poll every 30 seconds
  });

  // Create mutation with optimistic updates
  const createAnalysis = useCreateAnalysis();

  const handleCreate = async (data) => {
    await createAnalysis.mutateAsync(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render analyses */}</div>;
}
```

## Available Hooks

### Analyses
- `useAnalyses(options?)` - List analyses with pagination
- `useAnalysis(id)` - Get single analysis
- `useCreateAnalysis()` - Create new analysis
- `useDeleteAnalysis()` - Delete analysis

### Aircraft
- `useAircraft(options?)` - List aircraft
- `useAircraftById(id)` - Get single aircraft
- `useAircraftTypes()` - Get aircraft types
- `useCreateAircraft()` - Create aircraft (with optimistic updates)
- `useUpdateAircraft()` - Update aircraft (with optimistic updates)
- `useDeleteAircraft()` - Delete aircraft (with optimistic updates)

### Reports
- `useReports(options?)` - List reports
- `useReport(id)` - Get single report
- `useGenerateReport()` - Generate report (with polling)
- `useDeleteReport()` - Delete report

### Notifications
- `useNotifications(options?)` - List notifications (with polling & unread count)
- `useMarkNotificationRead()` - Mark as read (with optimistic updates)
- `useMarkAllNotificationsRead()` - Mark all as read (with optimistic updates)
- `useDeleteNotification()` - Delete notification

### Alerts
- `useAlerts(options?)` - List alerts
- `useAlertStats()` - Get alert statistics
- `useAcknowledgeAlert()` - Acknowledge alert (with optimistic updates)
- `useResolveAlert()` - Resolve alert (with optimistic updates)

### API Keys
- `useApiKeys()` - List API keys
- `useApiKeyStats()` - Get API key statistics
- `useCreateApiKey()` - Create API key (shows one-time key value)
- `useDeleteApiKey()` - Delete API key

### System
- `useSystemStatus()` - Get system status
- `useSystemMetrics(options?)` - Get system metrics (with polling)
- `useDetailedHealth()` - Get detailed health info
- `useDatabaseStatus()` - Get database status

## Features

✅ **Automatic Caching** - Data is cached for 30 seconds by default
✅ **Optimistic Updates** - UI updates immediately, rolls back on error
✅ **Auto Refetching** - Refetch on window focus and reconnect
✅ **Polling** - Real-time updates for notifications, metrics, etc.
✅ **Error Handling** - User-friendly error messages with toast notifications
✅ **Loading States** - Built-in loading and error states
✅ **TypeScript** - Full type safety

## Error Handling

All hooks automatically handle errors and show toast notifications:

- **400/422**: Validation errors with specific field messages
- **401**: Automatic token refresh, then logout if refresh fails
- **403**: Permission denied message
- **404**: Resource not found message
- **500**: Generic server error message
- **Network errors**: Connection error message

## Optimistic Updates

Mutations for aircraft, alerts, and notifications use optimistic updates:

1. UI updates immediately
2. API request is sent
3. If error occurs, UI rolls back to previous state
4. On success, data is refetched to ensure consistency

## Polling

Some hooks support automatic polling:

```typescript
// Poll every 30 seconds (only when tab is active)
const { data } = useNotifications({ autoRefresh: true });
const { data } = useSystemMetrics({ autoRefresh: true });
```

## Cache Invalidation

Mutations automatically invalidate related queries:

```typescript
// Creating an aircraft invalidates the aircraft list
const createAircraft = useCreateAircraft();
await createAircraft.mutateAsync(data);
// Aircraft list is automatically refetched
```
