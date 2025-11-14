import { useState } from "react";
import { User, Mail, Shield, Calendar, Edit2, Save, X } from "lucide-react";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    phone: user?.phone || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
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
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <GenomicCard className="lg:col-span-1">
          <div className="flex flex-col items-center text-center p-6">
            <div className="h-24 w-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{user?.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
            <Badge className={getRoleVariant(user?.role || "")}>{user?.role}</Badge>
            
            <div className="w-full mt-6 pt-6 border-t border-border/30 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className="low">{user?.status || 'Active'}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Analyses Run</span>
                <span className="text-foreground font-medium">{user?.analysesRun || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground font-mono text-xs">
                  {user?.joinDate || user?.createdAt || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </GenomicCard>

        {/* Profile Details */}
        <GenomicCard className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Profile Information</h3>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="sm" disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-border/30">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{user?.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-border/30">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{user?.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  {isEditing ? (
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="Enter your department"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-border/30">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{user?.department || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-border/30">
                      <span className="text-foreground">{user?.phone || 'Not specified'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-border/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-border/30">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium text-foreground">{user?.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-border/30">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Last Login</p>
                      <p className="text-sm font-medium text-foreground">{user?.lastLogin || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {user?.permissions && user.permissions.length > 0 && (
                <div className="pt-6 border-t border-border/30">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.map((permission: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-secondary/30 rounded-full text-xs text-foreground border border-border/30"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </GenomicCard>
      </div>

      {/* Activity Summary */}
      <GenomicCard
        title="Recent Activity"
        icon={<Calendar className="h-5 w-5" />}
        badge="Last 30 Days"
        badgeVariant="low"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-secondary/20 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground mb-1">Analyses Completed</p>
            <p className="text-2xl font-bold text-foreground">{user?.analysesRun || 0}</p>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground mb-1">Reports Generated</p>
            <p className="text-2xl font-bold text-foreground">{user?.reportsGenerated || 0}</p>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground mb-1">Data Uploaded</p>
            <p className="text-2xl font-bold text-foreground">{user?.dataUploaded || '0 MB'}</p>
          </div>
        </div>
      </GenomicCard>
    </div>
  );
};

export default Profile;
