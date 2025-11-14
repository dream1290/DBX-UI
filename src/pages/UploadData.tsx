import { useState, useEffect } from "react";
import { Upload, FileText, Zap, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { FileHandler } from "@/components/genomic/FileHandler";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { ConservationScore } from "@/components/genomic/ConservationScore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAnalyzeFlight, useFlights } from "@/hooks/api/useFlights";

interface AnalysisJob {
  id: string;
  filename: string;
  fileSize: number;
  status: "queued" | "processing" | "completed" | "error";
  progress: number;
  startTime?: Date;
  completedTime?: Date;
  aircraft?: {
    type: string;
    confidence: number;
  };
  anomalies?: number;
  insights?: string;
}

const UploadData = () => {
  const [analysisJobs, setAnalysisJobs] = useState<AnalysisJob[]>([]);
  const analyzeFlight = useAnalyzeFlight();
  const { data: recentFlights } = useFlights({ limit: 10 });

  // Load recent flights as analysis jobs
  useEffect(() => {
    if (recentFlights) {
      const jobs: AnalysisJob[] = recentFlights.map((flight: any) => ({
        id: flight.id || flight.flight_id,
        filename: flight.filename || flight.file_name || 'Unknown file',
        fileSize: flight.file_size || 0,
        status: flight.status === 'completed' ? 'completed' : flight.status === 'processing' ? 'processing' : 'queued',
        progress: flight.progress || (flight.status === 'completed' ? 100 : 0),
        startTime: flight.start_time ? new Date(flight.start_time) : undefined,
        completedTime: flight.completed_time ? new Date(flight.completed_time) : undefined,
        aircraft: flight.aircraft_type ? {
          type: flight.aircraft_type,
          confidence: flight.confidence || flight.confidence_score || 0
        } : undefined,
        anomalies: flight.anomalies || flight.anomaly_count || 0,
        insights: flight.insights || flight.summary
      }));
      setAnalysisJobs(jobs);
    }
  }, [recentFlights]);

  const handleFilesUploaded = async (files: File[]) => {
    for (const file of files) {
      const jobId = `job_${Date.now()}_${Math.random()}`;
      const newJob: AnalysisJob = {
        id: jobId,
        filename: file.name,
        fileSize: Number((file.size / 1024 / 1024).toFixed(1)),
        status: "queued",
        progress: 0,
      };

      setAnalysisJobs(prev => [newJob, ...prev]);

      try {
        // Update to processing
        setAnalysisJobs(prev => prev.map(j => 
          j.id === jobId ? { ...j, status: "processing" as const, startTime: new Date() } : j
        ));

        // Upload file
        await analyzeFlight.mutateAsync({ file });

        // Update to completed
        setAnalysisJobs(prev => prev.map(j => 
          j.id === jobId ? { 
            ...j, 
            status: "completed" as const, 
            progress: 100,
            completedTime: new Date()
          } : j
        ));
      } catch (error) {
        setAnalysisJobs(prev => prev.map(j => 
          j.id === jobId ? { ...j, status: "error" as const } : j
        ));
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "processing":
        return <Zap className="h-4 w-4 text-primary animate-genomic-pulse" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "low";
      case "processing": return "multirotor";
      case "error": return "high";
      default: return "medium";
    }
  };

  const getAircraftVariant = (type?: string) => {
    switch (type) {
      case "Multirotor": return "multirotor";
      case "Fixed Wing": return "fixed-wing";
      case "VTOL": return "vtol";
      default: return "multirotor";
    }
  };

  const formatFileSize = (sizeMB: number) => {
    return `${sizeMB} MB`;
  };

  const formatDuration = (start?: Date, end?: Date) => {
    if (!start) return "—";
    const endTime = end || new Date();
    const seconds = Math.floor((endTime.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
          Flight Data Upload & Analysis
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload flight logs for genomic-precision analysis. Our AI models detect aircraft types, anomalies, and performance patterns.
        </p>
      </div>

      {/* Upload Interface */}
      <FileHandler 
        onFilesUploaded={handleFilesUploaded}
        maxFiles={5}
        className="mb-8"
      />

      {/* Processing Queue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GenomicCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-bold text-foreground">
              {analysisJobs.filter(j => j.status === "queued").length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Queued</h3>
        </GenomicCard>

        <GenomicCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Zap className="h-5 w-5 text-primary animate-genomic-pulse" />
            <span className="text-lg font-bold text-foreground">
              {analysisJobs.filter(j => j.status === "processing").length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Processing</h3>
        </GenomicCard>

        <GenomicCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span className="text-lg font-bold text-foreground">
              {analysisJobs.filter(j => j.status === "completed").length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
        </GenomicCard>

        <GenomicCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <FileText className="h-5 w-5 text-genomic-purple" />
            <span className="text-lg font-bold text-foreground">{analysisJobs.length}</span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Total Jobs</h3>
        </GenomicCard>
      </div>

      {/* Analysis Jobs List */}
      <GenomicCard 
        title="Analysis Queue"
        icon={<Upload className="h-5 w-5" />}
        badge={`${analysisJobs.length} Jobs`}
        badgeVariant="multirotor"
      >
        <div className="space-y-4">
          {analysisJobs.map((job) => (
            <div key={job.id} className="p-4 bg-secondary/20 rounded-lg border border-border/30">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Job Info */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{job.filename}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(job.fileSize)} • Job ID: {job.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`risk-indicator ${getStatusVariant(job.status)}`}>
                        {job.status}
                      </span>
                      {job.aircraft && (
                        <span className={`risk-indicator ${getAircraftVariant(job.aircraft.type)}`}>
                          {job.aircraft.type}
                        </span>
                      )}
                    </div>
                  </div>

                  {job.status === "processing" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Analysis Progress</span>
                        <span className="text-foreground">{Math.round(job.progress)}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}

                  {job.aircraft && job.status === "completed" && (
                    <div className="space-y-2">
                      <ConservationScore 
                        label="Detection Confidence"
                        score={job.aircraft.confidence}
                        variant="primary"
                        className="max-w-xs"
                      />
                      {job.insights && (
                        <div className="p-2 bg-primary/5 border border-primary/20 rounded-md">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-3 w-3 text-primary" />
                            <span className="text-xs font-medium text-primary">AI Analysis</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{job.insights}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Job Metrics */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Duration</span>
                      <span className="text-foreground font-mono">
                        {formatDuration(job.startTime, job.completedTime)}
                      </span>
                    </div>
                    {typeof job.anomalies === "number" && (
                      <div>
                        <span className="text-muted-foreground block">Anomalies</span>
                        <span className={`font-mono ${job.anomalies > 0 ? 'text-destructive' : 'text-accent'}`}>
                          {job.anomalies}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {job.status === "completed" && (
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Report
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {analysisJobs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No analysis jobs yet</h3>
              <p className="text-sm">Upload flight data files to start processing.</p>
            </div>
          )}
        </div>
      </GenomicCard>
    </div>
  );
};

export default UploadData;