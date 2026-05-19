"use client";

import type * as React from "react";
import { Activity, Cpu, DollarSign, Gauge, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Line, LineChart, XAxis, YAxis } from "recharts";

import { MockApiStatus } from "@/components/dashboard/mock-api-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBillingUsage,
  useGpuMetrics,
  useGpuSummary,
  useInferenceMetrics,
  useModelRegistry,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { BillingUsage, GpuMetric, Model } from "@/types/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 1,
  notation: "compact",
  style: "currency",
});

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }

  return `${Math.round(value)}%`;
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function getGpuTrend(metrics: GpuMetric[] = []) {
  const midpoint = Math.floor(metrics.length / 2);
  const previousAverage = average(
    metrics.slice(0, midpoint).map((metric) => metric.utilizationPercent),
  );
  const currentAverage = average(
    metrics.slice(midpoint).map((metric) => metric.utilizationPercent),
  );

  return currentAverage - previousAverage;
}

function getModelDeploymentStatus(models: Model[] = []) {
  return models.reduce(
    (totals, model) => {
      const deployments = model.deployments.filter((deployment) =>
        ["production", "staging"].includes(deployment.environment),
      );

      deployments.forEach((deployment) => {
        if (deployment.status === "healthy") {
          totals.healthy += 1;
        } else if (deployment.status === "degraded") {
          totals.degraded += 1;
        } else if (deployment.status === "failed") {
          totals.failed += 1;
        }
      });

      return totals;
    },
    { degraded: 0, failed: 0, healthy: 0 },
  );
}

function getBudgetPercent(usage: BillingUsage | null | undefined) {
  if (!usage?.budgetUsd) {
    return 0;
  }

  return (usage.totalCostUsd / usage.budgetUsd) * 100;
}

function MetricCard({
  children,
  description,
  icon: Icon,
  isLoading,
  label,
  tone,
  trend,
  value,
}: {
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
}) {
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

export default function DashboardPage() {
  const gpuSummaryQuery = useGpuSummary();
  const gpuMetricsQuery = useGpuMetrics("24h", 30);
  const inferenceMetricsQuery = useInferenceMetrics();
  const modelRegistryQuery = useModelRegistry({ limit: 100, status: "deployed" });
  const billingUsageQuery = useBillingUsage();

  const gpuTrend = getGpuTrend(gpuMetricsQuery.data?.metrics);
  const latestInferenceMetric = inferenceMetricsQuery.data?.at(-1);
  const previousInferenceMetric = inferenceMetricsQuery.data?.at(-2);
  const deployedModels = modelRegistryQuery.data?.data ?? [];
  const modelDeploymentStatus = getModelDeploymentStatus(deployedModels);
  const latencyDelta =
    latestInferenceMetric && previousInferenceMetric
      ? latestInferenceMetric.p95LatencyMs - previousInferenceMetric.p95LatencyMs
      : 0;
  const budgetPercent = getBudgetPercent(billingUsageQuery.data);
  const clampedBudgetPercent = Math.min(Math.max(budgetPercent, 0), 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Phase 3</Badge>
            <MockApiStatus />
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Cluster overview</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Live mock metrics for GPU capacity, model serving health, inference performance, and
            monthly platform spend.
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          description="avg cluster load"
          icon={Gauge}
          isLoading={gpuSummaryQuery.isLoading}
          label="GPU Utilization"
          tone="text-blue-600 dark:text-blue-400"
          trend={{
            direction: gpuTrend >= 0 ? "up" : "down",
            label: `${gpuTrend >= 0 ? "+" : ""}${gpuTrend.toFixed(1)}% vs earlier`,
            positive: gpuTrend < 5,
          }}
          value={formatPercent(gpuSummaryQuery.data?.utilization)}
        />

        <MetricCard
          description="deployed models"
          icon={Cpu}
          isLoading={modelRegistryQuery.isLoading}
          label="Active Models"
          tone="text-emerald-600 dark:text-emerald-400"
          trend={{
            direction: modelDeploymentStatus.failed > 0 ? "up" : "flat",
            label:
              modelDeploymentStatus.failed > 0
                ? `${modelDeploymentStatus.failed} failed`
                : `${modelDeploymentStatus.healthy} healthy`,
            positive: modelDeploymentStatus.failed === 0,
          }}
          value={`${modelRegistryQuery.data?.meta.total ?? 0}`}
        >
          <div className="flex min-h-8 items-center gap-2 text-xs">
            <Badge className="h-6 rounded-md px-2" variant="secondary">
              {modelDeploymentStatus.healthy} healthy
            </Badge>
            <Badge className="h-6 rounded-md px-2" variant="outline">
              {modelDeploymentStatus.degraded} degraded
            </Badge>
          </div>
        </MetricCard>

        <MetricCard
          description="current p95"
          icon={Activity}
          isLoading={inferenceMetricsQuery.isLoading}
          label="Inference Latency (p95)"
          tone="text-amber-600 dark:text-amber-400"
          trend={{
            direction: latencyDelta <= 0 ? "down" : "up",
            label: `${latencyDelta >= 0 ? "+" : ""}${Math.round(latencyDelta)} ms`,
            positive: latencyDelta <= 0,
          }}
          value={
            latestInferenceMetric ? `${Math.round(latestInferenceMetric.p95LatencyMs)} ms` : "--"
          }
        >
          <ChartContainer
            className="h-12 w-full"
            config={{
              latency: {
                color: "var(--chart-3)",
                label: "p95 latency",
              },
            }}
            initialDimension={{ height: 48, width: 220 }}
          >
            <LineChart
              accessibilityLayer
              data={inferenceMetricsQuery.data ?? []}
              margin={{ bottom: 2, left: 0, right: 0, top: 2 }}
            >
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={["dataMin - 20", "dataMax + 20"]} hide />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
              <Line
                dataKey="p95LatencyMs"
                dot={false}
                isAnimationActive={false}
                name="latency"
                stroke="var(--color-latency)"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ChartContainer>
        </MetricCard>

        <MetricCard
          description={`${Math.round(budgetPercent)}% of budget`}
          icon={DollarSign}
          isLoading={billingUsageQuery.isLoading}
          label="Monthly Compute Cost"
          tone="text-rose-600 dark:text-rose-400"
          trend={{
            direction: budgetPercent > 85 ? "up" : "flat",
            label: billingUsageQuery.data
              ? `${currencyFormatter.format(billingUsageQuery.data.budgetUsd)} budget`
              : "--",
            positive: budgetPercent <= 85,
          }}
          value={
            billingUsageQuery.data
              ? currencyFormatter.format(billingUsageQuery.data.totalCostUsd)
              : "--"
          }
        >
          <div className="space-y-2">
            <div
              aria-label={`Monthly compute cost is ${Math.round(budgetPercent)} percent of budget`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={Math.round(clampedBudgetPercent)}
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width]",
                  budgetPercent > 85 ? "bg-rose-500" : "bg-emerald-500",
                )}
                style={{ width: `${clampedBudgetPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Training {currencyFormatter.format(billingUsageQuery.data?.trainingCostUsd ?? 0)}
              </span>
              <span>
                Inference {currencyFormatter.format(billingUsageQuery.data?.inferenceCostUsd ?? 0)}
              </span>
            </div>
          </div>
        </MetricCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Deployment activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              Chart surface reserved for deployment and inference trends.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
              Training queue latency is above the weekly baseline.
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
              All production inference endpoints are healthy.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
