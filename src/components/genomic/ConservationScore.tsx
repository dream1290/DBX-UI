import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConservationScoreProps {
  label: string;
  score: number;
  maxScore?: number;
  variant?: "primary" | "accent" | "success" | "warning" | "danger";
  className?: string;
  showPercentage?: boolean;
}

export function ConservationScore({ 
  label, 
  score, 
  maxScore = 100, 
  variant = "primary",
  className,
  showPercentage = true 
}: ConservationScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = (score / maxScore) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getVariantClasses = () => {
    switch (variant) {
      case "accent":
        return "from-accent to-accent/60";
      case "success":
        return "from-risk-low to-green-400";
      case "warning":
        return "from-risk-medium to-yellow-400";
      case "danger":
        return "from-risk-high to-red-400";
      default:
        return "from-primary to-primary/60";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        {showPercentage && (
          <span className="text-lg font-bold mono-genomic text-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="relative">
        <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full bg-gradient-to-r transition-all duration-1500 ease-out rounded-full",
              getVariantClasses()
            )}
            style={{ 
              width: `${percentage}%`,
              animation: "conservation-score 1.5s ease-out forwards"
            }}
          />
        </div>
        {/* Genomic-style tick marks */}
        <div className="absolute inset-0 flex justify-between px-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="w-px h-3 bg-border/30 rounded-full"
              style={{ marginTop: 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}