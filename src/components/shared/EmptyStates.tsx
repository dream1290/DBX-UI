import { AlertCircle, FileX, Plane, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="mb-4 text-muted-foreground">
      {icon || <AlertCircle className="h-12 w-12" />}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>
    {action && (
      <Button onClick={action.onClick}>{action.label}</Button>
    )}
  </div>
);

export const EmptyFlights = ({ onUpload }: { onUpload?: () => void }) => (
  <EmptyState
    icon={<FileX className="h-12 w-12" />}
    title="No flight data found"
    description="Upload flight logs to start analyzing your aircraft performance and detecting anomalies."
    action={onUpload ? { label: "Upload Flight Data", onClick: onUpload } : undefined}
  />
);

export const EmptyAircraft = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<Plane className="h-12 w-12" />}
    title="No aircraft in fleet"
    description="Add aircraft to your fleet to start tracking and managing your aviation assets."
    action={onAdd ? { label: "Add Aircraft", onClick: onAdd } : undefined}
  />
);

export const EmptyUsers = ({ onAdd }: { onAdd?: () => void }) => (
  <EmptyState
    icon={<Users className="h-12 w-12" />}
    title="No users found"
    description="Add users to your organization to collaborate and manage access."
    action={onAdd ? { label: "Add User", onClick: onAdd } : undefined}
  />
);

export const EmptyReports = ({ onCreate }: { onCreate?: () => void }) => (
  <EmptyState
    icon={<FileText className="h-12 w-12" />}
    title="No reports generated"
    description="Generate reports to analyze flight data and track performance metrics."
    action={onCreate ? { label: "Create Report", onClick: onCreate } : undefined}
  />
);
