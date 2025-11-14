import { useState, useMemo } from "react";
import { Users, UserPlus, Search, Filter, Shield, Settings, Mail } from "lucide-react";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AddUserModal } from "@/components/modals/AddUserModal";
import { useToast } from "@/hooks/use-toast";
import { useUsers, useUserActivity } from "@/hooks/api/useUsers";
import { UserCardSkeleton } from "@/components/shared/LoadingStates";
import { EmptyUsers } from "@/components/shared/EmptyStates";
import { ErrorState } from "@/components/shared/ErrorState";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { toast } = useToast();
  
  const { data: usersData, isLoading, error, refetch } = useUsers();
  const { data: activityData, isLoading: activityLoading } = useUserActivity({ limit: 10, autoRefresh: true });
  const users = usersData || [];
  const recentActivity = activityData || [];

  const roleStats = useMemo(() => {
    const stats: Record<string, number> = {};
    users.forEach((user: any) => {
      const role = user.role || 'Viewer';
      stats[role] = (stats[role] || 0) + 1;
    });
    
    return [
      { role: "System Administrator", count: stats["System Administrator"] || 0, color: "high" },
      { role: "Safety Analyst", count: stats["Safety Analyst"] || 0, color: "multirotor" },
      { role: "Fleet Manager", count: stats["Fleet Manager"] || 0, color: "fixed-wing" },
      { role: "Data Analyst", count: stats["Data Analyst"] || 0, color: "vtol" },
      { role: "Viewer", count: stats["Viewer"] || 0, color: "low" }
    ];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user: any) => {
      const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.department || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || (user.role || '').toLowerCase().replace(" ", "-") === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "low";
      case "inactive": return "medium";
      case "suspended": return "high";
      default: return "low";
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case "System Administrator": return "high";
      case "Safety Analyst": return "multirotor";
      case "Fleet Manager": return "fixed-wing";
      case "Data Analyst": return "vtol";
      default: return "low";
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Genomic-precision user access control and role-based security management.
          </p>
        </div>
        <AddUserModal>
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent w-full lg:w-auto">
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </Button>
        </AddUserModal>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {roleStats.map((stat) => (
          <GenomicCard key={stat.role} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className={`risk-indicator ${stat.color}`}>
                {stat.count}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{stat.count}</h3>
            <p className="text-xs text-muted-foreground">{stat.role}</p>
          </GenomicCard>
        ))}
      </div>

      {/* Search and Filters */}
      <GenomicCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="system-administrator">System Administrator</SelectItem>
              <SelectItem value="safety-analyst">Safety Analyst</SelectItem>
              <SelectItem value="fleet-manager">Fleet Manager</SelectItem>
              <SelectItem value="data-analyst">Data Analyst</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GenomicCard>

      {/* Users List */}
      {error && <ErrorState message={error.message} onRetry={refetch} />}
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">System Users</h2>
          <div className="text-sm text-muted-foreground">
            {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <UserCardSkeleton />
            <UserCardSkeleton />
            <UserCardSkeleton />
            <UserCardSkeleton />
          </div>
        ) : filteredUsers.length === 0 && !searchQuery && roleFilter === "all" ? (
          <EmptyUsers />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredUsers.map((user: any) => (
            <GenomicCard key={user.id} className="p-6">
              <div className="space-y-4">
                {/* User Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground mono-genomic">ID: {user.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getRoleVariant(user.role)}>{user.role}</Badge>
                    <Badge className={getStatusVariant(user.status)}>{user.status}</Badge>
                  </div>
                </div>

                {/* User Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Department</span>
                    <span className="text-foreground font-medium">{user.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Analyses Run</span>
                    <span className="text-foreground font-medium">{user.analysesRun}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Last Login</span>
                    <span className="text-foreground font-mono text-xs">{user.lastLogin}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Join Date</span>
                    <span className="text-foreground font-mono text-xs">{user.joinDate}</span>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-1">
                    {(user.permissions || []).map((permission: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-secondary/30 rounded text-xs text-foreground border border-border/30">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toast({ title: "Edit user", description: "User edit form would open here." })}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toast({ title: "Permissions", description: "Permission management would open here." })}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Permissions
                  </Button>
                </div>
              </div>
            </GenomicCard>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <GenomicCard 
        title="Recent User Activity"
        icon={<Users className="h-5 w-5" />}
        badge="Live Updates"
        badgeVariant="low"
      >
        {activityLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/30">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'admin' || activity.action_type === 'admin' ? 'bg-destructive animate-genomic-pulse' :
                    activity.type === 'analysis' || activity.action_type === 'analysis' ? 'bg-primary animate-genomic-pulse' :
                    activity.type === 'fleet' || activity.action_type === 'fleet' ? 'bg-accent' : 'bg-muted-foreground'
                  }`}></div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user || activity.user_name}</span> {activity.action || activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time || activity.timestamp || activity.created_at}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GenomicCard>

      {filteredUsers.length === 0 && (searchQuery || roleFilter !== "all") && (
        <GenomicCard className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No users found</h3>
            <p className="text-sm">Try adjusting your search terms or filters.</p>
          </div>
        </GenomicCard>
      )}
    </div>
  );
};

export default UserManagement;