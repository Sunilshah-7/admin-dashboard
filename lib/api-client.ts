import type {
  ApiError,
  ApiKey,
  ApiKeyEnvironment,
  ApiKeyScope,
  ApiResponse,
  AuditAction,
  AuditLogEntry,
  BillingInvoice,
  BillingUsage,
  Deployment,
  DeploymentEnvironment,
  GpuMetricSeries,
  Model,
  ModelDeployment,
  ModelStatus,
  ModelType,
  PaginatedResponse,
  PlaygroundMessage,
  Role,
  TeamMember,
  TimeRange,
  Webhook,
  WebhookDelivery,
  WebhookEvent,
} from "@/types/api";

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;

type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

type ApiClientOptions = {
  baseUrl?: string;
  getAuthToken?: () => string | null | undefined;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
};

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  headers?: HeadersInit;
  query?: QueryParams;
  body?: unknown;
  auth?: boolean;
};

type PaginationParams = {
  page?: number;
  limit?: number;
};

type ModelListParams = PaginationParams & {
  status?: ModelStatus;
  type?: ModelType;
  q?: string;
};

type DeploymentListParams = PaginationParams & {
  environment?: DeploymentEnvironment;
  status?: Deployment["status"];
};

type AuditLogParams = PaginationParams & {
  action?: AuditAction;
};

type DeployModelPayload = {
  environment?: DeploymentEnvironment;
  versionId?: string;
  replicas?: number;
};

type InviteMemberPayload = {
  email: string;
  role: Role;
  name?: string;
};

type UpdateRolePayload = {
  role: Role;
};

type LoginPayload = {
  email: string;
  password: string;
};

type PlaygroundCompletionPayload = {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
};

type CreateApiKeyPayload = {
  name: string;
  environment: ApiKeyEnvironment;
  scopes: ApiKeyScope[];
  expiresAt?: string;
};

type CreateWebhookPayload = {
  name: string;
  url: string;
  events: WebhookEvent[];
};

class ApiClientError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor({
    status,
    code,
    message,
    details,
  }: {
    status: number;
    code: string;
    message: string;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function appendQueryParams(url: URL, query?: QueryParams) {
  if (!query) {
    return;
  }

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          url.searchParams.append(key, String(item));
        }
      });
      return;
    }

    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
}

function createApiUrl(baseUrl: string, path: string, query?: QueryParams) {
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(normalizedPath, normalizedBaseUrl);

  appendQueryParams(url, query);

  return url.toString();
}

function getDefaultBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
}

async function parseResponseJson<T>(response: Response): Promise<T | null> {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as T;
}

function formatApiError(response: Response, payload: ApiResponse<unknown> | null) {
  const fallbackMessage = response.statusText || "Request failed";
  const error: ApiError = payload?.error ?? {
    code: `http_${response.status}`,
    message: fallbackMessage,
  };

  return new ApiClientError({
    status: response.status,
    code: error.code,
    message: error.message,
    details: error.details,
  });
}

class ApiClient {
  private baseUrl: string;
  private getAuthToken?: ApiClientOptions["getAuthToken"];
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? getDefaultBaseUrl();
    this.getAuthToken = options.getAuthToken;
    this.requestInterceptors = options.requestInterceptors ?? [];
    this.responseInterceptors = options.responseInterceptors ?? [];
  }

  setAuthTokenGetter(getAuthToken: ApiClientOptions["getAuthToken"]) {
    this.getAuthToken = getAuthToken;
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const headers = new Headers(options.headers);

    headers.set("Accept", "application/json");

    if (options.body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (options.auth !== false) {
      const token = this.getAuthToken?.();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    let config: RequestInit = {
      ...options,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    };

    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    let response = await fetch(createApiUrl(this.baseUrl, path, options.query), config);

    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    const payload = await parseResponseJson<ApiResponse<T>>(response);

    if (!response.ok) {
      throw formatApiError(response, payload);
    }

    return (
      payload ?? {
        data: null,
        error: null,
      }
    );
  }

  async paginated<T>(path: string, options: RequestOptions = {}): Promise<PaginatedResponse<T>> {
    return this.request<T[]>(path, options) as Promise<PaginatedResponse<T>>;
  }

  get<T>(path: string, query?: QueryParams, options?: RequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: "GET",
      query,
    });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body,
    });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body,
    });
  }

  auth = {
    login: (body: LoginPayload) =>
      this.post<{ user: unknown; roles: Role[]; token: string }>("/api/auth/login", body),
    logout: () => this.post<{ success: boolean }>("/api/auth/logout"),
    me: () => this.get<{ user: unknown; roles: Role[] }>("/api/auth/me"),
  };

  metrics = {
    gpu: (params?: { range?: TimeRange; intervalMinutes?: number }) =>
      this.get<GpuMetricSeries>("/api/metrics/gpu", params),
    gpuSummary: () =>
      this.get<{
        clusterId: string;
        utilization: number;
        memoryUsedGb: number;
        memoryTotalGb: number;
        activeJobs: number;
        alerts: number;
        sampledAt: string;
      }>("/api/metrics/gpu/summary"),
    inference: () =>
      this.get<
        Array<{
          timestamp: string;
          requestsPerMinute: number;
          tokensPerSecond: number;
          p50LatencyMs: number;
          p95LatencyMs: number;
          p99LatencyMs: number;
          errorRatePercent: number;
        }>
      >("/api/metrics/inference"),
  };

  models = {
    list: (params?: ModelListParams) =>
      this.paginated<Model>("/api/models", {
        method: "GET",
        query: params,
      }),
    detail: (id: string) => this.get<Model>(`/api/models/${id}`),
    deploy: (id: string, body: DeployModelPayload) =>
      this.post<ModelDeployment>(`/api/models/${id}/deploy`, body),
  };

  deployments = {
    list: (params?: DeploymentListParams) =>
      this.paginated<Deployment>("/api/deployments", {
        method: "GET",
        query: params,
      }),
    detail: (id: string) => this.get<Deployment>(`/api/deployments/${id}`),
    logs: (id: string) => fetch(createApiUrl(this.baseUrl, `/api/deployments/${id}/logs`)),
  };

  teams = {
    list: (params?: PaginationParams) =>
      this.paginated<TeamMember>("/api/teams", {
        method: "GET",
        query: params,
      }),
    invite: (body: InviteMemberPayload) => this.post<TeamMember>("/api/teams/invite", body),
    updateRole: (id: string, body: UpdateRolePayload) =>
      this.patch<TeamMember>(`/api/teams/${id}/role`, body),
  };

  auditLogs = {
    list: (params?: AuditLogParams) =>
      this.paginated<AuditLogEntry>("/api/audit-logs", {
        method: "GET",
        query: params,
      }),
  };

  billing = {
    usage: () => this.get<BillingUsage>("/api/billing/usage"),
    invoices: (params?: PaginationParams) =>
      this.paginated<BillingInvoice>("/api/billing/invoices", {
        method: "GET",
        query: params,
      }),
  };

  apiKeys = {
    list: (params?: PaginationParams) =>
      this.paginated<ApiKey>("/api/api-keys", {
        method: "GET",
        query: params,
      }),
    create: (body: CreateApiKeyPayload) =>
      this.post<{ apiKey: ApiKey; secretKey: string }>("/api/api-keys", body),
    revoke: (id: string) => this.patch<ApiKey>(`/api/api-keys/${id}/revoke`),
  };

  webhooks = {
    list: (params?: PaginationParams) =>
      this.paginated<Webhook>("/api/webhooks", {
        method: "GET",
        query: params,
      }),
    create: (body: CreateWebhookPayload) =>
      this.post<{ webhook: Webhook; signingSecret: string }>("/api/webhooks", body),
    deliveries: (params?: PaginationParams) =>
      this.paginated<WebhookDelivery>("/api/webhooks/deliveries", {
        method: "GET",
        query: params,
      }),
  };

  playground = {
    completion: (body: { prompt: string }) =>
      this.post<PlaygroundMessage>("/api/playground/completion", body),
    huggingFaceCompletion: (body: PlaygroundCompletionPayload) =>
      this.post<{ message: PlaygroundMessage; model: string; provider: "huggingface" }>(
        "/api/playground/huggingface",
        body,
      ),
  };
}

const apiClient = new ApiClient();

export { ApiClient, ApiClientError, apiClient };
export type {
  AuditLogParams,
  CreateApiKeyPayload,
  CreateWebhookPayload,
  DeploymentListParams,
  DeployModelPayload,
  InviteMemberPayload,
  LoginPayload,
  ModelListParams,
  PaginationParams,
  PlaygroundCompletionPayload,
  QueryParams,
  RequestInterceptor,
  RequestOptions,
  ResponseInterceptor,
  UpdateRolePayload,
};
