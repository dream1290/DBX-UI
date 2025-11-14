import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GenomicCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  badge?: string;
  badgeVariant?: "multirotor" | "fixed-wing" | "vtol" | "low" | "medium" | "high";
}

export function GenomicCard({ 
  children, 
  className, 
  title, 
  icon, 
  badge, 
  badgeVariant 
}: GenomicCardProps) {
  const getBadgeClasses = (variant?: string) => {
    switch (variant) {
      case "multirotor":
        return "aircraft-multirotor";
      case "fixed-wing":
        return "aircraft-fixed-wing";
      case "vtol":
        return "aircraft-vtol";
      case "low":
        return "risk-low";
      case "medium":
        return "risk-medium";
      case "high":
        return "risk-high";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className={cn("genomic-card", className)}>
      {(title || icon || badge) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            )}
          </div>
          {badge && (
            <span className={cn("risk-indicator", getBadgeClasses(badgeVariant))}>
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </Card>
  );
}