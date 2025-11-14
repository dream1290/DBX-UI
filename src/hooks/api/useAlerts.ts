import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query hook for listing alerts
export const useAlerts = (options?: {
  skip?: number;
  limit?: number;
}) => {
  const { skip = 0, limit = 50 } = options || {};

  return useQuery({
    queryKey: ['alerts', skip, limit],
    queryFn: () => apiService.getAlerts(skip, limit),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Query hook for alert statistics
export const useAlertStats = () => {
  return useQuery({
    queryKey: ['alerts', 'stats'],
    queryFn: () => apiService.getAlertStats(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Mutation hook for acknowledging alert
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.acknowledgeAlert(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['alerts'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['alerts']);

      // Optimistically update
      queryClient.setQueryData(['alerts'], (old: any) => {
        if (!old) return old;
        return old.map((alert: any) =>
          alert.id === id
            ? {
                ...alert,
                status: 'acknowledged',
                acknowledged_at: new Date().toISOString(),
              }
            : alert
        );
      });

      return { previous };
    },
    onError: (error: any, id, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['alerts'], context.previous);
      }

      let errorMessage = 'Failed to acknowledge alert';
      if (error.status === 404) {
        errorMessage = 'Alert not found';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Acknowledge failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Alert acknowledged',
        description: 'The alert has been acknowledged',
      });
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', 'stats'] });
    },
  });
};

// Mutation hook for resolving alert
export const useResolveAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.resolveAlert(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['alerts'] });

      const previous = queryClient.getQueryData(['alerts']);

      queryClient.setQueryData(['alerts'], (old: any) => {
        if (!old) return old;
        return old.map((alert: any) =>
          alert.id === id
            ? {
                ...alert,
                status: 'resolved',
                resolved_at: new Date().toISOString(),
              }
            : alert
        );
      });

      return { previous };
    },
    onError: (error: any, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['alerts'], context.previous);
      }

      let errorMessage = 'Failed to resolve alert';
      if (error.status === 404) {
        errorMessage = 'Alert not found';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Resolve failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Alert resolved',
        description: 'The alert has been resolved',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', 'stats'] });
    },
  });
};
