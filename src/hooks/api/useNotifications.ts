import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';

// Query hook for listing notifications with polling
export const useNotifications = (options?: {
  skip?: number;
  limit?: number;
  autoRefresh?: boolean;
}) => {
  const { skip = 0, limit = 50, autoRefresh = true } = options || {};

  const query = useQuery({
    queryKey: ['notifications', skip, limit],
    queryFn: () => apiService.getNotifications(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: autoRefresh ? 30 * 1000 : false, // Poll every 30 seconds
    refetchIntervalInBackground: false, // Only poll when tab is active
  });

  // Calculate unread count
  const unreadCount = useMemo(() => {
    if (!query.data) return 0;
    return query.data.filter((notification: any) => !notification.is_read).length;
  }, [query.data]);

  return {
    ...query,
    unreadCount,
  };
};

// Mutation hook for marking notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.markNotificationAsRead(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['notifications']);

      // Optimistically update
      queryClient.setQueryData(['notifications'], (old: any) => {
        if (!old) return old;
        return old.map((notification: any) =>
          notification.id === id
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        );
      });

      return { previous };
    },
    onError: (error: any, id, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous);
      }

      if (error.status !== 404) {
        toast({
          title: 'Failed to mark as read',
          description: error instanceof Error ? error.message : 'An error occurred',
          variant: 'destructive',
        });
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Mutation hook for marking all notifications as read
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => apiService.markAllNotificationsAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previous = queryClient.getQueryData(['notifications']);

      queryClient.setQueryData(['notifications'], (old: any) => {
        if (!old) return old;
        return old.map((notification: any) => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString(),
        }));
      });

      return { previous };
    },
    onError: (error: any, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous);
      }

      toast({
        title: 'Failed to mark all as read',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'All notifications marked as read',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Mutation hook for deleting notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      toast({
        title: 'Notification deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete notification',
        variant: 'destructive',
      });
    },
  });
};
