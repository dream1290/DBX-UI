import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query hook for system status
export const useSystemStatus = () => {
  return useQuery({
    queryKey: ['system', 'status'],
    queryFn: () => apiService.getSystemStatus(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Query hook for system metrics with polling
export const useSystemMetrics = (options?: {
  autoRefresh?: boolean;
}) => {
  const { autoRefresh = false } = options || {};

  return useQuery({
    queryKey: ['system', 'metrics'],
    queryFn: () => apiService.getSystemMetrics(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: autoRefresh ? 30 * 1000 : false, // Poll every 30 seconds
    refetchIntervalInBackground: false, // Only poll when tab is active
  });
};

// Query hook for detailed health
export const useDetailedHealth = () => {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: () => apiService.getDetailedHealth(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Query hook for database status
export const useDatabaseStatus = () => {
  return useQuery({
    queryKey: ['system', 'database'],
    queryFn: () => apiService.getDatabaseStatus(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Query hook for system logs
export const useSystemLogs = () => {
  return useQuery({
    queryKey: ['system', 'logs'],
    queryFn: () => apiService.getSystemLogs(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Query hook for system settings
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['system', 'settings'],
    queryFn: () => apiService.getSystemSettings(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Mutation hook for updating system settings
export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (settings: any) => apiService.updateSystemSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'settings'] });
      
      toast({
        title: 'Settings updated',
        description: 'System settings have been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Failed to update system settings',
        variant: 'destructive',
      });
    },
  });
};

// Mutation hook for creating backup
export const useCreateBackup = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => apiService.createBackup(),
    onSuccess: () => {
      toast({
        title: 'Backup created',
        description: 'System backup has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Backup failed',
        description: error instanceof Error ? error.message : 'Failed to create backup',
        variant: 'destructive',
      });
    },
  });
};
