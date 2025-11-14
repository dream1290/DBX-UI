import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => apiService.getOrganizations(),
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => apiService.getOrganization(id),
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiService.createOrganization(data),
    onMutate: async (newOrg) => {
      await queryClient.cancelQueries({ queryKey: ['organizations'] });
      const previousOrgs = queryClient.getQueryData(['organizations']);
      
      // Optimistically add the new organization
      queryClient.setQueryData(['organizations'], (old: any) => [
        ...(old || []),
        { 
          ...newOrg, 
          id: `temp-${Date.now()}`, 
          status: 'active',
          userCount: 0,
          aircraftCount: 0,
          createdAt: new Date().toISOString()
        }
      ]);
      
      return { previousOrgs };
    },
    onError: (error: Error, _, context) => {
      queryClient.setQueryData(['organizations'], context?.previousOrgs);
      toast({
        title: "Failed to create organization",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Organization created",
        description: "New organization has been created successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useUpdateOrganization = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiService.updateOrganization(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['organizations', id] });
      const previousOrg = queryClient.getQueryData(['organizations', id]);
      
      queryClient.setQueryData(['organizations', id], (old: any) => ({
        ...old,
        ...data,
      }));
      
      return { previousOrg };
    },
    onError: (error: Error, variables, context) => {
      queryClient.setQueryData(['organizations', variables.id], context?.previousOrg);
      toast({
        title: "Failed to update organization",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Organization updated",
        description: "Organization has been updated successfully",
      });
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.id] });
    },
  });
};

export const useDeleteOrganization = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteOrganization(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['organizations'] });
      const previousOrgs = queryClient.getQueryData(['organizations']);
      
      queryClient.setQueryData(['organizations'], (old: any) =>
        old?.filter((org: any) => org.id !== id)
      );
      
      return { previousOrgs };
    },
    onError: (error: Error, _, context) => {
      queryClient.setQueryData(['organizations'], context?.previousOrgs);
      toast({
        title: "Failed to delete organization",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Organization deleted",
        description: "Organization has been removed successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};
