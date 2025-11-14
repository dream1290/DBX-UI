import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query hook for listing reports
export const useReports = (options?: {
  skip?: number;
  limit?: number;
}) => {
  const { skip = 0, limit = 50 } = options || {};

  return useQuery({
    queryKey: ['reports', skip, limit],
    queryFn: () => apiService.getReports(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Query hook for single report
export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => apiService.getReport(id),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

// Mutation hook for generating report
export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => apiService.generateReport(data),
    onSuccess: (data) => {
      // Invalidate reports list to refetch
      queryClient.invalidateQueries({ queryKey: ['reports'] });

      toast({
        title: 'Report generation started',
        description: 'Your report is being generated. You will be notified when it is ready.',
      });

      // Poll for report completion
      const reportId = data.id;
      if (reportId) {
        const pollInterval = setInterval(async () => {
          try {
            const report = await apiService.getReport(reportId);
            if (report.status === 'completed') {
              clearInterval(pollInterval);
              queryClient.invalidateQueries({ queryKey: ['reports'] });
              queryClient.invalidateQueries({ queryKey: ['report', reportId] });
              
              toast({
                title: 'Report ready',
                description: 'Your report has been generated successfully',
              });
            } else if (report.status === 'failed') {
              clearInterval(pollInterval);
              toast({
                title: 'Report generation failed',
                description: 'There was an error generating your report',
                variant: 'destructive',
              });
            }
          } catch (error) {
            clearInterval(pollInterval);
          }
        }, 5000); // Poll every 5 seconds

        // Stop polling after 5 minutes
        setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
      }
    },
    onError: (error: any) => {
      let errorMessage = 'Failed to generate report';
      if (error.status === 400) {
        errorMessage = 'Invalid report parameters. Please check your input.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Report generation failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

// Mutation hook for deleting report
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      
      toast({
        title: 'Report deleted',
        description: 'The report has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete report',
        variant: 'destructive',
      });
    },
  });
};
