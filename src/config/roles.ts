// Role definitions
export const ROLES = {
  SYSTEM_ADMIN: 'System Administrator',
  SAFETY_ANALYST: 'Safety Analyst',
  FLEET_MANAGER: 'Fleet Manager',
  DATA_ANALYST: 'Data Analyst',
  VIEWER: 'Viewer',
  USER: 'user', // Backend default role (lowercase)
  ADMIN: 'admin', // Backend admin role (lowercase)
} as const;

// Route permissions by role
export const ROUTE_PERMISSIONS = {
  // Public routes - no authentication required
  PUBLIC: [],

  // Dashboard - all authenticated users
  DASHBOARD: [
    ROLES.SYSTEM_ADMIN,
    ROLES.SAFETY_ANALYST,
    ROLES.FLEET_MANAGER,
    ROLES.DATA_ANALYST,
    ROLES.VIEWER,
    ROLES.USER, // Backend default role
    ROLES.ADMIN, // Backend admin role
  ],

  // Flight Analysis - analysts and admins
  FLIGHT_ANALYSIS: [
    ROLES.SYSTEM_ADMIN,
    ROLES.SAFETY_ANALYST,
    ROLES.DATA_ANALYST,
    ROLES.VIEWER,
    ROLES.USER, // Backend default role
    ROLES.ADMIN, // Backend admin role
  ],

  // Fleet Management - fleet managers and admins
  FLEET_MANAGEMENT: [
    ROLES.SYSTEM_ADMIN,
    ROLES.FLEET_MANAGER,
    ROLES.SAFETY_ANALYST,
    ROLES.USER, // Backend default role
    ROLES.ADMIN, // Backend admin role
  ],

  // Upload Data - analysts and fleet managers
  UPLOAD_DATA: [
    ROLES.SYSTEM_ADMIN,
    ROLES.SAFETY_ANALYST,
    ROLES.FLEET_MANAGER,
    ROLES.DATA_ANALYST,
    ROLES.USER, // Backend default role
    ROLES.ADMIN, // Backend admin role
  ],

  // Reports - all except viewers
  REPORTS: [
    ROLES.SYSTEM_ADMIN,
    ROLES.SAFETY_ANALYST,
    ROLES.FLEET_MANAGER,
    ROLES.DATA_ANALYST,
    ROLES.USER, // Backend default role
    ROLES.ADMIN, // Backend admin role
  ],

  // User Management - admins only
  USER_MANAGEMENT: [ROLES.SYSTEM_ADMIN, ROLES.ADMIN],

  // Organizations - admins and fleet managers
  ORGANIZATIONS: [ROLES.SYSTEM_ADMIN, ROLES.FLEET_MANAGER, ROLES.ADMIN, ROLES.USER],

  // System Admin - admins only
  SYSTEM_ADMIN: [ROLES.SYSTEM_ADMIN, ROLES.ADMIN],

  // Security - admins only
  SECURITY: [ROLES.SYSTEM_ADMIN, ROLES.ADMIN],

  // API Keys - admins and data analysts
  API_KEYS: [ROLES.SYSTEM_ADMIN, ROLES.DATA_ANALYST, ROLES.ADMIN, ROLES.USER],

  // Notifications - all authenticated users
  NOTIFICATIONS: [
    ROLES.SYSTEM_ADMIN,
    ROLES.SAFETY_ANALYST,
    ROLES.FLEET_MANAGER,
    ROLES.DATA_ANALYST,
    ROLES.VIEWER,
    ROLES.USER, // Backend default role
    ROLES.ADMIN, // Backend admin role
  ],

  // Profile - all authenticated users
  PROFILE: [
    ROLES.SYSTEM_ADMIN,
    ROLES.SAFETY_ANALYST,
    ROLES.FLEET_MANAGER,
    ROLES.DATA_ANALYST,
    ROLES.VIEWER,
    ROLES.USER, // Backend default role
    ROLES.ADMIN, // Backend admin role
  ],
} as const;

// Helper function to check if user has access to a route
export const hasRouteAccess = (userRole: string, allowedRoles: readonly string[]): boolean => {
  return allowedRoles.includes(userRole);
};

// Get default route based on user role
export const getDefaultRoute = (userRole: string): string => {
  switch (userRole) {
    case ROLES.SYSTEM_ADMIN:
    case ROLES.ADMIN:
      return '/dashboard';
    case ROLES.SAFETY_ANALYST:
      return '/analysis';
    case ROLES.FLEET_MANAGER:
      return '/fleet';
    case ROLES.DATA_ANALYST:
      return '/analysis';
    case ROLES.VIEWER:
      return '/dashboard';
    case ROLES.USER:
      return '/dashboard';
    default:
      return '/dashboard';
  }
};
