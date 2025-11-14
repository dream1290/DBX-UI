import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query hook for listing API keys
export const useApiKeys = () => {
  return useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => apiService.getApiKeys(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Query hook for API key statistics
export const useApiKeyStats = () => {
  return useQuery({
    queryKey: ['apiKeys', 'stats'],
    queryFn: () => apiService.getApiKeyStats(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Mutation hook for creating API key
export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => apiService.createApiKey(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      queryClient.invalidateQueries({ queryKey: ['apiKeys', 'stats'] });

      // Show success with warning to save the key
      toast({
        title: 'API Key created',
        description: 'Please save your API key now. You will not be able to see it again.',
        duration: 10000, // Show for 10 seconds
      });

      return data; // Return data so component can display the key
    },
    onError: (error: any) => {
      let errorMessage = 'Failed to create API key';
      if (error.status === 400) {
        errorMessage = 'Invalid API key data';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'API Key creation failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

// Mutation hook for deleting API key
export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      queryClient.invalidateQueries({ queryKey: ['apiKeys', 'stats'] });

      toast({
        title: 'API Key deleted',
        description: 'The API key has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete API key',
        variant: 'destructive',
      });
    },
  });
};
