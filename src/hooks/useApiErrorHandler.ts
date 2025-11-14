import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/api';

export const useApiErrorHandler = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: unknown) => {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            // Unauthorized - clear auth and redirect to login
            localStorage.removeItem('auth_token');
            queryClient.clear();
            navigate('/login');
            toast({
              title: 'Session expired',
              description: 'Please log in again',
              variant: 'destructive',
            });
            break;

          case 403:
            // Forbidden
            toast({
              title: 'Access denied',
              description: 'You do not have permission to perform this action',
              variant: 'destructive',
            });
            break;

          case 404:
            // Not found - usually handled by individual components
            break;

          case 500:
          case 502:
          case 503:
            // Server errors
            toast({
              title: 'Server error',
              description: 'Something went wrong on our end. Please try again later.',
              variant: 'destructive',
            });
            break;

          default:
            // Other errors
            toast({
              title: 'Error',
              description: error.message || 'An unexpected error occurred',
              variant: 'destructive',
            });
        }
      } else if (error instanceof Error) {
        // Network errors or other errors
        if (error.message.includes('Network error')) {
          toast({
            title: 'Network error',
            description: 'Please check your internet connection',
            variant: 'destructive',
          });
        }
      }
    };

    // Set up global error handler for React Query
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'observerResultsUpdated') {
        const query = event.query;
        if (query.state.error) {
          handleError(query.state.error);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, navigate, toast]);
};
