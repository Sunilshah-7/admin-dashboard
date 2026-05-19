"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Archive, Box, Eye, MoreHorizontal, Plus, Rocket, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeployModel, useModelRegistry } from "@/hooks";
import { cn } from "@/lib/utils";
import type { DeploymentEnvironment, Model, ModelStatus, ModelType } from "@/types/api";

type StatusFilter = "all" | Extract<ModelStatus, "archived" | "deployed" | "training">;
type TypeFilter = "all" | Extract<ModelType, "Embedding" | "LLM" | "Vision">;
type WizardStep = "configure" | "resources" | "review";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const modelTypes: TypeFilter[] = ["LLM", "Vision", "Embedding"];
const modelStatuses: StatusFilter[] = ["deployed", "training", "archived"];
const environments: DeploymentEnvironment[] = ["development", "staging", "production"];

function getModelStatus(model: Model, archivedIds: Set<string>): ModelStatus {
  if (archivedIds.has(model.id)) {
    return "archived";
  }

  return model.status;
}

function formatDate(value?: string) {
  if (!value) {
    return "Never";
  }

  return dateFormatter.format(new Date(value));
}

function getStatusBadgeVariant(status: ModelStatus) {
  if (status === "failed") {
    return "destructive" as const;
  }

  if (status === "deployed") {
    return "secondary" as const;
  }

  return "outline" as const;
}

function getNextWizardStep(step: WizardStep): WizardStep {
  if (step === "configure") {
    return "resources";
  }

  return "review";
}

function getPreviousWizardStep(step: WizardStep): WizardStep {
  if (step === "review") {
    return "resources";
  }

  return "configure";
}

function DeployNewModelWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<WizardStep>("configure");
  const [modelName, setModelName] = useState("Reflection Candidate");
  const [modelType, setModelType] =
    useState<Extract<ModelType, "Embedding" | "LLM" | "Vision">>("LLM");
  const [environment, setEnvironment] = useState<DeploymentEnvironment>("staging");
  const [replicas, setReplicas] = useState(3);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setStep("configure");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Deploy New Model</DialogTitle>
          <DialogDescription>
            Configure a model artifact, serving target, and capacity before deployment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {(["configure", "resources", "review"] satisfies WizardStep[]).map((item, index) => (
            <div
              key={item}
              className={cn(
                "rounded-md border px-3 py-2 capitalize",
                step === item
                  ? "border-primary bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}
            >
              {index + 1}. {item}
            </div>
          ))}
        </div>

        {step === "configure" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="modelName" className="text-sm font-medium">
                Model name
              </label>
              <Input
                id="modelName"
                value={modelName}
                onChange={(event) => setModelName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="modelType" className="text-sm font-medium">
                Type
              </label>
              <Select
                value={modelType}
                onValueChange={(value) =>
                  setModelType(value as Extract<ModelType, "Embedding" | "LLM" | "Vision">)
                }
              >
                <SelectTrigger id="modelType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="artifact" className="text-sm font-medium">
                Artifact URI
              </label>
              <Input id="artifact" defaultValue="s3://reflection-model-registry/candidate/v1" />
            </div>
          </div>
        ) : null}

        {step === "resources" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="environment" className="text-sm font-medium">
                Environment
              </label>
              <Select
                value={environment}
                onValueChange={(value) => setEnvironment(value as DeploymentEnvironment)}
              >
                <SelectTrigger id="environment" className="w-full capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((item) => (
                    <SelectItem key={item} value={item} className="capitalize">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="replicas" className="text-sm font-medium">
                Replicas
              </label>
              <Input
                id="replicas"
                min={1}
                max={16}
                type="number"
                value={replicas}
                onChange={(event) => setReplicas(Number(event.target.value))}
              />
            </div>
          </div>
        ) : null}

        {step === "review" ? (
          <div className="grid gap-3 rounded-md border p-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium">{modelName}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Type</span>
              <span>{modelType}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Environment</span>
              <span className="capitalize">{environment}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Replicas</span>
              <span>{replicas}</span>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          {step !== "configure" ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(getPreviousWizardStep(step))}
            >
              Back
            </Button>
          ) : null}
          {step === "review" ? (
            <Button type="button" onClick={() => handleOpenChange(false)}>
              <Rocket className="size-4" />
              Start deployment
            </Button>
          ) : (
            <Button type="button" onClick={() => setStep(getNextWizardStep(step))}>
              Continue
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [detailModel, setDetailModel] = useState<Model | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const deployModelMutation = useDeployModel();
  const modelsQuery = useModelRegistry({ limit: 100 });

  const models = useMemo(() => {
    return (modelsQuery.data?.data ?? [])
      .filter((model) => !deletedIds.has(model.id))
      .filter((model) => {
        const status = getModelStatus(model, archivedIds);
        const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" ? true : status === statusFilter;
        const matchesType = typeFilter === "all" ? true : model.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      });
  }, [archivedIds, deletedIds, modelsQuery.data?.data, searchQuery, statusFilter, typeFilter]);

  const selectedModels = models.filter((model) => selectedIds.has(model.id));
  const allVisibleSelected =
    models.length > 0 && models.every((model) => selectedIds.has(model.id));
  const hasSelection = selectedIds.size > 0;

  function toggleModelSelection(modelId: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(modelId);
      } else {
        next.delete(modelId);
      }

      return next;
    });
  }

  function handleToggleAll(checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);

      models.forEach((model) => {
        if (checked) {
          next.add(model.id);
        } else {
          next.delete(model.id);
        }
      });

      return next;
    });
  }

  function archiveModel(modelId: string) {
    setArchivedIds((current) => new Set(current).add(modelId));
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(modelId);
      return next;
    });
  }

  function deleteSelectedModels() {
    setDeletedIds((current) => {
      const next = new Set(current);

      selectedIds.forEach((id) => next.add(id));

      return next;
    });
    setSelectedIds(new Set());
  }

  function deployModel(model: Model) {
    const latestVersion = model.versions.at(-1);

    if (!latestVersion) {
      return;
    }

    deployModelMutation.mutate({
      id: model.id,
      payload: {
        environment: "staging",
        replicas: 2,
        versionId: latestVersion.id,
      },
    });
  }

  function deploySelectedModels() {
    selectedModels.forEach((model) => deployModel(model));
    setSelectedIds(new Set());
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Model Registry</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Search, filter, deploy, and manage model artifacts across serving environments.
          </p>
        </div>
        <Button type="button" onClick={() => setWizardOpen(true)}>
          <Plus className="size-4" />
          Deploy New Model
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Registry</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-72">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search models by name"
                  className="pl-8"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as StatusFilter)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {modelStatuses.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as TypeFilter)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {modelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {models.length} models shown
              {hasSelection ? `, ${selectedIds.size} selected` : ""}
            </div>
            <div className="flex gap-2">
              <Button
                disabled={!hasSelection || deployModelMutation.isPending}
                size="sm"
                type="button"
                variant="outline"
                onClick={deploySelectedModels}
              >
                <Rocket className="size-3.5" />
                Deploy selected
              </Button>
              <Button
                disabled={!hasSelection}
                size="sm"
                type="button"
                variant="destructive"
                onClick={deleteSelectedModels}
              >
                <Trash2 className="size-3.5" />
                Delete selected
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    aria-label="Select all visible models"
                    checked={allVisibleSelected}
                    onCheckedChange={(checked) => handleToggleAll(checked === true)}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Last Deployed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => {
                const status = getModelStatus(model, archivedIds);

                return (
                  <TableRow key={model.id}>
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${model.name}`}
                        checked={selectedIds.has(model.id)}
                        onCheckedChange={(checked) =>
                          toggleModelSelection(model.id, checked === true)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Box className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{model.name}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {model.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{model.currentVersion}</TableCell>
                    <TableCell>
                      <Badge
                        className="rounded-md capitalize"
                        variant={getStatusBadgeVariant(status)}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>{model.type}</TableCell>
                    <TableCell className="tabular-nums">{model.latencyP95Ms} ms</TableCell>
                    <TableCell>{formatDate(model.lastDeployedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-label={`Open actions for ${model.name}`}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild>
                            <Link href={`/models/${model.id}`}>
                              <Eye className="size-4" />
                              View details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={status === "archived" || deployModelMutation.isPending}
                            onClick={() => deployModel(model)}
                          >
                            <Rocket className="size-4" />
                            Deploy
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={status === "archived"}
                            onClick={() => archiveModel(model.id)}
                          >
                            <Archive className="size-4" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!models.length ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No models match the current filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(detailModel)} onOpenChange={(open) => !open && setDetailModel(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{detailModel?.name}</DialogTitle>
            <DialogDescription>{detailModel?.description}</DialogDescription>
          </DialogHeader>
          {detailModel ? (
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Current version</span>
                <span className="font-mono">{detailModel.currentVersion}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Type</span>
                <span>{detailModel.type}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">p95 latency</span>
                <span>{detailModel.latencyP95Ms} ms</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Error rate</span>
                <span>{detailModel.errorRatePercent}%</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Deployments</span>
                <span>{detailModel.deployments.length}</span>
              </div>
            </div>
          ) : null}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <DeployNewModelWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}
