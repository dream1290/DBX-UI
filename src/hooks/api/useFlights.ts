import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch all flight analyses
 * @param options - Configuration options
 * @param options.limit - Maximum number of flights to return
 * @param options.autoRefresh - Enable auto-refresh every 30 seconds
 * @returns Query result with flights data, loading state, and error
 * @example
 * const { data: flights, isLoading, error } = useFlights({ autoRefresh: true });
 */
export const useFlights = (options?: { limit?: number; autoRefresh?: boolean; retry?: boolean; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['flights', options],
    queryFn: () => apiService.getAnalyses(),
    refetchInterval: options?.autoRefresh ? 30 * 1000 : false, // 30 seconds
    retry: options?.retry ?? false, // Don't retry on failure by default
    enabled: options?.enabled ?? true,
    throwOnError: false, // Don't throw errors, just return them
  });
};

/**
 * Hook to fetch a single flight analysis by ID
 * @param id - The flight analysis ID
 * @returns Query result with flight data, loading state, and error
 * @example
 * const { data: flight, isLoading } = useFlight('flight-123');
 */
export const useFlight = (id: string) => {
  return useQuery({
    queryKey: ['flights', id],
    queryFn: () => apiService.getAnalysis(id),
    enabled: !!id,
  });
};

/**
 * Hook for infinite scroll pagination of flight analyses
 * @returns Infinite query result with pages of flights, loading state, and pagination controls
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteFlights();
 */
export const useInfiniteFlights = () => {
  return useInfiniteQuery({
    queryKey: ['flights', 'infinite'],
    queryFn: ({ pageParam = 0 }) => apiService.getAnalyses(),
    getNextPageParam: (lastPage, pages) => {
      // Adjust based on your API pagination
      return lastPage.length > 0 ? pages.length : undefined;
    },
    initialPageParam: 0,
  });
};

/**
 * Hook to upload and analyze a flight log file
 * @returns Mutation function to analyze a flight with file and optional metadata
 * @example
 * const analyzeFlight = useAnalyzeFlight();
 * analyzeFlight.mutate({ file: myFile, metadata: { aircraft: 'AC-001' } });
 */
export const useAnalyzeFlight = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata?: any }) =>
      apiService.analyzeFlightLog(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast({
        title: "Analysis started",
        description: "Your flight log is being analyzed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to analyze multiple flight log files in batch
 * @returns Mutation function to analyze multiple files
 * @example
 * const batchAnalyze = useBatchAnalyze();
 * batchAnalyze.mutate([file1, file2, file3]);
 */
export const useBatchAnalyze = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => apiService.batchAnalyze(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast({
        title: "Batch analysis started",
        description: "Your flight logs are being analyzed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Batch analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to delete a flight analysis with optimistic updates
 * @returns Mutation function to delete a flight by ID
 * @example
 * const deleteFlight = useDeleteFlight();
 * deleteFlight.mutate('flight-123');
 */
export const useDeleteFlight = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteAnalysis(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['flights'] });
      const previousFlights = queryClient.getQueryData(['flights']);
      
      queryClient.setQueryData(['flights'], (old: any) => 
        old?.filter((flight: any) => flight.id !== id)
      );
      
      return { previousFlights };
    },
    onError: (error: Error, _, context) => {
      queryClient.setQueryData(['flights'], context?.previousFlights);
      toast({
        title: "Failed to delete flight",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Flight deleted",
        description: "Flight analysis has been removed",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
  });
};

/**
 * Hook to export flight analyses to CSV or JSON format
 * @returns Mutation function to export flights
 * @example
 * const exportFlights = useExportFlights();
 * exportFlights.mutate('csv'); // or 'json'
 */
export const useExportFlights = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (format: 'csv' | 'json' = 'csv') => apiService.exportAnalyses(format),
    onSuccess: () => {
      toast({
        title: "Export successful",
        description: "Your flight analyses have been downloaded",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
