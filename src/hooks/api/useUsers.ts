import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiService.getUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiService.createUser(data),
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);
      
      // Optimistically add the new user
      queryClient.setQueryData(['users'], (old: any) => [
        ...(old || []),
        { ...newUser, id: `temp-${Date.now()}`, status: 'active', analysesRun: 0 }
      ]);
      
      return { previousUsers };
    },
    onError: (error: Error, _, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
      toast({
        title: "Failed to create user",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "User created",
        description: "New user has been added successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      toast({
        title: "User updated",
        description: "User information has been updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);
      
      // Optimistically remove the user
      queryClient.setQueryData(['users'], (old: any) =>
        old?.filter((user: any) => user.id !== id)
      );
      
      return { previousUsers };
    },
    onError: (error: Error, _, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "User has been removed successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUserActivity = (options?: { limit?: number; autoRefresh?: boolean }) => {
  return useQuery({
    queryKey: ['users', 'activity', options?.limit],
    queryFn: () => apiService.getUserActivity(options?.limit),
    refetchInterval: options?.autoRefresh ? 30 * 1000 : false, // 30 seconds
  });
};
