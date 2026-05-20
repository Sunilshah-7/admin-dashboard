import type {
  AuditLogParams,
  DeploymentListParams,
  ModelListParams,
  PaginationParams,
} from "@/lib/api-client";
import type { TimeRange } from "@/types/api";

const queryKeys = {
  metrics: {
    all: ["metrics"] as const,
    gpu: (range: TimeRange, intervalMinutes?: number) =>
      [...queryKeys.metrics.all, "gpu", { range, intervalMinutes }] as const,
    gpuSummary: () => [...queryKeys.metrics.all, "gpu-summary"] as const,
    inference: () => [...queryKeys.metrics.all, "inference"] as const,
  },
  models: {
    all: ["models"] as const,
    list: (filters?: ModelListParams) => [...queryKeys.models.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.models.all, "detail", id] as const,
  },
  deployments: {
    all: ["deployments"] as const,
    list: (filters?: DeploymentListParams) =>
      [...queryKeys.deployments.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.deployments.all, "detail", id] as const,
  },
  teams: {
    all: ["teams"] as const,
    list: (pagination?: PaginationParams) =>
      [...queryKeys.teams.all, "list", pagination ?? {}] as const,
  },
  auditLogs: {
    all: ["audit-logs"] as const,
    list: (params?: AuditLogParams) => [...queryKeys.auditLogs.all, "list", params ?? {}] as const,
  },
  billing: {
    all: ["billing"] as const,
    usage: () => [...queryKeys.billing.all, "usage"] as const,
    invoices: (pagination?: PaginationParams) =>
      [...queryKeys.billing.all, "invoices", pagination ?? {}] as const,
  },
  apiKeys: {
    all: ["api-keys"] as const,
    list: (pagination?: PaginationParams) =>
      [...queryKeys.apiKeys.all, "list", pagination ?? {}] as const,
  },
  webhooks: {
    all: ["webhooks"] as const,
    list: (pagination?: PaginationParams) =>
      [...queryKeys.webhooks.all, "list", pagination ?? {}] as const,
    deliveries: (pagination?: PaginationParams) =>
      [...queryKeys.webhooks.all, "deliveries", pagination ?? {}] as const,
  },
  playground: {
    all: ["playground"] as const,
    completion: () => [...queryKeys.playground.all, "completion"] as const,
  },
};

export { queryKeys };
