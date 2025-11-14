import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: readonly string[];
    requireAuth?: boolean;
}

export const ProtectedRoute = ({
    children,
    allowedRoles = [],
    requireAuth = true
}: ProtectedRouteProps) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (allowedRoles.length > 0 && user) {
        const userRole = user.role || '';
        const hasAccess = allowedRoles.includes(userRole);

        if (!hasAccess) {
            // Redirect to a safe fallback page (not dashboard to avoid loops)
            // If already on dashboard, show access denied, otherwise redirect to profile
            if (location.pathname === '/dashboard') {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-background">
                        <div className="text-center space-y-4 p-6">
                            <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
                            <p className="text-muted-foreground">You don't have permission to access this page.</p>
                            <Navigate to="/profile" replace />
                        </div>
                    </div>
                );
            }
            return <Navigate to="/profile" state={{ accessDenied: true }} replace />;
        }
    }

    return <>{children}</>;
};
