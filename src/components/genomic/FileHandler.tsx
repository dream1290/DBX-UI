import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenomicCard } from "./GenomicCard";
import { cn } from "@/lib/utils";

interface FileFormat {
  extension: string;
  description: string;
  color: string;
}

const supportedFormats: FileFormat[] = [
  { extension: "CSV", description: "Flight log data", color: "text-genomic-blue" },
  { extension: "BIN", description: "MAVLink telemetry", color: "text-genomic-green" },
  { extension: "ULOG", description: "PX4 flight logs", color: "text-genomic-purple" },
  { extension: "TXT", description: "Text-based logs", color: "text-genomic-orange" },
  { extension: "JSON", description: "Structured data", color: "text-genomic-cyan" },
  { extension: "KML", description: "Flight paths", color: "text-genomic-pink" },
];

interface FileHandlerProps {
  onFilesUploaded?: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

export function FileHandler({ onFilesUploaded, maxFiles = 10, className }: FileHandlerProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    // Simulate upload delay for genomic-style analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    onFilesUploaded?.(acceptedFiles);
    setUploading(false);
  }, [onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      'text/csv': ['.csv'],
      'application/octet-stream': ['.bin', '.ulog'],
      'text/plain': ['.txt', '.log'],
      'application/json': ['.json'],
      'application/vnd.google-earth.kml+xml': ['.kml'],
    }
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <GenomicCard 
      className={cn("", className)}
      title="Multi-Format Flight Data Handler"
      icon={<Upload className="h-5 w-5" />}
      badge="Universal"
      badgeVariant="low"
    >
      {/* Supported Formats Grid */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Supported Formats</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {supportedFormats.map((format) => (
            <div key={format.extension} className="flex flex-col p-3 bg-secondary/30 rounded-md border border-border/30">
              <span className={cn("font-mono text-sm font-bold", format.color)}>
                {format.extension}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {format.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer",
          isDragActive 
            ? "border-primary bg-primary/5 scale-105" 
            : "border-border/50 hover:border-primary/30 hover:bg-primary/5",
          uploading && "pointer-events-none opacity-70"
        )}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
            <p className="text-primary font-medium">Analyzing flight data...</p>
            <p className="text-xs text-muted-foreground">Processing telemetry sequences</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative mx-auto w-16 h-16">
              <Upload className="h-16 w-16 text-muted-foreground mx-auto" />
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm animate-genomic-pulse"></div>
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? "Drop flight data here" : "Drop flight files here"}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Supports telemetry, logs, and flight path data formats
              </p>
            </div>
            <Button variant="secondary" className="mt-4">
              <FileText className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Uploaded Files</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-md border border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </GenomicCard>
  );
}