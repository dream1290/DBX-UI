import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileText, Calendar as CalendarIcon, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { useGenerateReport } from "@/hooks/api/useReports";

interface CreateReportModalProps {
  children: React.ReactNode;
}

export function CreateReportModal({ children }: CreateReportModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    dateRange: {
      start: undefined as Date | undefined,
      end: undefined as Date | undefined
    },
    filters: {
      aircraftTypes: [] as string[],
      riskLevels: [] as string[],
      departments: [] as string[]
    },
    sections: [] as string[],
    format: "pdf",
    notes: ""
  });
  
  const generateReport = useGenerateReport();

  const reportSections = [
    "Executive Summary",
    "Flight Analysis Overview", 
    "Anomaly Detection Results",
    "Risk Assessment",
    "Performance Metrics",
    "Safety Recommendations",
    "Compliance Status",
    "Fleet Health Analysis",
    "Usage Statistics",
    "Cost Analysis"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await generateReport.mutateAsync(formData);
      setOpen(false);
      setFormData({
        name: "",
        type: "",
        dateRange: { start: undefined, end: undefined },
        filters: { aircraftTypes: [], riskLevels: [], departments: [] },
        sections: [],
        format: "pdf",
        notes: ""
      });
    } catch (error) {
      // Error already handled by the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Custom Report
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Report Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Monthly Safety Analysis Report"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Report Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety Analysis</SelectItem>
                  <SelectItem value="performance">Performance Report</SelectItem>
                  <SelectItem value="compliance">Compliance Report</SelectItem>
                  <SelectItem value="fleet">Fleet Health Report</SelectItem>
                  <SelectItem value="financial">Financial Analysis</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateRange.start ? format(formData.dateRange.start, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateRange.start}
                    onSelect={(date) => setFormData(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, start: date }
                    }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateRange.end ? format(formData.dateRange.end, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateRange.end}
                    onSelect={(date) => setFormData(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, end: date }
                    }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Report Filters
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Aircraft Types</Label>
                <div className="space-y-2">
                  {["Multirotor", "Fixed Wing", "VTOL", "Helicopter"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`aircraft-${type}`}
                        checked={formData.filters.aircraftTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ 
                              ...prev, 
                              filters: { 
                                ...prev.filters, 
                                aircraftTypes: [...prev.filters.aircraftTypes, type] 
                              }
                            }));
                          } else {
                            setFormData(prev => ({ 
                              ...prev, 
                              filters: { 
                                ...prev.filters, 
                                aircraftTypes: prev.filters.aircraftTypes.filter(t => t !== type) 
                              }
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`aircraft-${type}`} className="text-sm">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Risk Levels</Label>
                <div className="space-y-2">
                  {["Low", "Medium", "High", "Critical"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`risk-${level}`}
                        checked={formData.filters.riskLevels.includes(level)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ 
                              ...prev, 
                              filters: { 
                                ...prev.filters, 
                                riskLevels: [...prev.filters.riskLevels, level] 
                              }
                            }));
                          } else {
                            setFormData(prev => ({ 
                              ...prev, 
                              filters: { 
                                ...prev.filters, 
                                riskLevels: prev.filters.riskLevels.filter(l => l !== level) 
                              }
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`risk-${level}`} className="text-sm">{level}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Departments</Label>
                <div className="space-y-2">
                  {["Operations", "Safety", "Maintenance", "Analytics"].map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept}`}
                        checked={formData.filters.departments.includes(dept)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ 
                              ...prev, 
                              filters: { 
                                ...prev.filters, 
                                departments: [...prev.filters.departments, dept] 
                              }
                            }));
                          } else {
                            setFormData(prev => ({ 
                              ...prev, 
                              filters: { 
                                ...prev.filters, 
                                departments: prev.filters.departments.filter(d => d !== dept) 
                              }
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`dept-${dept}`} className="text-sm">{dept}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Report Sections</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {reportSections.map((section) => (
                <div key={section} className="flex items-center space-x-2">
                  <Checkbox
                    id={section}
                    checked={formData.sections.includes(section)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, sections: [...prev.sections, section] }));
                      } else {
                        setFormData(prev => ({ ...prev, sections: prev.sections.filter(s => s !== section) }));
                      }
                    }}
                  />
                  <Label htmlFor={section} className="text-sm">{section}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Output Format</Label>
              <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Workbook</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint Presentation</SelectItem>
                  <SelectItem value="html">HTML Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any specific requirements or notes for this report..."
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={generateReport.isPending}>
              <Download className="h-4 w-4 mr-2" />
              {generateReport.isPending ? "Generating..." : "Generate Report"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={generateReport.isPending}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}