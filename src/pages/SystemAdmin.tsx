import { useState, useEffect } from "react";
import { Settings, Server, Database, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle } from "lucide-react";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { ConservationScore } from "@/components/genomic/ConservationScore";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useSystemMetrics, useSystemStatus, useSystemLogs, useSystemSettings, useUpdateSystemSettings } from "@/hooks/api/useSystem";
import { StatsCardSkeleton } from "@/components/shared/LoadingStates";
import { ErrorState } from "@/components/shared/ErrorState";
import { useToast } from "@/hooks/use-toast";

const SystemAdmin = () => {
  const { toast } = useToast();
  const { data: settingsData, isLoading: settingsLoading } = useSystemSettings();
  const updateSettings = useUpdateSystemSettings();

  const [systemSettings, setSystemSettings] = useState({
    autoAnalysis: true,
    realTimeAlerts: true,
    dataRetention: false,
    debugLogging: false,
    apiRateLimit: true
  });

  // Update local state when API data loads
  useEffect(() => {
    if (settingsData) {
      setSystemSettings({
        autoAnalysis: settingsData.autoAnalysis ?? settingsData.auto_analysis ?? true,
        realTimeAlerts: settingsData.realTimeAlerts ?? settingsData.real_time_alerts ?? true,
        dataRetention: settingsData.dataRetention ?? settingsData.data_retention ?? false,
        debugLogging: settingsData.debugLogging ?? settingsData.debug_logging ?? false,
        apiRateLimit: settingsData.apiRateLimit ?? settingsData.api_rate_limit ?? true,
      });
    }
  }, [settingsData]);

  const { data: metricsData, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useSystemMetrics({ autoRefresh: true });
  const { data: statusData, isLoading: statusLoading, error: statusError, refetch: refetchStatus } = useSystemStatus({ autoRefresh: true });
  const { data: logsData, isLoading: logsLoading } = useSystemLogs();

  const systemMetrics = [
    {
      label: "CPU Usage",
      value: metricsData?.cpu_usage || 0,
      max: 100,
      unit: "%",
      status: metricsData?.cpu_status || "healthy",
      icon: Cpu
    },
    {
      label: "Memory Usage",
      value: metricsData?.memory_usage || 0,
      max: 100,
      unit: "%",
      status: metricsData?.memory_status || "normal",
      icon: Server
    },
    {
      label: "Storage Usage",
      value: metricsData?.storage_usage || 0,
      max: 100,
      unit: "%",
      status: metricsData?.storage_status || "healthy",
      icon: HardDrive
    },
    {
      label: "Network I/O",
      value: metricsData?.network_io || 0,
      max: 100,
      unit: "Mbps",
      status: metricsData?.network_status || "healthy",
      icon: Wifi
    },
  ];

  const services = statusData?.services || [];
  const recentEvents = logsData?.logs || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-genomic-orange" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Server className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "running": return "low";
      case "warning": return "medium";
      case "error": return "high";
      default: return "low";
    }
  };

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "info": return "low";
      case "warning": return "medium";
      case "error": return "high";
      default: return "low";
    }
  };

  const getMetricVariant = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage > 80) return "danger";
    if (percentage > 60) return "warning";
    return "success";
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
          System Administration
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive system monitoring and configuration with genomic-precision operational intelligence.
        </p>
      </div>

      {/* System Metrics */}
      {metricsError && <ErrorState message={metricsError.message} onRetry={refetchMetrics} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metricsLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          systemMetrics.map((metric) => (
            <GenomicCard key={metric.label} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <metric.icon className="h-5 w-5 text-primary" />
                <Badge className={getStatusVariant(metric.status)}>{metric.status}</Badge>
              </div>
              <ConservationScore
                label={metric.label}
                score={metric.value}
                maxScore={metric.max}
                variant={getMetricVariant(metric.value, metric.max)}
                showPercentage={metric.unit === "%"}
              />
              {metric.unit !== "%" && (
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.value} {metric.unit}
                </p>
              )}
            </GenomicCard>
          ))
        )}
      </div>

      {/* System Configuration */}
      <GenomicCard
        title="System Configuration"
        icon={<Settings className="h-5 w-5" />}
        badge="Global Settings"
        badgeVariant="multirotor"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              key: "autoAnalysis",
              label: "Automatic Analysis",
              description: "Enable automatic processing of uploaded flight data",
              critical: false
            },
            {
              key: "realTimeAlerts",
              label: "Real-time Alerts",
              description: "Send immediate notifications for critical anomalies",
              critical: true
            },
            {
              key: "dataRetention",
              label: "Extended Data Retention",
              description: "Keep analysis data for longer than standard period",
              critical: false
            },
            {
              key: "debugLogging",
              label: "Debug Logging",
              description: "Enable detailed logging for troubleshooting",
              critical: false
            },
            {
              key: "apiRateLimit",
              label: "API Rate Limiting",
              description: "Enforce request rate limits for external integrations",
              critical: true
            }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-foreground">{setting.label}</h4>
                  {setting.critical && (
                    <Badge className="risk-medium">Critical</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
              </div>
              <Switch
                checked={systemSettings[setting.key as keyof typeof systemSettings]}
                disabled={updateSettings.isPending}
                onCheckedChange={(checked) => {
                  const newSettings = { ...systemSettings, [setting.key]: checked };
                  setSystemSettings(newSettings);
                  updateSettings.mutate(newSettings, {
                    onSuccess: () => {
                      toast({
                        title: "Settings updated",
                        description: `${setting.label} has been ${checked ? 'enabled' : 'disabled'}`,
                      });
                    },
                    onError: (error: Error) => {
                      toast({
                        title: "Failed to update settings",
                        description: error.message,
                        variant: "destructive",
                      });
                      // Revert on error
                      setSystemSettings(systemSettings);
                    },
                  });
                }}
              />
            </div>
          ))}
        </div>
      </GenomicCard>

      {/* Services Status */}
      {statusError && <ErrorState message={statusError.message} onRetry={refetchStatus} />}

      <GenomicCard
        title="Services & Components"
        icon={<Server className="h-5 w-5" />}
        badge={`${services.filter((s: any) => s.status === 'running').length}/${services.length} Running`}
        badgeVariant="low"
      >
        {statusLoading ? (
          <div className="space-y-4">
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No services data available
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service: any) => (
              <div key={service.name} className="p-4 bg-secondary/20 rounded-lg border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{service.name}</h4>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusVariant(service.status)}>{service.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Uptime</span>
                    <span className="text-foreground font-mono">{service.uptime}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Version</span>
                    <span className="text-foreground font-mono">{service.version}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Memory</span>
                    <span className="text-foreground font-mono">{service.memory}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">CPU</span>
                    <span className="text-foreground font-mono">{service.cpu}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GenomicCard>

      {/* System Events */}
      <GenomicCard
        title="Recent System Events"
        icon={<Database className="h-5 w-5" />}
        badge="Live Log"
        badgeVariant="vtol"
      >
        {logsLoading ? (
          <div className="space-y-3">
            <div className="h-16 bg-muted animate-pulse rounded-lg" />
            <div className="h-16 bg-muted animate-pulse rounded-lg" />
            <div className="h-16 bg-muted animate-pulse rounded-lg" />
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent events
          </div>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event: any, index: number) => (
              <div key={index} className="p-3 bg-secondary/20 rounded-lg border border-border/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getLevelVariant(event.level)}>{event.level}</Badge>
                    <span className="text-sm font-medium text-foreground">{event.service}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{event.timestamp}</span>
                </div>
                <p className="text-sm text-foreground mb-1">{event.message}</p>
                <p className="text-xs text-muted-foreground">{event.details}</p>
              </div>
            ))}
          </div>
        )}
      </GenomicCard>
    </div>
  );
};

export default SystemAdmin;