import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Plane, MapPin, Settings } from "lucide-react";
import { useCreateAircraft } from "@/hooks/api/useAircraft";

interface AddAircraftModalProps {
  children: React.ReactNode;
}

export function AddAircraftModal({ children }: AddAircraftModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    registration: "",
    manufacturer: "",
    model: "",
    location: "",
    specifications: {
      maxAltitude: "",
      flightTime: "",
      payload: "",
      range: ""
    },
    notes: ""
  });
  
  const createAircraft = useCreateAircraft();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAircraft.mutateAsync(formData);
      setOpen(false);
      setFormData({
        name: "",
        type: "",
        registration: "",
        manufacturer: "",
        model: "",
        location: "",
        specifications: { maxAltitude: "", flightTime: "", payload: "", range: "" },
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Register New Aircraft
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Aircraft Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Alpha Wing One"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registration">Registration Number</Label>
              <Input
                id="registration"
                value={formData.registration}
                onChange={(e) => setFormData(prev => ({ ...prev, registration: e.target.value }))}
                placeholder="e.g., N1234ABC"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Aircraft Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multirotor">Multirotor</SelectItem>
                  <SelectItem value="fixed-wing">Fixed Wing</SelectItem>
                  <SelectItem value="vtol">VTOL</SelectItem>
                  <SelectItem value="helicopter">Helicopter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                placeholder="e.g., DJI, SenseFly"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="e.g., Matrice 300 RTK"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Storage Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Hangar A, Bay 3"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Technical Specifications
            </Label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAltitude" className="text-sm">Max Altitude</Label>
                <Input
                  id="maxAltitude"
                  value={formData.specifications.maxAltitude}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specifications: { ...prev.specifications, maxAltitude: e.target.value }
                  }))}
                  placeholder="e.g., 7,000m"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flightTime" className="text-sm">Flight Time</Label>
                <Input
                  id="flightTime"
                  value={formData.specifications.flightTime}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specifications: { ...prev.specifications, flightTime: e.target.value }
                  }))}
                  placeholder="e.g., 55min"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payload" className="text-sm">Max Payload</Label>
                <Input
                  id="payload"
                  value={formData.specifications.payload}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specifications: { ...prev.specifications, payload: e.target.value }
                  }))}
                  placeholder="e.g., 2.7kg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="range" className="text-sm">Max Range</Label>
                <Input
                  id="range"
                  value={formData.specifications.range}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specifications: { ...prev.specifications, range: e.target.value }
                  }))}
                  placeholder="e.g., 15km"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information about this aircraft..."
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={createAircraft.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              {createAircraft.isPending ? "Registering..." : "Register Aircraft"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={createAircraft.isPending}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}