import type * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  children?: React.ReactNode;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
  label: string;
  tone: string;
  trend?: {
    direction: "down" | "flat" | "up";
    label: string;
    positive?: boolean;
  };
  value: string;
};

function MetricCard({
  children,
  description,
  icon: Icon,
  isLoading,
  label,
  tone,
  trend,
  value,
}: MetricCardProps) {
  const TrendIcon =
    trend?.direction === "down" ? TrendingDown : trend?.direction === "flat" ? Minus : TrendingUp;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className={cn("size-4", tone)} />
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-semibold tabular-nums">{value}</div>
            <div className="flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              {trend ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-medium",
                    trend.positive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground",
                  )}
                >
                  <TrendIcon className="size-3.5" />
                  {trend.label}
                </span>
              ) : null}
              <span className="text-muted-foreground">{description}</span>
            </div>
          </>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

export { MetricCard };
export type { MetricCardProps };
