import { useState } from "react";
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Eye, Activity } from "lucide-react";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { ConservationScore } from "@/components/genomic/ConservationScore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Security = () => {
  const [scanStatus, setScanStatus] = useState<"idle" | "running" | "completed">("idle");

  const securityMetrics = [
    { label: "Security Score", value: 94.5, variant: "success" },
    { label: "Vulnerability Count", value: 2, variant: "warning" },
    { label: "Failed Login Attempts", value: 12, variant: "danger" },
    { label: "API Key Usage", value: 87.3, variant: "primary" }
  ];

  const vulnerabilities = [
    {
      id: "VULN_001",
      severity: "medium",
      title: "Outdated Dependencies",
      description: "Some npm packages have known security vulnerabilities",
      affected: ["express", "lodash"],
      status: "open",
      discovered: "2024-01-20",
      cvss: 6.2
    },
    {
      id: "VULN_002", 
      severity: "low",
      title: "Missing Security Headers",
      description: "Some HTTP security headers are not configured",
      affected: ["X-Frame-Options", "Content-Security-Policy"],
      status: "mitigated",
      discovered: "2024-01-18", 
      cvss: 3.1
    }
  ];

  const apiKeys = [
    {
      id: "KEY_001",
      name: "Mobile App Integration",
      scope: ["flight-analysis", "fleet-management"],
      lastUsed: "2024-01-22 14:30",
      requests: 1247,
      status: "active"
    },
    {
      id: "KEY_002",
      name: "Third-party Analytics",
      scope: ["read-only", "reports"],
      lastUsed: "2024-01-22 12:15",
      requests: 456,
      status: "active" 
    },
    {
      id: "KEY_003",
      name: "Legacy System Bridge", 
      scope: ["data-export"],
      lastUsed: "2024-01-15 09:30",
      requests: 23,
      status: "inactive"
    }
  ];

  const securityEvents = [
    {
      timestamp: "2024-01-22 14:35:12",
      type: "authentication",
      severity: "high",
      message: "Multiple failed login attempts from suspicious IP",
      details: "IP: 192.168.1.100, Attempts: 15, User: admin",
      status: "blocked"
    },
    {
      timestamp: "2024-01-22 13:20:45", 
      type: "access",
      severity: "medium",
      message: "Unusual API access pattern detected",
      details: "KEY_001: 500 requests in 5 minutes (normal: ~50/5min)",
      status: "monitoring"
    },
    {
      timestamp: "2024-01-22 11:15:33",
      type: "system",
      severity: "low", 
      message: "Security scan completed successfully",
      details: "No critical vulnerabilities found, 2 medium issues identified",
      status: "resolved"
    }
  ];

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "high": case "critical": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "low";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": case "resolved": return "low";
      case "monitoring": case "mitigated": return "medium"; 
      case "blocked": case "open": return "high";
      default: return "low";
    }
  };

  const runSecurityScan = () => {
    setScanStatus("running");
    setTimeout(() => setScanStatus("completed"), 3000);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Security Center
          </h1>
          <p className="text-lg text-muted-foreground">
            Advanced threat detection and genomic-precision security monitoring for aviation systems.
          </p>
        </div>
        <Button 
          size="lg" 
          onClick={runSecurityScan}
          disabled={scanStatus === "running"}
          className="bg-gradient-to-r from-primary to-accent"
        >
          <Shield className="h-5 w-5 mr-2" />
          {scanStatus === "running" ? "Scanning..." : "Run Security Scan"}
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
          <GenomicCard key={index} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <ConservationScore 
              label={metric.label}
              score={metric.value}
              maxScore={metric.label.includes("Score") || metric.label.includes("Usage") ? 100 : 50}
              variant={metric.variant as "primary" | "success" | "danger" | "accent" | "warning"}
              showPercentage={metric.label.includes("Score") || metric.label.includes("Usage")}
            />
          </GenomicCard>
        ))}
      </div>

      {/* Security Scan Status */}
      {scanStatus !== "idle" && (
        <GenomicCard 
          title={scanStatus === "running" ? "Security Scan in Progress" : "Scan Completed"}
          icon={<Eye className="h-5 w-5" />}
          badge={scanStatus === "running" ? "Running" : "Complete"}
          badgeVariant={scanStatus === "running" ? "multirotor" : "low"}
        >
          {scanStatus === "running" ? (
            <div className="space-y-3">
              <div className="space-y-2">
                {[
                  "Scanning network ports...",
                  "Analyzing authentication systems...", 
                  "Checking for vulnerabilities...",
                  "Validating security configurations..."
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-primary rounded-full animate-genomic-pulse"></div>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-accent mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Security scan completed</h3>
              <p className="text-sm text-muted-foreground">
                System security posture analyzed. Review findings below.
              </p>
            </div>
          )}
        </GenomicCard>
      )}

      {/* Vulnerabilities */}
      <GenomicCard 
        title="Security Vulnerabilities"
        icon={<AlertTriangle className="h-5 w-5" />}
        badge={`${vulnerabilities.length} Found`}
        badgeVariant="medium"
      >
        <div className="space-y-4">
          {vulnerabilities.map((vuln) => (
            <div key={vuln.id} className="p-4 bg-secondary/20 rounded-lg border border-border/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-primary">{vuln.id}</span>
                    <Badge className={getSeverityVariant(vuln.severity)}>{vuln.severity}</Badge>
                    <Badge className={getStatusVariant(vuln.status)}>{vuln.status}</Badge>
                  </div>
                  <h4 className="text-sm font-medium text-foreground">{vuln.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{vuln.description}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>CVSS: {vuln.cvss}</div>
                  <div>{vuln.discovered}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {vuln.affected.map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs border border-destructive/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GenomicCard>

      {/* API Keys Management */}
      <GenomicCard 
        title="API Key Management" 
        icon={<Key className="h-5 w-5" />}
        badge={`${apiKeys.filter(k => k.status === 'active').length} Active`}
        badgeVariant="vtol"
      >
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div key={key.id} className="p-4 bg-secondary/20 rounded-lg border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground">{key.name}</h4>
                    <Badge className={getStatusVariant(key.status)}>{key.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{key.id}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs mb-3">
                <div>
                  <span className="text-muted-foreground block">Last Used</span>
                  <span className="text-foreground font-mono">{key.lastUsed}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Total Requests</span>
                  <span className="text-foreground font-mono">{key.requests}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Scopes</span>
                  <span className="text-foreground">{key.scope.length}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {key.scope.map((scope, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs border border-primary/20">
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GenomicCard>

      {/* Security Events */}
      <GenomicCard 
        title="Security Events Log"
        icon={<Activity className="h-5 w-5" />}
        badge="Live Monitoring"
        badgeVariant="multirotor"
      >
        <div className="space-y-3">
          {securityEvents.map((event, index) => (
            <div key={index} className="p-3 bg-secondary/20 rounded-lg border border-border/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityVariant(event.severity)}>{event.severity}</Badge>
                  <Badge className={getStatusVariant(event.status)}>{event.status}</Badge>
                  <span className="text-xs text-muted-foreground">{event.type}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{event.timestamp}</span>
              </div>
              <p className="text-sm text-foreground mb-1">{event.message}</p>
              <p className="text-xs text-muted-foreground font-mono">{event.details}</p>
            </div>
          ))}
        </div>
      </GenomicCard>
    </div>
  );
};

export default Security;