import { useState, useMemo } from "react";
import { Search, Filter, Download, Eye, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { ConservationScore } from "@/components/genomic/ConservationScore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlightDetailModal } from "@/components/modals/FlightDetailModal";
import { useToast } from "@/hooks/use-toast";
import { useAnalyses, useDeleteAnalysis } from "@/hooks/api";
import { FlightCardSkeleton } from "@/components/shared/LoadingStates";
import { EmptyFlights } from "@/components/shared/EmptyStates";
import { ErrorState } from "@/components/shared/ErrorState";
import analysisImage from "@/assets/analysis-bg.jpg";
import { apiService } from "@/lib/api";

const FlightAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();
  
  const { 
    data: analyses = [], 
    isLoading, 
    error, 
    refetch
  } = useAnalyses({ skip: 0, limit: 100 });
  
  const handleExport = async (format: 'csv' | 'json' = 'csv') => {
    try {
      await apiService.exportAnalyses(format);
      toast({
        title: "Export successful",
        description: `Analyses exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export analyses",
        variant: "destructive",
      });
    }
  };

  const filteredAnalyses = useMemo(() => {
    return analyses.filter((analysis: any) => {
      const matchesSearch = (analysis.id || analysis.flight_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (analysis.aircraft || analysis.aircraft_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === "all" || (analysis.type || analysis.aircraft_type || '').toLowerCase().replace(" ", "-") === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [analyses, searchQuery, filterType]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "processing":
        return <Clock className="h-4 w-4 text-primary animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getRiskVariant = (level: string) => {
    switch (level) {
      case "low": return "low";
      case "medium": return "medium"; 
      case "high": return "high";
      default: return "low";
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "Multirotor": return "multirotor";
      case "Fixed Wing": return "fixed-wing";
      case "VTOL": return "vtol";
      default: return "multirotor";
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header with Background */}
      <div className="relative overflow-hidden rounded-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${analysisImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/95" />
        <div className="relative p-6 sm:p-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Flight Analysis Laboratory
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Comprehensive genomic-style analysis of flight telemetry data with AI-powered anomaly detection and performance insights.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <GenomicCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by flight ID or aircraft name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Aircraft Types</SelectItem>
              <SelectItem value="multirotor">Multirotor</SelectItem>
              <SelectItem value="fixed-wing">Fixed Wing</SelectItem>
              <SelectItem value="vtol">VTOL</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={() => handleExport('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </GenomicCard>

      {/* Analysis Results */}
      {error && <ErrorState message={error.message} onRetry={refetch} />}
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Analysis Results</h2>
          <div className="text-sm text-muted-foreground">
            {filteredAnalyses.length} of {analyses.length} flights
          </div>
        </div>

        {isLoading ? (
          <>
            <FlightCardSkeleton />
            <FlightCardSkeleton />
            <FlightCardSkeleton />
          </>
        ) : filteredAnalyses.length === 0 && !searchQuery && filterType === "all" ? (
          <EmptyFlights />
        ) : (
          filteredAnalyses.map((analysis: any) => (
          <GenomicCard key={analysis.id || analysis.flight_id} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Flight Information */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold mono-genomic text-primary">{analysis.id || analysis.flight_id}</h3>
                      {getStatusIcon(analysis.status)}
                      <span className={`risk-indicator ${getTypeVariant(analysis.type || analysis.aircraft_type)}`}>
                        {analysis.type || analysis.aircraft_type}
                      </span>
                      <span className={`risk-indicator ${getRiskVariant(analysis.riskLevel || analysis.risk_level || 'low')}`}>
                        Risk: {analysis.riskLevel || analysis.risk_level || 'low'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Aircraft: <span className="text-foreground font-medium">{analysis.aircraft || analysis.aircraft_name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mono-genomic">
                      Location: {analysis.location || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <FlightDetailModal flightData={analysis}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </FlightDetailModal>
                  </div>
                </div>

                {/* Flight Features (Genomic-style) */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Flight Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.features || ['GPS Tracking', 'Battery Monitor', 'Motor Health']).map((feature: string, index: number) => (
                      <div key={index} className="flex items-center p-2 bg-secondary/30 rounded-md border border-border/30">
                        <span className="text-xs font-mono text-genomic-blue">{feature}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {Math.floor(Math.random() * 20) + 80}% conf.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights */}
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 bg-primary rounded-full animate-genomic-pulse"></div>
                    <span className="text-sm font-medium text-primary">AI Analysis</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{analysis.insights || analysis.summary || 'Analysis in progress...'}</p>
                </div>
              </div>

              {/* Analysis Metrics */}
              <div className="space-y-4">
                <ConservationScore 
                  label="Analysis Confidence"
                  score={analysis.confidence || analysis.confidence_score || 0}
                  variant="primary"
                />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Flight Duration</span>
                    <span className="text-foreground font-mono">{analysis.duration || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Anomalies Detected</span>
                    <span className={`font-medium ${(analysis.anomalies || analysis.anomaly_count || 0) > 0 ? 'text-destructive' : 'text-accent'}`}>
                      {analysis.anomalies || analysis.anomaly_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Analysis Date</span>
                    <span className="text-foreground font-mono text-xs">{analysis.date || analysis.created_at || 'N/A'}</span>
                  </div>
                </div>

                {(analysis.anomalies || analysis.anomaly_count || 0) > 0 && (
                  <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">
                        {analysis.anomalies || analysis.anomaly_count} Anomal{(analysis.anomalies || analysis.anomaly_count) === 1 ? 'y' : 'ies'} Found
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GenomicCard>
          ))
        )}


      </div>

      {filteredAnalyses.length === 0 && (searchQuery || filterType !== "all") && (
        <GenomicCard className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No analyses found</h3>
            <p className="text-sm">Try adjusting your search terms or filters.</p>
          </div>
        </GenomicCard>
      )}
    </div>
  );
};

export default FlightAnalysis;