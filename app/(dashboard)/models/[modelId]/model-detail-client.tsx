"use client";

import Link from "next/link";
import type * as React from "react";
import { Activity, ArrowLeft, ExternalLink, GitBranch, Rocket, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "@/components/charts/dynamic-recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeployModel, useInferenceMetrics, useModelDetail } from "@/hooks";
import { useAuthStore } from "@/stores/auth-store";
import type { Model, ModelDeployment, ModelStatus } from "@/types/api";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});

function getStatusBadgeVariant(status: ModelStatus | ModelDeployment["status"]) {
  if (status === "failed") {
    return "destructive" as const;
  }

  if (status === "deployed" || status === "healthy") {
    return "secondary" as const;
  }

  return "outline" as const;
}

function formatDate(value?: string) {
  if (!value) {
    return "Never";
  }

  return dateFormatter.format(new Date(value));
}

function getPrimaryDeployment(model: Model) {
  return (
    model.deployments.find((deployment) => deployment.environment === "production") ??
    model.deployments.find((deployment) => deployment.environment === "staging") ??
    model.deployments[0]
  );
}

function getMetricSummary(
  inferenceMetrics: Array<{
    requestsPerMinute: number;
    p50LatencyMs: number;
    errorRatePercent: number;
  }>,
  model: Model,
) {
  const totalRequests = inferenceMetrics.reduce(
    (total, metric) => total + metric.requestsPerMinute * 60,
    0,
  );
  const avgLatency =
    inferenceMetrics.reduce((total, metric) => total + metric.p50LatencyMs, 0) /
    Math.max(inferenceMetrics.length, 1);
  const avgErrorRate =
    inferenceMetrics.reduce((total, metric) => total + metric.errorRatePercent, 0) /
    Math.max(inferenceMetrics.length, 1);
  const failedDeployments = model.deployments.filter(
    (deployment) => deployment.status === "failed",
  );
  const uptime = Math.max(
    99,
    100 - failedDeployments.length * 0.18 - model.errorRatePercent * 0.05,
  );

  return {
    avgLatency,
    errorRate: avgErrorRate || model.errorRatePercent,
    totalRequests,
    uptime,
  };
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="size-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}

function ModelDetailClient({ modelId }: { modelId: string }) {
  const modelQuery = useModelDetail(modelId);
  const inferenceMetricsQuery = useInferenceMetrics();
  const deployModelMutation = useDeployModel();
  const roles = useAuthStore((state) => state.roles);
  const model = modelQuery.data;
  const primaryDeployment = model ? getPrimaryDeployment(model) : undefined;
  const inferenceMetrics = inferenceMetricsQuery.data ?? [];
  const metricSummary = model ? getMetricSummary(inferenceMetrics, model) : null;
  const latestVersion = model?.versions.at(-1);
  const canWriteModels = roles.some((role) => role === "admin" || role === "engineer");

  function handleDeploy() {
    if (!model || !latestVersion) {
      return;
    }

    deployModelMutation.mutate({
      id: model.id,
      payload: {
        environment: primaryDeployment?.environment ?? "staging",
        replicas: primaryDeployment?.replicas ?? 2,
        versionId: latestVersion.id,
      },
    });
  }

  if (modelQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="space-y-4">
        <Button asChild variant="outline">
          <Link href="/models">
            <ArrowLeft className="size-4" />
            Back to models
          </Link>
        </Button>
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Model not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Button asChild className="mb-3" size="sm" variant="ghost">
            <Link href="/models">
              <ArrowLeft className="size-4" />
              Models
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">{model.name}</h2>
            <Badge className="rounded-md" variant="outline">
              {model.currentVersion}
            </Badge>
            <Badge className="rounded-md capitalize" variant={getStatusBadgeVariant(model.status)}>
              {model.status}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{model.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline">
            <GitBranch className="size-4" />
            Compare versions
          </Button>
          {canWriteModels ? (
            <Button type="button" onClick={handleDeploy} disabled={deployModelMutation.isPending}>
              <Rocket className="size-4" />
              Deploy
            </Button>
          ) : null}
        </div>
      </div>

      {metricSummary ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            helper="estimated over the last 24h"
            icon={Activity}
            label="Total Requests"
            value={numberFormatter.format(metricSummary.totalRequests)}
          />
          <MetricCard
            helper="mean p50 inference latency"
            icon={Activity}
            label="Avg Latency"
            value={`${Math.round(metricSummary.avgLatency)} ms`}
          />
          <MetricCard
            helper="average request failure rate"
            icon={ShieldCheck}
            label="Error Rate"
            value={`${metricSummary.errorRate.toFixed(2)}%`}
          />
          <MetricCard
            helper="derived from deployment health"
            icon={ShieldCheck}
            label="Uptime"
            value={`${metricSummary.uptime.toFixed(2)}%`}
          />
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Performance Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-80 w-full"
              config={{
                p50LatencyMs: {
                  color: "var(--chart-2)",
                  label: "p50",
                },
                p95LatencyMs: {
                  color: "var(--chart-3)",
                  label: "p95",
                },
              }}
            >
              <LineChart
                accessibilityLayer
                data={inferenceMetrics.map((metric) => ({
                  ...metric,
                  label: timeFormatter.format(new Date(metric.timestamp)),
                }))}
                margin={{ bottom: 0, left: 0, right: 12, top: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="label"
                  minTickGap={28}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis
                  axisLine={false}
                  tickFormatter={(value) => `${value}ms`}
                  tickLine={false}
                  tickMargin={8}
                  width={52}
                />
                <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                <Line
                  dataKey="p50LatencyMs"
                  dot={false}
                  isAnimationActive={false}
                  name="p50LatencyMs"
                  stroke="var(--color-p50LatencyMs)"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="p95LatencyMs"
                  dot={false}
                  isAnimationActive={false}
                  name="p95LatencyMs"
                  stroke="var(--color-p95LatencyMs)"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Config</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Environment</span>
                <Badge className="rounded-md capitalize" variant="outline">
                  {primaryDeployment?.environment ?? "unassigned"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className="rounded-md capitalize"
                  variant={
                    primaryDeployment ? getStatusBadgeVariant(primaryDeployment.status) : "outline"
                  }
                >
                  {primaryDeployment?.status ?? "not deployed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Replicas</span>
                <span className="font-medium tabular-nums">{primaryDeployment?.replicas ?? 0}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Scaling</span>
                <span className="font-medium">2-12 replicas</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Last deployed</span>
                <span>{formatDate(primaryDeployment?.lastDeployedAt)}</span>
              </div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="mb-1 text-xs font-medium text-muted-foreground">Endpoint URL</div>
              {primaryDeployment?.endpointUrl ? (
                <a
                  className="flex items-center gap-2 break-all text-sm text-primary hover:underline"
                  href={primaryDeployment.endpointUrl}
                >
                  {primaryDeployment.endpointUrl}
                  <ExternalLink className="size-3.5 shrink-0" />
                </a>
              ) : (
                <div className="text-sm text-muted-foreground">No endpoint configured</div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Changelog</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Artifact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...model.versions].reverse().map((version) => (
                <TableRow key={version.id}>
                  <TableCell className="font-mono text-xs">{version.version}</TableCell>
                  <TableCell className="min-w-72">{version.changelog}</TableCell>
                  <TableCell>{version.createdBy}</TableCell>
                  <TableCell>{formatDate(version.createdAt)}</TableCell>
                  <TableCell className="max-w-64 truncate font-mono text-xs text-muted-foreground">
                    {version.artifactUri}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export { ModelDetailClient };
