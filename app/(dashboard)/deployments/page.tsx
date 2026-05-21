"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDashed, Eye, GitBranch, Loader2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeploymentDetail, useDeployments } from "@/hooks";
import { cn } from "@/lib/utils";
import type {
  Deployment,
  DeploymentEnvironment,
  DeploymentStageStatus,
  DeploymentStatus,
} from "@/types/api";

type EnvironmentFilter = "all" | Extract<DeploymentEnvironment, "production" | "staging">;

const environmentFilters: EnvironmentFilter[] = ["all", "staging", "production"];

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDuration(seconds?: number) {
  if (!seconds) {
    return "In progress";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 1) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function formatDateTime(timestamp: string) {
  return dateTimeFormatter.format(new Date(timestamp));
}

function getDeploymentBadgeVariant(status: DeploymentStatus) {
  if (status === "failed" || status === "canceled") {
    return "destructive" as const;
  }

  if (status === "succeeded") {
    return "secondary" as const;
  }

  return "outline" as const;
}

function getStageTone(status: DeploymentStageStatus) {
  if (status === "succeeded") {
    return {
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100",
      icon: CheckCircle2,
    };
  }

  if (status === "running") {
    return {
      className:
        "border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100",
      icon: Loader2,
    };
  }

  if (status === "failed") {
    return {
      className: "border-destructive/30 bg-destructive/10 text-destructive",
      icon: XCircle,
    };
  }

  return {
    className: "border-border bg-muted/40 text-muted-foreground",
    icon: CircleDashed,
  };
}

function PipelineCard({
  deployment,
  onOpen,
}: {
  deployment: Deployment;
  onOpen: (deploymentId: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{deployment.modelName}</CardTitle>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <GitBranch className="size-3.5" />
              <span className="truncate">{deployment.branch}</span>
            </div>
          </div>
          <Badge
            className="rounded-md capitalize"
            variant={getDeploymentBadgeVariant(deployment.status)}
          >
            {deployment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {deployment.stages.map((stage) => {
            const tone = getStageTone(stage.status);
            const StageIcon = tone.icon;

            return (
              <div key={stage.id} className={cn("rounded-md border p-2 text-xs", tone.className)}>
                <div className="flex items-center gap-2 font-medium">
                  <StageIcon
                    className={cn("size-3.5", stage.status === "running" && "animate-spin")}
                  />
                  {stage.name}
                </div>
                <div className="mt-1 capitalize opacity-80">{stage.status}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="capitalize">{deployment.environment}</span>
          <span>{formatDuration(deployment.durationSeconds)}</span>
        </div>
        <Button
          className="w-full"
          size="sm"
          type="button"
          variant="outline"
          onClick={() => onOpen(deployment.id)}
        >
          <Eye className="size-3.5" />
          View logs
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DeploymentsPage() {
  const [environmentFilter, setEnvironmentFilter] = useState<EnvironmentFilter>("all");
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);
  const deploymentsQuery = useDeployments({
    environment: environmentFilter === "all" ? undefined : environmentFilter,
    limit: 100,
  });
  const deploymentDetailQuery = useDeploymentDetail(selectedDeploymentId);
  const selectedDeployment = deploymentDetailQuery.data;

  const sortedDeployments = useMemo(() => {
    return [...(deploymentsQuery.data?.data ?? [])].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );
  }, [deploymentsQuery.data?.data]);

  const pipelineDeployments = sortedDeployments.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Deployments</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Track CI/CD pipeline progress, release environments, and deployment logs.
          </p>
        </div>
        <Select
          value={environmentFilter}
          onValueChange={(value) => setEnvironmentFilter(value as EnvironmentFilter)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {environmentFilters.map((environment) => (
              <SelectItem key={environment} value={environment} className="capitalize">
                {environment === "all" ? "All environments" : environment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pipelineDeployments.map((deployment) => (
          <PipelineCard
            key={deployment.id}
            deployment={deployment}
            onOpen={setSelectedDeploymentId}
          />
        ))}
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Deployment List</CardTitle>
          <div className="text-sm text-muted-foreground">
            {sortedDeployments.length} deployments
          </div>
        </CardHeader>
        <CardContent>
          <Table aria-label="Deployment list">
            <TableHeader>
              <TableRow>
                <TableHead>Commit SHA</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Started</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDeployments.map((deployment) => (
                <TableRow key={deployment.id}>
                  <TableCell className="font-mono text-xs">{deployment.commitSha}</TableCell>
                  <TableCell>
                    <div className="flex max-w-48 items-center gap-2">
                      <GitBranch className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{deployment.branch}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{deployment.environment}</TableCell>
                  <TableCell>
                    <Badge
                      className="rounded-md capitalize"
                      variant={getDeploymentBadgeVariant(deployment.status)}
                    >
                      {deployment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatDuration(deployment.durationSeconds)}
                  </TableCell>
                  <TableCell>{formatDateTime(deployment.startedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedDeploymentId(deployment.id)}
                    >
                      <Eye className="size-3.5" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!sortedDeployments.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No deployments match this environment.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet
        open={Boolean(selectedDeploymentId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDeploymentId(null);
          }
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{selectedDeployment?.modelName ?? "Deployment details"}</SheetTitle>
            <SheetDescription>
              {selectedDeployment
                ? `${selectedDeployment.commitSha} on ${selectedDeployment.branch}`
                : "Loading deployment logs"}
            </SheetDescription>
          </SheetHeader>

          {deploymentDetailQuery.isLoading ? (
            <div className="space-y-3 px-4">
              <div className="h-20 rounded-md bg-muted" />
              <div className="h-64 rounded-md bg-muted" />
            </div>
          ) : selectedDeployment ? (
            <div className="space-y-5 px-4 pb-4">
              <div className="grid gap-3 rounded-md border p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="capitalize">{selectedDeployment.environment}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    className="rounded-md capitalize"
                    variant={getDeploymentBadgeVariant(selectedDeployment.status)}
                  >
                    {selectedDeployment.status}
                  </Badge>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{formatDuration(selectedDeployment.durationSeconds)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Triggered by</span>
                  <span>{selectedDeployment.triggeredBy}</span>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium">Pipeline stages</h3>
                <div className="space-y-2">
                  {selectedDeployment.stages.map((stage) => {
                    const tone = getStageTone(stage.status);
                    const StageIcon = tone.icon;

                    return (
                      <div
                        key={stage.id}
                        className={cn(
                          "flex items-center justify-between rounded-md border p-3",
                          tone.className,
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <StageIcon
                            className={cn("size-4", stage.status === "running" && "animate-spin")}
                          />
                          <span className="font-medium">{stage.name}</span>
                        </div>
                        <span className="text-xs capitalize">{stage.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium">Logs</h3>
                <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                  {selectedDeployment.logs.map((log) => (
                    <div
                      key={log.id}
                      className="grid gap-1 rounded-md bg-background p-2 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {formatDateTime(log.timestamp)}
                        </span>
                        <Badge
                          className="rounded-md uppercase"
                          variant={log.level === "error" ? "destructive" : "outline"}
                        >
                          {log.level}
                        </Badge>
                      </div>
                      <div>{log.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 text-sm text-muted-foreground">Deployment not found.</div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
