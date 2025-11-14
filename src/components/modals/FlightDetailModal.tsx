import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConservationScore } from "@/components/genomic/ConservationScore";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFlight } from "@/hooks/api/useFlights";
import { 
  Eye, Activity, MapPin, Clock, Battery, Thermometer, 
  Gauge, AlertTriangle, Download, Share, Info 
} from "lucide-react";

interface FlightDetailModalProps {
  children: React.ReactNode;
  flightData?: {
    id: string;
    aircraft: string;
    type: string;
    confidence: number;
    riskLevel: string;
    anomalies: number;
    duration: string;
    date: string;
    location: string;
    features: string[];
    insights: string;
  };
}

export function FlightDetailModal({ children, flightData }: FlightDetailModalProps) {
  const [open, setOpen] = useState(false);
  
  // Fetch detailed flight data when modal opens
  const { data: detailedData, isLoading } = useFlight(flightData?.id || '');

  if (!flightData) return null;

  // Use detailed data if available, otherwise use passed flightData
  const flight = detailedData || flightData;
  const telemetryData = flight.telemetry || [];
  const anomalyDetails = flight.anomaly_details || [];

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "Multirotor": return "multirotor";
      case "Fixed Wing": return "fixed-wing";
      case "VTOL": return "vtol";
      default: return "multirotor";
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5" />
              <span>Flight Analysis Details</span>
              <span className="font-mono text-primary">{flightData.id}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading flight details...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Flight Info */}
                <div className="lg:col-span-2 space-y-4">
                  <GenomicCard className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{flightData.aircraft}</h3>
                        <div className="flex gap-2">
                          <Badge className={getTypeVariant(flightData.type)}>{flightData.type}</Badge>
                          <Badge className={getRiskVariant(flightData.riskLevel)}>Risk: {flightData.riskLevel}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Duration: {flightData.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{flightData.location}</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 bg-primary rounded-full animate-genomic-pulse"></div>
                          <span className="text-sm font-medium text-primary">AI Insights</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{flightData.insights}</p>
                      </div>
                    </div>
                  </GenomicCard>
                  
                  {/* Flight Features */}
                  <GenomicCard className="p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Detected Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {flightData.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md border border-border/30">
                          <span className="text-sm font-mono text-genomic-blue">{feature}</span>
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 20) + 80}% conf.
                          </span>
                        </div>
                      ))}
                    </div>
                  </GenomicCard>
                </div>
                
                {/* Metrics */}
                <div className="space-y-4">
                  <ConservationScore 
                    label="Analysis Confidence"
                    score={flightData.confidence}
                    variant="primary"
                  />
                  
                  <GenomicCard className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Flight Date</span>
                        <span className="text-foreground font-mono text-xs">{flightData.date}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Anomalies</span>
                        <span className={`font-medium ${flightData.anomalies > 0 ? 'text-destructive' : 'text-accent'}`}>
                          {flightData.anomalies}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Risk Level</span>
                        <Badge className={getRiskVariant(flightData.riskLevel)} variant="outline">
                          {flightData.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  </GenomicCard>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="telemetry" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                <GenomicCard className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Max Speed</span>
                  </div>
                  <p className="text-lg font-bold">28 m/s</p>
                </GenomicCard>
                <GenomicCard className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Max Altitude</span>
                  </div>
                  <p className="text-lg font-bold">180 m</p>
                </GenomicCard>
                <GenomicCard className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Battery className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Battery Used</span>
                  </div>
                  <p className="text-lg font-bold">26%</p>
                </GenomicCard>
                <GenomicCard className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Min Temp</span>
                  </div>
                  <p className="text-lg font-bold">14°C</p>
                </GenomicCard>
              </div>
              
              <GenomicCard className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Flight Telemetry Timeline</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {telemetryData.length > 0 ? telemetryData.map((point: any, index: number) => (
                    <div key={index} className="grid grid-cols-5 gap-4 p-2 bg-secondary/20 rounded text-xs">
                      <span className="font-mono">{point.time}</span>
                      <span>{point.altitude}m</span>
                      <span>{point.speed} m/s</span>
                      <span>{point.battery}%</span>
                      <span>{point.temperature}°C</span>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No telemetry data available
                    </div>
                  )}
                </div>
              </GenomicCard>
            </TabsContent>
            
            <TabsContent value="anomalies" className="space-y-4">
              {anomalyDetails.length > 0 ? (
                <div className="space-y-4">
                  {anomalyDetails.map((anomaly: any, index: number) => (
                    <GenomicCard key={index} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <h4 className="text-sm font-medium text-foreground">{anomaly.type}</h4>
                            <Badge className={getRiskVariant(anomaly.severity)}>{anomaly.severity}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{anomaly.timestamp}</p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground mb-2">{anomaly.description}</p>
                      <p className="text-xs text-muted-foreground">{anomaly.impact}</p>
                    </GenomicCard>
                  ))}
                </div>
              ) : (
                <GenomicCard className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No anomalies detected</h3>
                    <p className="text-sm">This flight completed successfully without any anomalies.</p>
                  </div>
                </GenomicCard>
              )}
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4">
              <GenomicCard className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium text-foreground">Detailed AI Analysis</h4>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Flight Pattern Analysis</h5>
                    <p className="text-muted-foreground">
                      The flight followed a standard survey pattern with consistent altitude maintenance and smooth transitions.
                      GPS tracking remained stable throughout most of the mission with only minor deviations during wind gusts.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Performance Metrics</h5>
                    <p className="text-muted-foreground">
                      Battery consumption was within expected parameters, showing efficient power management.
                      Motor performance remained consistent with no signs of mechanical stress or unusual vibrations.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Safety Assessment</h5>
                    <p className="text-muted-foreground">
                      Overall safety score is high with no critical safety violations detected.
                      Recommended actions include monitoring battery cell 2 performance in future flights.
                    </p>
                  </div>
                </div>
              </GenomicCard>
            </TabsContent>
          </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}