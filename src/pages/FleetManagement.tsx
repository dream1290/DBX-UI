import { useState, useMemo } from "react";
import { Plus, Search, Settings, Activity, Battery, MapPin, Calendar } from "lucide-react";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { ConservationScore } from "@/components/genomic/ConservationScore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AddAircraftModal } from "@/components/modals/AddAircraftModal";
import { useAircraft } from "@/hooks/api";
import { AircraftCardSkeleton } from "@/components/shared/LoadingStates";
import { EmptyAircraft } from "@/components/shared/EmptyStates";
import { ErrorState } from "@/components/shared/ErrorState";
import fleetImage from "@/assets/fleet-bg.jpg";

const FleetManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: aircraftData, isLoading, error, refetch } = useAircraft();
  const aircraft = aircraftData || [];

  const filteredAircraft = useMemo(() => {
    return aircraft.filter((ac: any) => {
      const matchesSearch = (ac.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (ac.registration || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (ac.manufacturer || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || ac.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [aircraft, searchQuery, statusFilter]);

  const fleetStats = useMemo(() => {
    const total = aircraft.length;
    const active = aircraft.filter((ac: any) => ac.status === 'active').length;
    const maintenance = aircraft.filter((ac: any) => ac.status === 'maintenance').length;
    const deployed = aircraft.filter((ac: any) => ac.status === 'deployed').length;
    return { total, active, maintenance, deployed };
  }, [aircraft]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "low";
      case "maintenance": return "medium";
      case "offline": return "high";
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

  const getBatteryColor = (level: number) => {
    if (level > 75) return "success";
    if (level > 25) return "warning";
    return "danger";
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${fleetImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/95" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Fleet Command Center
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Comprehensive aircraft management with genomic-precision health monitoring and operational intelligence.
              </p>
            </div>
            <AddAircraftModal>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent w-full lg:w-auto">
                <Plus className="h-5 w-5 mr-2" />
                Register Aircraft
              </Button>
            </AddAircraftModal>
          </div>
        </div>
      </div>

      {/* Fleet Overview Stats */}
      {error && <ErrorState message={error.message} onRetry={refetch} />}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GenomicCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Activity className="h-5 w-5 text-primary" />
            <Badge variant="secondary">{fleetStats.total}</Badge>
          </div>
          <h3 className="text-2xl font-bold text-foreground">Total Aircraft</h3>
          <p className="text-sm text-muted-foreground">All registered units</p>
        </GenomicCard>

        <GenomicCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Battery className="h-5 w-5 text-accent" />
            <Badge className="aircraft-multirotor">{fleetStats.active}</Badge>
          </div>
          <h3 className="text-2xl font-bold text-foreground">Active</h3>
          <p className="text-sm text-muted-foreground">Ready for deployment</p>
        </GenomicCard>

        <GenomicCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Settings className="h-5 w-5 text-genomic-orange" />
            <Badge className="risk-medium">{fleetStats.maintenance}</Badge>
          </div>
          <h3 className="text-2xl font-bold text-foreground">Maintenance</h3>
          <p className="text-sm text-muted-foreground">Scheduled service</p>
        </GenomicCard>

        <GenomicCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <MapPin className="h-5 w-5 text-genomic-purple" />
            <Badge className="risk-low">{fleetStats.deployed}</Badge>
          </div>
          <h3 className="text-2xl font-bold text-foreground">Deployed</h3>
          <p className="text-sm text-muted-foreground">In field operations</p>
        </GenomicCard>
      </div>

      {/* Search and Filters */}
      <GenomicCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by aircraft name, registration, or manufacturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GenomicCard>

      {/* Aircraft Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <AircraftCardSkeleton />
          <AircraftCardSkeleton />
          <AircraftCardSkeleton />
        </div>
      ) : filteredAircraft.length === 0 && !searchQuery && statusFilter === "all" ? (
        <EmptyAircraft />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredAircraft.map((ac: any) => (
          <GenomicCard 
            key={ac.id} 
            className="p-6"
            title={ac.name}
            icon={<Activity className="h-5 w-5" />}
            badge={ac.status}
            badgeVariant={getStatusVariant(ac.status)}
          >
            <div className="space-y-4">
              {/* Aircraft Basic Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Registration</span>
                  <span className="font-mono text-sm text-foreground">{ac.registration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge className={getTypeVariant(ac.type)}>{ac.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Model</span>
                  <span className="text-sm text-foreground">{ac.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm text-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {ac.location}
                  </span>
                </div>
              </div>

              {/* Health Metrics */}
              <div className="space-y-3 pt-3 border-t border-border/30">
                <ConservationScore 
                  label="Health Score"
                  score={ac.healthScore}
                  variant={ac.healthScore > 90 ? "success" : ac.healthScore > 75 ? "warning" : "danger"}
                />
                <ConservationScore 
                  label="Battery Level"
                  score={ac.batteryLevel}
                  variant={getBatteryColor(ac.batteryLevel)}
                />
              </div>

              {/* Flight Statistics */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3 border-t border-border/30">
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-foreground">{ac.flightHours}</p>
                  <p className="text-xs text-muted-foreground">Flight Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-foreground">{ac.recentFlights}</p>
                  <p className="text-xs text-muted-foreground">Recent Flights</p>
                </div>
              </div>

              {/* Maintenance Info */}
              <div className="p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Maintenance</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Last: {ac.lastMaintenance}</div>
                  <div>Next: {ac.nextMaintenance}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Activity className="h-4 w-4 mr-2" />
                  History
                </Button>
              </div>
            </div>
          </GenomicCard>
          ))}
        </div>
      )}

      {filteredAircraft.length === 0 && (searchQuery || statusFilter !== "all") && (
        <GenomicCard className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No aircraft found</h3>
            <p className="text-sm">Try adjusting your search terms or filters.</p>
          </div>
        </GenomicCard>
      )}
    </div>
  );
};

export default FleetManagement;