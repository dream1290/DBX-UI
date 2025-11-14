import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, organization?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAuthStatus();

    // Listen for auth logout events (from token refresh failures)
    const handleAuthLogout = () => {
      setUser(null);
      queryClient.clear();
      toast({
        title: "Session expired",
        description: "Please log in again",
        variant: "destructive",
      });
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const checkAuthStatus = async () => {
    try {
      // Check for new token key first, then fall back to old key for migration
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      if (token) {
        apiService.setToken(token);
        const userData = await apiService.getProfile();
        setUser(userData);
        
        // Migrate old token key if present
        if (localStorage.getItem('auth_token')) {
          localStorage.removeItem('auth_token');
          localStorage.setItem('access_token', token);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear auth data on failure
      localStorage.removeItem('auth_token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      apiService.setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Login returns only tokens, not user data
      await apiService.login(email, password);
      
      // Tokens are already stored by apiService.login()
      // Now fetch user profile separately
      const userData = await apiService.getProfile();
      setUser(userData);
      
      // Set profile in React Query cache
      queryClient.setQueryData(['profile'], userData);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      let errorMessage = "Invalid credentials";
      
      // Handle specific error status codes
      if (error.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.status === 403) {
        errorMessage = "Your account has been disabled. Please contact support.";
      } else if (error.status === 422) {
        errorMessage = "Invalid request format";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, organizationId?: string) => {
    try {
      // Register returns tokens AND user data
      const response = await apiService.register(email, password, fullName, organizationId);
      
      // Tokens are already stored by apiService.register()
      // User data is included in the response
      setUser(response.user);
      
      // Set profile in React Query cache
      queryClient.setQueryData(['profile'], response.user);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    } catch (error: any) {
      let errorMessage = "Registration failed";
      
      // Handle specific error status codes
      if (error.status === 400) {
        // Check if it's an organization error
        if (error.message && error.message.toLowerCase().includes('organization')) {
          errorMessage = "Invalid organization ID. Please leave the field blank or contact your administrator.";
        } else {
          errorMessage = "This email is already registered";
        }
      } else if (error.status === 422) {
        errorMessage = "Please check your information and try again";
      } else if (error.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data (tokens are cleared in apiService.logout())
      setUser(null);
      
      // Clear all React Query cache
      queryClient.clear();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await apiService.updateProfile(data);
      setUser(updatedUser);
      
      // Update profile in React Query cache
      queryClient.setQueryData(['profile'], updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};