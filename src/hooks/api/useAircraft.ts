import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query hook for listing aircraft
export const useAircraft = (options?: {
  skip?: number;
  limit?: number;
}) => {
  const { skip = 0, limit = 50 } = options || {};

  return useQuery({
    queryKey: ['aircraft', skip, limit],
    queryFn: () => apiService.getAircraft(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Query hook for single aircraft
export const useAircraftById = (id: string) => {
  return useQuery({
    queryKey: ['aircraft', id],
    queryFn: () => apiService.getAircraftById(id),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

// Query hook for aircraft types
export const useAircraftTypes = () => {
  return useQuery({
    queryKey: ['aircraft', 'types'],
    queryFn: () => apiService.getAircraftTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes (types don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Mutation hook for creating aircraft
export const useCreateAircraft = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => apiService.createAircraft(data),
    onMutate: async (newAircraft) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['aircraft'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['aircraft']);

      // Optimistically update
      queryClient.setQueryData(['aircraft'], (old: any) => {
        if (!old) return [newAircraft];
        return [...old, { ...newAircraft, id: 'temp-' + Date.now() }];
      });

      return { previous };
    },
    onError: (error: any, newAircraft, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['aircraft'], context.previous);
      }

      let errorMessage = 'Failed to create aircraft';
      if (error.status === 400) {
        errorMessage = 'Invalid aircraft data. Please check all required fields.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Aircraft creation failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Aircraft created',
        description: 'The aircraft has been added successfully',
      });
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
    },
  });
};

// Mutation hook for updating aircraft
export const useUpdateAircraft = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiService.updateAircraft(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['aircraft'] });

      const previous = queryClient.getQueryData(['aircraft', id]);

      queryClient.setQueryData(['aircraft', id], (old: any) => ({
        ...old,
        ...data,
      }));

      return { previous };
    },
    onError: (error: any, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['aircraft', variables.id], context.previous);
      }

      let errorMessage = 'Failed to update aircraft';
      if (error.status === 404) {
        errorMessage = 'Aircraft not found';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to update this aircraft';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Aircraft updated',
        description: 'The aircraft has been updated successfully',
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
      queryClient.invalidateQueries({ queryKey: ['aircraft', variables.id] });
    },
  });
};

// Mutation hook for deleting aircraft
export const useDeleteAircraft = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteAircraft(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['aircraft'] });

      const previous = queryClient.getQueryData(['aircraft']);

      queryClient.setQueryData(['aircraft'], (old: any) => {
        if (!old) return [];
        return old.filter((aircraft: any) => aircraft.id !== id);
      });

      return { previous };
    },
    onError: (error: any, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['aircraft'], context.previous);
      }

      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete aircraft',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Aircraft deleted',
        description: 'The aircraft has been removed successfully',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
    },
  });
};
