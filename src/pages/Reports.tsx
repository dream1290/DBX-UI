import { useState, useMemo } from "react";
import { FileText, Download, Filter, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateReportModal } from "@/components/modals/CreateReportModal";
import { useToast } from "@/hooks/use-toast";
import { useReports, useSystemMetrics } from "@/hooks/api";
import { apiService } from "@/lib/api";
import { StatsCardSkeleton } from "@/components/shared/LoadingStates";
import { EmptyReports } from "@/components/shared/EmptyStates";
import { ErrorState } from "@/components/shared/ErrorState";

const Reports = () => {
  const [reportType, setReportType] = useState("all");
  const [timeRange, setTimeRange] = useState("30days");
  const { toast } = useToast();

  const { data: reportsData = [], isLoading, error, refetch } = useReports();
  const { data: metrics, isLoading: metricsLoading } = useSystemMetrics();

  const reportTemplates = reportsData;

  const metricsData = [
    { label: "Total Reports Generated", value: metrics?.total_reports || "0", change: metrics?.reports_change || "+0%", variant: "primary" },
    { label: "Compliance Score", value: metrics?.compliance_score ? `${metrics.compliance_score}%` : "0%", change: metrics?.compliance_change || "+0%", variant: "success" },
    { label: "Critical Findings", value: metrics?.critical_findings || "0", change: metrics?.findings_change || "0%", variant: "danger" },
    { label: "Avg Processing Time", value: metrics?.avg_processing_time || "0min", change: metrics?.processing_change || "0%", variant: "accent" }
  ];

  const filteredReports = useMemo(() => {
    return reportTemplates.filter((report: any) =>
      reportType === "all" || report.type === reportType
    );
  }, [reportTemplates, reportType]);

  const handleExportReport = async (reportId: string, format: 'pdf' | 'csv' = 'pdf') => {
    try {
      if (format === 'pdf') {
        await apiService.exportReportPDF(reportId);
      } else {
        await apiService.exportReportCSV(reportId);
      }
      toast({
        title: "Export successful",
        description: `Report downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export report",
        variant: "destructive",
      });
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "safety": return "high";
      case "performance": return "multirotor";
      case "compliance": return "fixed-wing";
      case "fleet": return "vtol";
      default: return "low";
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
          Analytics & Reports
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive reporting suite with genomic-precision analytics and regulatory compliance documentation.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metricsLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          metricsData.map((metric, index) => (
            <GenomicCard key={index} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className={`risk-indicator ${metric.variant === 'success' ? 'risk-low' :
                  metric.variant === 'danger' ? 'risk-high' : 'aircraft-multirotor'}`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{metric.value}</h3>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </GenomicCard>
          ))
        )}
      </div>

      {/* Report Filters */}
      <GenomicCard>
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="safety">Safety Reports</SelectItem>
              <SelectItem value="performance">Performance Reports</SelectItem>
              <SelectItem value="compliance">Compliance Reports</SelectItem>
              <SelectItem value="fleet">Fleet Reports</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="flex-shrink-0"
            onClick={() => toast({ title: "Export started", description: "All reports are being prepared for download." })}
          >
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </GenomicCard>

      {/* Report Templates Grid */}
      {error && <ErrorState message={error.message} onRetry={refetch} />}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Available Reports</h2>
          <CreateReportModal>
            <Button className="bg-gradient-to-r from-primary to-accent w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              Create Custom Report
            </Button>
          </CreateReportModal>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
          </div>
        ) : filteredReports.length === 0 && reportType === "all" ? (
          <EmptyReports />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredReports.map((report: any) => (
              <GenomicCard
                key={report.id}
                className="p-6"
                title={report.name}
                icon={<FileText className="h-5 w-5" />}
                badge={report.type}
                badgeVariant={getTypeVariant(report.type)}
              >
                <div className="space-y-4">
                  {/* Report Description */}
                  <p className="text-sm text-muted-foreground">{report.description}</p>

                  {/* Report Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Frequency</span>
                      <span className="text-foreground font-medium">{report.frequency}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Last Generated</span>
                      <span className="text-foreground font-mono text-xs">{report.lastGenerated}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Size</span>
                      <span className="text-foreground font-medium">{report.size}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Pages</span>
                      <span className="text-foreground font-medium">{report.pages}</span>
                    </div>
                  </div>

                  {/* Report Sections */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Report Sections</h4>
                    <div className="flex flex-wrap gap-1">
                      {(report.sections || []).map((section: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-secondary/30 rounded text-xs text-foreground">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleExportReport(report.id)}
                      disabled={exportPDF.isPending}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {exportPDF.isPending ? 'Generating...' : 'Generate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toast({ title: "Preview loading", description: "Report preview is being prepared." })}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </GenomicCard>
            ))}
          </div>
        )}
      </div>

      {/* Recent Reports */}
      <GenomicCard
        title="Recent Reports"
        icon={<TrendingUp className="h-5 w-5" />}
        badge="Generated"
        badgeVariant="low"
      >
        <div className="space-y-3">
          {[
            { name: "Weekly Safety Analysis - Week 3", date: "2024-01-21", size: "1.8 MB", downloads: 24 },
            { name: "Monthly Compliance Report - January", date: "2024-01-20", size: "2.4 MB", downloads: 18 },
            { name: "Fleet Health Assessment", date: "2024-01-18", size: "2.1 MB", downloads: 31 },
            { name: "Performance Analytics - Q1", date: "2024-01-15", size: "3.2 MB", downloads: 42 }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/30">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground">Generated {report.date} • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{report.downloads} downloads</span>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GenomicCard>
    </div>
  );
};

export default Reports;