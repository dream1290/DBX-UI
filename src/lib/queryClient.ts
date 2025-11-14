import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data freshness - consider data stale after 30 seconds
      staleTime: 30 * 1000, // 30 seconds
      
      // Cache retention - keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      
      // Retry failed requests up to 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch behavior
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchOnReconnect: true, // Refetch when internet reconnects
      refetchOnMount: true, // Refetch when component mounts if data is stale
      
      // Network mode - fail fast on network errors
      networkMode: 'online',
    },
    mutations: {
      // Don't retry mutations by default (user actions should be explicit)
      retry: 1,
      retryDelay: 1000,
      
      // Network mode for mutations
      networkMode: 'online',
    },
  },
});
