import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Plane,
  BarChart3,
  Upload,
  Settings,
  Users,
  Activity,
  FileText,
  Shield,
  Zap,
  Dna,
  Hexagon,
  Building2,
  Bell,
  Key,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { hasRouteAccess, ROUTE_PERMISSIONS } from "@/config/roles";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3, permission: ROUTE_PERMISSIONS.DASHBOARD },
  { title: "Flight Analysis", url: "/analysis", icon: Activity, permission: ROUTE_PERMISSIONS.FLIGHT_ANALYSIS },
  { title: "Fleet Management", url: "/fleet", icon: Plane, permission: ROUTE_PERMISSIONS.FLEET_MANAGEMENT },
  { title: "Upload Data", url: "/upload", icon: Upload, permission: ROUTE_PERMISSIONS.UPLOAD_DATA },
  { title: "Reports", url: "/reports", icon: FileText, permission: ROUTE_PERMISSIONS.REPORTS },
];

const systemNavItems = [
  { title: "My Profile", url: "/profile", icon: User, permission: ROUTE_PERMISSIONS.PROFILE },
  { title: "User Management", url: "/users", icon: Users, permission: ROUTE_PERMISSIONS.USER_MANAGEMENT },
  { title: "Organizations", url: "/organizations", icon: Building2, permission: ROUTE_PERMISSIONS.ORGANIZATIONS },
  { title: "API Keys", url: "/api-keys", icon: Key, permission: ROUTE_PERMISSIONS.API_KEYS },
  { title: "Notifications", url: "/notifications", icon: Bell, permission: ROUTE_PERMISSIONS.NOTIFICATIONS },
  { title: "System Admin", url: "/admin", icon: Settings, permission: ROUTE_PERMISSIONS.SYSTEM_ADMIN },
  { title: "Security", url: "/security", icon: Shield, permission: ROUTE_PERMISSIONS.SECURITY },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const userRole = user?.role || '';

  // Filter navigation items based on user role
  const filteredMainNavItems = useMemo(() => {
    return mainNavItems.filter(item => 
      hasRouteAccess(userRole, item.permission)
    );
  }, [userRole]);

  const filteredSystemNavItems = useMemo(() => {
    return systemNavItems.filter(item => 
      hasRouteAccess(userRole, item.permission)
    );
  }, [userRole]);

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/dashboard";
    return currentPath.startsWith(path);
  };

  const getNavCls = (active: boolean) =>
    active 
      ? "bg-primary/20 text-primary border-primary/30 shadow-lg shadow-primary/10" 
      : "hover:bg-secondary/50 hover:text-foreground text-muted-foreground";

  return (
    <Sidebar
      collapsible="icon"
    >
      {/* DBX AI Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Dna className="h-8 w-8 text-primary animate-dna-helix" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm"></div>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                DBX
              </h2>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="p-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/80 font-semibold">
            {!isCollapsed && "Mission Control"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${getNavCls(isActive(item.url))} transition-all duration-200 border border-transparent hover:border-border/30`}
                  >
                    <NavLink to={item.url} end={item.url === "/dashboard"}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                      {!isCollapsed && isActive(item.url) && (
                        <Hexagon className="h-3 w-3 ml-auto text-primary animate-genomic-pulse" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Administration */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-accent/80 font-semibold">
            {!isCollapsed && "System Operations"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSystemNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${getNavCls(isActive(item.url))} transition-all duration-200 border border-transparent hover:border-border/30`}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                      {!isCollapsed && isActive(item.url) && (
                        <Zap className="h-3 w-3 ml-auto text-accent animate-genomic-pulse" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Genomic Status Indicator */}
        {!isCollapsed && (
          <div className="mt-6 p-3 rounded-lg bg-gradient-to-br from-card via-card/80 to-secondary/20 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-primary animate-genomic-pulse" />
              <span className="text-sm font-medium">System Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">AI Models</span>
                <span className="text-primary">Online</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Data Pipeline</span>
                <span className="text-accent">Active</span>
              </div>
              <div className="conservation-bar h-1 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"></div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}