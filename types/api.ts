type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

type ApiMeta = {
  requestId?: string;
  generatedAt?: string;
  [key: string]: unknown;
};

type ApiResponse<T> = {
  data: T | null;
  meta?: ApiMeta;
  error?: ApiError | null;
};

type PaginatedResponse<T> = ApiResponse<T[]> & {
  meta: ApiMeta & {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};

type TimeRange = "24h" | "7d" | "30d";

type GpuMetric = {
  timestamp: string;
  clusterId: string;
  gpuId: string;
  utilizationPercent: number;
  memoryUsedGb: number;
  memoryTotalGb: number;
  temperatureCelsius: number;
  powerWatts: number;
};

type GpuMetricSeries = {
  clusterId: string;
  range: TimeRange;
  intervalMinutes: number;
  metrics: GpuMetric[];
};

type ModelStatus = "deployed" | "training" | "archived" | "failed" | "draft";
type ModelType = "LLM" | "Vision" | "Embedding" | "Audio" | "Multimodal";
type DeploymentEnvironment = "development" | "staging" | "production";

type ModelVersion = {
  id: string;
  version: string;
  changelog: string;
  createdAt: string;
  createdBy: string;
  artifactUri: string;
};

type ModelDeployment = {
  id: string;
  modelId: string;
  modelVersionId: string;
  environment: DeploymentEnvironment;
  status: "pending" | "deploying" | "healthy" | "degraded" | "failed";
  endpointUrl: string;
  replicas: number;
  lastDeployedAt: string;
};

type Model = {
  id: string;
  name: string;
  description: string;
  type: ModelType;
  status: ModelStatus;
  currentVersion: string;
  versions: ModelVersion[];
  deployments: ModelDeployment[];
  latencyP95Ms: number;
  errorRatePercent: number;
  lastDeployedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type DeploymentStatus = "queued" | "running" | "succeeded" | "failed" | "canceled";
type DeploymentStageStatus = "pending" | "running" | "succeeded" | "failed" | "skipped";

type DeploymentStage = {
  id: string;
  name: "Build" | "Test" | "Deploy" | "Verify" | string;
  status: DeploymentStageStatus;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
};

type DeploymentLog = {
  id: string;
  deploymentId: string;
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  stageId?: string;
};

type Deployment = {
  id: string;
  modelId: string;
  modelName: string;
  commitSha: string;
  branch: string;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  stages: DeploymentStage[];
  logs: DeploymentLog[];
  triggeredBy: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
};

type Role = "admin" | "engineer" | "viewer";

type Permission =
  | "dashboard:read"
  | "models:read"
  | "models:write"
  | "deployments:read"
  | "deployments:write"
  | "teams:read"
  | "teams:write"
  | "monitoring:read"
  | "integrations:manage"
  | "settings:manage";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  permissions: Permission[];
  status: "active" | "invited" | "disabled";
  lastActiveAt?: string;
  createdAt: string;
};

type AuditAction =
  | "auth.login"
  | "auth.logout"
  | "team.invite"
  | "team.role_changed"
  | "model.created"
  | "model.deployed"
  | "deployment.started"
  | "deployment.failed"
  | "settings.updated"
  | "api_key.created"
  | "api_key.revoked";

type AuditLogEntry = {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: AuditAction;
  resourceType: "auth" | "team" | "model" | "deployment" | "settings" | "api_key";
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
};

type BillingUsage = {
  periodStart: string;
  periodEnd: string;
  budgetUsd: number;
  totalCostUsd: number;
  trainingCostUsd: number;
  inferenceCostUsd: number;
  storageCostUsd: number;
  gpuHours: number;
  tokenCount: number;
};

type BillingInvoice = {
  id: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  issuedAt: string;
  dueAt: string;
  status: "draft" | "open" | "paid" | "void" | "overdue";
  amountUsd: number;
  pdfUrl: string;
};

type ApiKeyEnvironment = "development" | "staging" | "production";
type ApiKeyScope = "models:read" | "models:write" | "deployments:write" | "metrics:read";
type ApiKeyStatus = "active" | "revoked";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  environment: ApiKeyEnvironment;
  scopes: ApiKeyScope[];
  status: ApiKeyStatus;
  lastUsedAt?: string;
  createdAt: string;
  expiresAt?: string;
  revokedAt?: string;
};

type CreatedApiKey = {
  apiKey: ApiKey;
  secretKey: string;
};

type WebhookEvent =
  | "model.deployed"
  | "deployment.failed"
  | "team.member_invited"
  | "billing.threshold_reached"
  | "api_key.revoked";
type WebhookStatus = "active" | "disabled";
type WebhookDeliveryStatus = "succeeded" | "failed" | "pending";

type Webhook = {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  status: WebhookStatus;
  secretPrefix: string;
  createdAt: string;
  lastDeliveryAt?: string;
};

type WebhookDelivery = {
  id: string;
  webhookId: string;
  webhookName: string;
  event: WebhookEvent;
  url: string;
  status: WebhookDeliveryStatus;
  responseCode?: number;
  durationMs?: number;
  deliveredAt: string;
};

type CreatedWebhook = {
  webhook: Webhook;
  signingSecret: string;
};

type PlaygroundRole = "system" | "user" | "assistant";

type PlaygroundMessage = {
  id: string;
  role: PlaygroundRole;
  content: string;
  createdAt: string;
  tokenCount?: number;
  latencyMs?: number;
};

type PlaygroundSession = {
  id: string;
  title: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
  messages: PlaygroundMessage[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type {
  ApiKey,
  ApiKeyEnvironment,
  ApiKeyScope,
  ApiKeyStatus,
  ApiError,
  ApiMeta,
  ApiResponse,
  AuditAction,
  AuditLogEntry,
  BillingInvoice,
  BillingUsage,
  CreatedApiKey,
  Deployment,
  DeploymentEnvironment,
  DeploymentLog,
  DeploymentStage,
  DeploymentStageStatus,
  DeploymentStatus,
  GpuMetric,
  GpuMetricSeries,
  Model,
  ModelDeployment,
  ModelStatus,
  ModelType,
  ModelVersion,
  PaginatedResponse,
  Permission,
  PlaygroundMessage,
  PlaygroundRole,
  PlaygroundSession,
  Role,
  TeamMember,
  TimeRange,
  CreatedWebhook,
  Webhook,
  WebhookDelivery,
  WebhookDeliveryStatus,
  WebhookEvent,
  WebhookStatus,
};
