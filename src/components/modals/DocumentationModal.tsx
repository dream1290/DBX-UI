import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenomicCard } from "@/components/genomic/GenomicCard";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Code, Database, Shield, Zap, Settings, 
  FileText, Link, Download, ExternalLink 
} from "lucide-react";

interface DocumentationModalProps {
  children: React.ReactNode;
}

export function DocumentationModal({ children }: DocumentationModalProps) {
  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/v1/flights/analyze",
      description: "Upload and analyze flight data",
      parameters: ["file", "aircraft_type", "options"]
    },
    {
      method: "GET", 
      endpoint: "/api/v1/flights/{id}",
      description: "Retrieve flight analysis results",
      parameters: ["id", "include_telemetry"]
    },
    {
      method: "GET",
      endpoint: "/api/v1/fleet/aircraft",
      description: "List all registered aircraft",
      parameters: ["status", "type", "limit"]
    },
    {
      method: "POST",
      endpoint: "/api/v1/reports/generate",
      description: "Generate custom reports",
      parameters: ["type", "date_range", "filters"]
    }
  ];

  const integrationGuides = [
    {
      title: "Python SDK",
      description: "Official Python client library for DBX API",
      language: "Python",
      code: `from dbx_aviation import Client

client = Client(api_key="your_key_here")
result = client.analyze_flight("flight_data.bin")
print(f"Aircraft detected: {result.aircraft_type}")`,
      downloadUrl: "#"
    },
    {
      title: "JavaScript SDK",
      description: "Node.js and browser-compatible JavaScript SDK",
      language: "JavaScript", 
      code: `import { DBXAviationClient } from '@dbx/aviation-sdk';

const client = new DBXAviationClient({
  apiKey: import.meta.env.VITE_DBX_API_KEY
});

const analysis = await client.analyzeFlightData({
  file: flightDataBuffer,
  aircraftType: 'multirotor'
});`,
      downloadUrl: "#"
    },
    {
      title: "REST API",
      description: "Direct HTTP API integration examples",
      language: "cURL",
      code: `curl -X POST https://api.dbx-aviation.com/v1/flights/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@flight_data.bin" \\
  -F "aircraft_type=multirotor"`,
      downloadUrl: "#"
    }
  ];

  const getMethodVariant = (method: string) => {
    switch (method) {
      case "GET": return "low";
      case "POST": return "multirotor";
      case "PUT": return "fixed-wing";
      case "DELETE": return "high";
      default: return "low";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            DBX Platform Documentation
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="api">API Reference</TabsTrigger>
              <TabsTrigger value="sdk">SDKs & Integration</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <GenomicCard className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Platform Overview</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">What is DBX?</h4>
                    <p className="text-muted-foreground">
                      DBX Platform provides genomic-precision analysis for flight data using advanced
                      machine learning algorithms. Our system automatically detects aircraft types, identifies
                      anomalies, and provides detailed safety insights.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Key Features</h4>
                    <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Automatic aircraft type detection (Multirotor, Fixed Wing, VTOL)</li>
                      <li>Real-time anomaly detection and safety analysis</li>
                      <li>Comprehensive flight performance metrics</li>
                      <li>Fleet management and health monitoring</li>
                      <li>Custom report generation and compliance tracking</li>
                      <li>REST API and SDK integration support</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Supported File Formats</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Badge variant="outline">MAVLink (.bin)</Badge>
                      <Badge variant="outline">ULog (.ulog)</Badge>
                      <Badge variant="outline">CSV</Badge>
                      <Badge variant="outline">TLog (.tlog)</Badge>
                      <Badge variant="outline">BIN</Badge>
                      <Badge variant="outline">Custom JSON</Badge>
                    </div>
                  </div>
                </div>
              </GenomicCard>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GenomicCard className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <h4 className="font-medium text-foreground">Quick Start</h4>
                  </div>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Create your account and get API keys</li>
                    <li>Install our SDK or use REST API directly</li>
                    <li>Upload your first flight data file</li>
                    <li>Review analysis results and insights</li>
                  </ol>
                </GenomicCard>
                
                <GenomicCard className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <h4 className="font-medium text-foreground">Configuration</h4>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Set up webhook notifications</li>
                    <li>Configure analysis parameters</li>
                    <li>Customize report templates</li>
                    <li>Manage user permissions</li>
                  </ul>
                </GenomicCard>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <GenomicCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">API Endpoints</h3>
                  <Badge className="multirotor">v1.0</Badge>
                </div>
                <div className="space-y-3">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="p-3 bg-secondary/20 rounded-lg border border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getMethodVariant(endpoint.method)} variant="outline">
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono text-primary">{endpoint.endpoint}</code>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {endpoint.parameters.map((param, idx) => (
                          <code key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            {param}
                          </code>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GenomicCard>
              
              <GenomicCard className="p-4">
                <h4 className="font-medium text-foreground mb-3">Authentication</h4>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    All API requests require authentication using Bearer tokens:
                  </p>
                  <div className="p-3 bg-secondary/20 rounded-lg font-mono text-xs">
                    <span className="text-muted-foreground">Authorization:</span>{" "}
                    <span className="text-primary">Bearer YOUR_API_KEY</span>
                  </div>
                </div>
              </GenomicCard>
            </TabsContent>
            
            <TabsContent value="sdk" className="space-y-4">
              <div className="space-y-4">
                {integrationGuides.map((guide, index) => (
                  <GenomicCard key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        <h4 className="font-medium text-foreground">{guide.title}</h4>
                        <Badge variant="outline">{guide.language}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="low">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Badge>
                        <Badge variant="outline">
                          <Link className="h-3 w-3 mr-1" />
                          Docs
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <pre className="text-xs text-foreground overflow-x-auto">
                        <code>{guide.code}</code>
                      </pre>
                    </div>
                  </GenomicCard>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <GenomicCard className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Security & Compliance</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Data Protection</h4>
                    <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                      <li>End-to-end encryption for all data transmission</li>
                      <li>Data encrypted at rest using AES-256</li>
                      <li>SOC 2 Type II compliant infrastructure</li>
                      <li>GDPR and CCPA compliant data handling</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">API Security</h4>
                    <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Rate limiting and DDoS protection</li>
                      <li>IP whitelisting available</li>
                      <li>API key rotation and scoping</li>
                      <li>Comprehensive audit logging</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Compliance Certifications</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="outline">ISO 27001</Badge>
                      <Badge variant="outline">SOC 2 Type II</Badge>
                      <Badge variant="outline">GDPR Compliant</Badge>
                      <Badge variant="outline">CCPA Compliant</Badge>
                    </div>
                  </div>
                </div>
              </GenomicCard>
            </TabsContent>
            
            <TabsContent value="support" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GenomicCard className="p-4">
                  <h4 className="font-medium text-foreground mb-3">Support Channels</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-foreground">Documentation Portal</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="text-foreground">API Status Page</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-foreground">Security Portal</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </GenomicCard>
                
                <GenomicCard className="p-4">
                  <h4 className="font-medium text-foreground mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Technical Support:</span>
                      <br />
                      <span className="text-foreground">support@dbx-aviation.com</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sales Inquiries:</span>
                      <br />
                      <span className="text-foreground">sales@dbx-aviation.com</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Emergency Support:</span>
                      <br />
                      <span className="text-foreground">+1 (555) 123-4567</span>
                    </div>
                  </div>
                </GenomicCard>
              </div>
              
              <GenomicCard className="p-4">
                <h4 className="font-medium text-foreground mb-3">Service Level Agreement</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">API Uptime</span>
                    <span className="text-foreground text-lg font-semibold">99.9%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Response Time</span>
                    <span className="text-foreground text-lg font-semibold">&lt; 2h</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Resolution Time</span>
                    <span className="text-foreground text-lg font-semibold">&lt; 24h</span>
                  </div>
                </div>
              </GenomicCard>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}