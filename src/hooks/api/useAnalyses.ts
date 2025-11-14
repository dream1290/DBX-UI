import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query hook for listing analyses
export const useAnalyses = (options?: {
  skip?: number;
  limit?: number;
  autoRefresh?: boolean;
}) => {
  const { skip = 0, limit = 50, autoRefresh = false } = options || {};

  return useQuery({
    queryKey: ['analyses', skip, limit],
    queryFn: () => apiService.getAnalyses(skip, limit),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchInterval: autoRefresh ? 30 * 1000 : false,
    refetchIntervalInBackground: false,
  });
};

// Query hook for single analysis
export const useAnalysis = (id: string) => {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () => apiService.getAnalysis(id),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

// Mutation hook for creating analysis
export const useCreateAnalysis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => apiService.createAnalysis(data),
    onSuccess: () => {
      // Invalidate analyses list to refetch
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      
      toast({
        title: 'Analysis created',
        description: 'Your flight analysis has been created successfully',
      });
    },
    onError: (error: any) => {
      let errorMessage = 'Failed to create analysis';
      
      if (error.status === 503) {
        errorMessage = 'AI models are not ready. Please try again later.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid telemetry data. Please check your input.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Analysis creation failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

// Mutation hook for deleting analysis
export const useDeleteAnalysis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteAnalysis(id),
    onSuccess: () => {
      // Invalidate analyses list to refetch
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      
      toast({
        title: 'Analysis deleted',
        description: 'The analysis has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete analysis',
        variant: 'destructive',
      });
    },
  });
};
