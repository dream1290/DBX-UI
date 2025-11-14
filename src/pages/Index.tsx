import { Activity, TrendingUp, AlertTriangle, Plane, Database } from "lucide-react";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { ConservationScore } from "@/components/genomic/ConservationScore";
import { Button } from "@/components/ui/button";
import { DocumentationModal } from "@/components/modals/DocumentationModal";
import { useNavigate } from "react-router-dom";
import { useSystemMetrics } from "@/hooks/api";
import { useAnalyses } from "@/hooks/api";
import { useAircraft } from "@/hooks/api";
import { StatsCardSkeleton, FlightCardSkeleton } from "@/components/shared/LoadingStates";
import { ErrorState } from "@/components/shared/ErrorState";
import heroImage from "@/assets/hero-aviation.jpg";

const Index = () => {
  const navigate = useNavigate();
  
  // Use autoRefresh for real-time dashboard updates
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useSystemMetrics({ 
    autoRefresh: true
  });
  
  // Get recent analyses (flights) for dashboard
  const { data: analyses = [], isLoading: flightsLoading, error: flightsError, refetch: refetchFlights } = useAnalyses({ 
    skip: 0,
    limit: 3
  });
  
  const { data: aircraft = [], isLoading: aircraftLoading, error: aircraftError } = useAircraft();
  
  // Map analyses to flights for backward compatibility
  const flights = analyses;

  // Debug logging to help troubleshoot
  console.log('Dashboard Debug Info:', {
    metrics: { data: metrics, loading: metricsLoading, error: metricsError?.message },
    flights: { data: flights, loading: flightsLoading, error: flightsError?.message },
    aircraft: { data: aircraft, loading: aircraftLoading, error: aircraftError?.message }
  });

  const stats = [
    { 
      title: "Active Flights", 
      value: String(metrics?.active_flights ?? 0), 
      change: metrics?.active_flights_change || "+0%", 
      icon: Activity,
      type: "multirotor"
    },
    { 
      title: "Analyses Complete", 
      value: String(metrics?.total_analyses ?? 0), 
      change: metrics?.analyses_change || "+0%", 
      icon: TrendingUp,
      type: "fixed-wing"
    },
    { 
      title: "Risk Alerts", 
      value: String(metrics?.risk_alerts ?? 0), 
      change: metrics?.alerts_change || "0%", 
      icon: AlertTriangle,
      type: "high"
    },
    { 
      title: "Fleet Health", 
      value: metrics?.fleet_health ? `${metrics.fleet_health}%` : "100%", 
      change: metrics?.fleet_health_change || "+0%", 
      icon: Plane,
      type: "low"
    },
  ];

  const recentAnalyses = Array.isArray(flights) ? flights.slice(0, 3) : [];

  // Show overall loading state
  const isLoadingAny = metricsLoading || flightsLoading || aircraftLoading;
  const hasAnyError = metricsError || flightsError || aircraftError;

  return (
    <div className="space-y-8 p-6">
      {/* Debug Banner - Shows loading/error state */}
      {isLoadingAny && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 animate-spin text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Loading dashboard data...</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {metricsLoading && 'Fetching system metrics... '}
                {flightsLoading && 'Loading flight analyses... '}
                {aircraftLoading && 'Retrieving aircraft data...'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Banner - Shows if any API calls failed */}
      {hasAnyError && !isLoadingAny && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Some data could not be loaded</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  The dashboard is showing default or cached values. Check your connection or try refreshing.
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                refetchMetrics();
                refetchFlights();
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        <div className="relative p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              DBX
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Genomic-inspired precision analysis for flight safety and performance optimization.
              Advanced AI algorithms detect anomalies with scientific rigor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={() => navigate("/upload")}
              >
                <Activity className="h-5 w-5 mr-2" />
                Start Analysis
              </Button>
              <DocumentationModal>
                <Button variant="outline" size="lg">
                  View Documentation
                </Button>
              </DocumentationModal>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      {metricsError && !metricsLoading && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Some metrics may be unavailable. Showing default values.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          stats.map((stat) => (
            <GenomicCard key={stat.title} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-5 w-5 text-primary" />
                <span className={`risk-indicator ${stat.type === 'multirotor' ? 'aircraft-multirotor' : 
                  stat.type === 'fixed-wing' ? 'aircraft-fixed-wing' : 
                  stat.type === 'high' ? 'risk-high' : 'risk-low'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </GenomicCard>
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Flight Analyses */}
        <div className="lg:col-span-2">
          <GenomicCard 
            title="Recent Flight Analyses"
            icon={<Activity className="h-5 w-5" />}
            badge="Live Updates"
            badgeVariant="low"
          >
            {flightsError && !flightsLoading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ℹ️ Flight analysis data is not available yet. Upload flight data to see analyses here.
                </p>
              </div>
            )}
            <div className="space-y-4">
              {flightsLoading ? (
                <>
                  <FlightCardSkeleton />
                  <FlightCardSkeleton />
                  <FlightCardSkeleton />
                </>
              ) : recentAnalyses.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-2">No flight analyses yet</p>
                  <p className="text-sm text-muted-foreground/70 mb-4">
                    Upload flight data to start analyzing
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/upload")}
                  >
                    Upload Flight Data
                  </Button>
                </div>
              ) : (
                recentAnalyses.map((analysis: any) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/30">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`h-3 w-3 rounded-full ${
                          analysis.status === 'completed' ? 'bg-accent animate-genomic-pulse' : 'bg-primary animate-spin'
                        }`}></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-primary">{analysis.id || analysis.flight_id}</span>
                          <span className={`risk-indicator ${
                            analysis.aircraft_type === 'Multirotor' ? 'aircraft-multirotor' : 
                            analysis.aircraft_type === 'Fixed Wing' ? 'aircraft-fixed-wing' : 'aircraft-vtol'
                          }`}>
                            {analysis.aircraft_type || analysis.type}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{analysis.aircraft_name || analysis.aircraft}</p>
                        <p className="text-xs text-muted-foreground">{analysis.timestamp || analysis.created_at}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <ConservationScore 
                        label="Confidence"
                        score={analysis.confidence || analysis.confidence_score || 0}
                        variant="primary"
                        className="w-20 sm:w-24"
                      />
                    </div>
                  </div>
                ))
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/analysis")}
              >
                View All Analyses
              </Button>
            </div>
          </GenomicCard>
        </div>

        {/* System Status */}
        <div className="space-y-6">
          <GenomicCard 
            title="System Health"
            icon={<Database className="h-5 w-5" />}
            badge="Online"
            badgeVariant="low"
          >
            <div className="space-y-4">
              <ConservationScore 
                label="AI Model Performance"
                score={98.7}
                variant="success"
              />
              <ConservationScore 
                label="Data Pipeline Throughput"
                score={94.2}
                variant="primary"
              />
              <ConservationScore 
                label="Storage Capacity"
                score={67.8}
                variant="warning"
              />
              <div className="pt-2 border-t border-border/30">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="text-foreground">24</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Queue Length</span>
                  <span className="text-foreground">0</span>
                </div>
              </div>
            </div>
          </GenomicCard>

          <GenomicCard 
            title="Fleet Overview"
            icon={<Plane className="h-5 w-5" />}
            badge={`${Array.isArray(aircraft) ? aircraft.filter((a: any) => a.operational_status === 'active').length : 0} Active`}
            badgeVariant="fixed-wing"
          >
            <div className="space-y-3">
              {aircraftLoading ? (
                <>
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                </>
              ) : aircraftError ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">Fleet data unavailable</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/fleet")}
                  >
                    Manage Fleet
                  </Button>
                </div>
              ) : !Array.isArray(aircraft) || aircraft.length === 0 ? (
                <div className="text-center py-4">
                  <Plane className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">No aircraft registered</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/fleet")}
                  >
                    Add Aircraft
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Multirotors</span>
                    <span className="text-multirotor font-medium">
                      {aircraft.filter((a: any) => a.aircraft_type === 'multirotor' || a.type === 'Multirotor').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fixed Wing</span>
                    <span className="text-fixed-wing font-medium">
                      {aircraft.filter((a: any) => a.aircraft_type === 'fixed_wing' || a.type === 'Fixed Wing').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VTOL</span>
                    <span className="text-vtol font-medium">
                      {aircraft.filter((a: any) => a.aircraft_type === 'vtol' || a.type === 'VTOL').length}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/30">
                    <ConservationScore 
                      label="Fleet Availability"
                      score={metrics?.fleet_availability || 100}
                      variant="accent"
                    />
                  </div>
                </>
              )}
            </div>
          </GenomicCard>
        </div>
      </div>
    </div>
  );
};

export default Index;