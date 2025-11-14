import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from "@/hooks/api";
import { 
  Key, 
  Plus, 
  Copy, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Activity,
  AlertTriangle,
  Shield
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  usage: number;
  limit: number;
  scopes: string[];
  createdAt: string;
  expiresAt: string;
  lastUsed?: string;
}

const ApiKeys = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const { toast } = useToast();

  // Use React Query hooks
  const { data: apiKeys = [], isLoading: loading, refetch } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const deleteApiKey = useDeleteApiKey();

  const [formData, setFormData] = useState({
    name: "",
    scopes: [] as string[],
    expiresIn: "30" // days
  });

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createApiKey.mutateAsync(formData);
      
      // Store the new key value to display it once
      if (result && result.key) {
        setNewKeyValue(result.key);
      }
      
      setIsCreateModalOpen(false);
      setFormData({ name: "", scopes: [], expiresIn: "30" });
    } catch (error) {
      // Error already handled by the hook
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteApiKey.mutateAsync(id);
    } catch (error) {
      // Error already handled by the hook
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard"
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getUsageColor = (usage: number, limit: number) => {
    const percentage = (usage / limit) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}${'*'.repeat(16)}${key.substring(key.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                API Keys Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage API keys for secure programmatic access to your system
              </p>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateApiKey} className="space-y-4">
                  <div>
                    <Label htmlFor="name">API Key Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Production Integration"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expires">Expires In</Label>
                    <Select value={formData.expiresIn} onValueChange={(value) => setFormData(prev => ({ ...prev, expiresIn: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="never">Never expires</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Key</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className="hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Created {new Date(apiKey.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(apiKey.status)}>
                    {apiKey.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
                  <code className="flex-1 text-sm font-mono">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="h-8 w-8 p-0"
                  >
                    {visibleKeys.has(apiKey.id) ? 
                      <EyeOff className="h-3 w-3" /> : 
                      <Eye className="h-3 w-3" />
                    }
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(apiKey.key)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Usage</span>
                    <span className={`font-semibold ${getUsageColor(apiKey.usage || 0, apiKey.limit || 0)}`}>
                      {(apiKey.usage || 0).toLocaleString()} / {(apiKey.limit || 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground block">Last Used</span>
                    <span className="font-mono text-xs">
                      {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground block">Expires</span>
                    <span className="font-mono text-xs">
                      {apiKey.expiresAt ? new Date(apiKey.expiresAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground block">Scopes</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(apiKey.scopes || []).slice(0, 2).map((scope: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                      {(apiKey.scopes || []).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(apiKey.scopes || []).length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {(apiKey.usage / apiKey.limit) > 0.8 && (
                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Near limit</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {apiKeys.length === 0 && (
          <div className="text-center py-12">
            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API keys found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first API key to start using our API
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create API Key
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeys;