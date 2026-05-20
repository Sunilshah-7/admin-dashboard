import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

import { createApiKey, generateApiKeys } from "@/mocks/data/api-keys";
import { generateAuditLogs } from "@/mocks/data/audit-logs";
import { generateBillingInvoices, generateBillingUsage } from "@/mocks/data/billing";
import { generateDeployments } from "@/mocks/data/deployments";
import { generateGpuMetrics, generateGpuSummary } from "@/mocks/data/gpu-metrics";
import {
  getLegacyProduct,
  getLegacyProducts,
  getLegacyUser,
  getLegacyUsers,
  getProductSales,
  getUserAnalytics,
} from "@/mocks/data/legacy-dashboard";
import { generateModels } from "@/mocks/data/model-registry";
import { generateMockCompletion } from "@/mocks/data/playground";
import { generateTeamMembers, getRolePermissions } from "@/mocks/data/teams";
import type {
  ApiResponse,
  ApiKey,
  ApiKeyEnvironment,
  ApiKeyScope,
  AuditLogEntry,
  DeploymentEnvironment,
  DeploymentLog,
  ModelDeployment,
  ModelStatus,
  ModelType,
  PaginatedResponse,
  Role,
  TeamMember,
  TimeRange,
} from "@/types/api";

const models = generateModels(16);
const deployments = generateDeployments(24);
const teamMembers = generateTeamMembers(12);
const auditLogs = generateAuditLogs(64);
const billingUsage = generateBillingUsage();
const billingInvoices = generateBillingInvoices(12);
const apiKeys = generateApiKeys();

const currentUser = {
  id: "user_admin",
  name: "Platform Admin",
  email: "admin@reflection.ai",
};

const adminPermissions = getRolePermissions("admin");

function ok<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return {
    data,
    meta: {
      generatedAt: new Date().toISOString(),
      ...meta,
    },
    error: null,
  };
}

function notFound(message: string) {
  return HttpResponse.json(
    {
      data: null,
      error: {
        code: "not_found",
        message,
      },
    },
    { status: 404 },
  );
}

function getSearchParam(request: Request, name: string) {
  return new URL(request.url).searchParams.get(name);
}

function getNumberParam(request: Request, name: string, fallback: number) {
  const value = Number(getSearchParam(request, name));

  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function paginate<T>(request: Request, items: T[]): PaginatedResponse<T> {
  const page = getNumberParam(request, "page", 1);
  const limit = getNumberParam(request, "limit", 20);
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total: items.length,
      hasMore: start + limit < items.length,
      generatedAt: new Date().toISOString(),
    },
    error: null,
  };
}

function createInferenceMetrics() {
  faker.seed(2808);

  return Array.from({ length: 24 }, (_, index) => {
    const timestamp = new Date(Date.now() - (23 - index) * 60 * 60 * 1000).toISOString();
    const p50LatencyMs = faker.number.int({ min: 80, max: 180 });
    const p95LatencyMs = p50LatencyMs + faker.number.int({ min: 80, max: 260 });
    const p99LatencyMs = p95LatencyMs + faker.number.int({ min: 80, max: 420 });

    return {
      timestamp,
      requestsPerMinute: faker.number.int({ min: 12_000, max: 62_000 }),
      tokensPerSecond: faker.number.int({ min: 42_000, max: 240_000 }),
      p50LatencyMs,
      p95LatencyMs,
      p99LatencyMs,
      errorRatePercent: Number(faker.number.float({ min: 0.01, max: 1.8 }).toFixed(2)),
    };
  });
}

async function parseJsonBody<T>(request: Request): Promise<Partial<T>> {
  try {
    return (await request.json()) as Partial<T>;
  } catch {
    return {};
  }
}

function createDeploymentStream(logs: DeploymentLog[]) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      logs.forEach((log, index) => {
        controller.enqueue(
          encoder.encode(`event: log\ndata: ${JSON.stringify({ index, ...log })}\n\n`),
        );
      });
      controller.enqueue(encoder.encode('event: done\ndata: {"ok":true}\n\n'));
      controller.close();
    },
  });
}

const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json(ok({ status: "ok", service: "mock-api" }));
  }),

  http.post("/api/auth/login", async ({ request }) => {
    const body = await parseJsonBody<{ email: string }>(request);

    return HttpResponse.json(
      ok({
        user: {
          ...currentUser,
          email: body.email ?? currentUser.email,
        },
        roles: ["admin"] satisfies Role[],
        permissions: adminPermissions,
        token: "mock-session-token",
      }),
    );
  }),

  http.post("/api/auth/logout", () => {
    return HttpResponse.json(ok({ success: true }));
  }),

  http.get("/api/auth/me", () => {
    return HttpResponse.json(
      ok({
        user: currentUser,
        roles: ["admin"] satisfies Role[],
        permissions: adminPermissions,
      }),
    );
  }),

  http.get("/api/metrics/gpu", ({ request }) => {
    const range = (getSearchParam(request, "range") ?? "24h") as TimeRange;
    const intervalMinutes = getNumberParam(request, "intervalMinutes", 5);

    return HttpResponse.json(ok(generateGpuMetrics({ range, intervalMinutes })));
  }),

  http.get("/api/metrics/gpu/summary", () => {
    return HttpResponse.json(ok(generateGpuSummary()));
  }),

  http.get("/api/metrics/inference", () => {
    return HttpResponse.json(ok(createInferenceMetrics()));
  }),

  http.get("/api/models", ({ request }) => {
    const status = getSearchParam(request, "status") as ModelStatus | null;
    const type = getSearchParam(request, "type") as ModelType | null;
    const query = getSearchParam(request, "q")?.toLowerCase();

    const filtered = models.filter((model) => {
      const matchesStatus = status ? model.status === status : true;
      const matchesType = type ? model.type === type : true;
      const matchesQuery = query
        ? model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query)
        : true;

      return matchesStatus && matchesType && matchesQuery;
    });

    return HttpResponse.json(paginate(request, filtered));
  }),

  http.get("/api/models/:id", ({ params }) => {
    const model = models.find((item) => item.id === String(params.id));

    if (!model) {
      return notFound("Model not found");
    }

    return HttpResponse.json(ok(model));
  }),

  http.post("/api/models/:id/deploy", async ({ params, request }) => {
    const model = models.find((item) => item.id === String(params.id));

    if (!model) {
      return notFound("Model not found");
    }

    const body = await parseJsonBody<{
      environment: DeploymentEnvironment;
      versionId: string;
      replicas: number;
    }>(request);
    const latestVersion = model.versions.at(-1);

    if (!latestVersion) {
      return HttpResponse.json(
        {
          data: null,
          error: {
            code: "missing_model_version",
            message: "Model has no deployable versions",
          },
        },
        { status: 422 },
      );
    }

    const deployment: ModelDeployment = {
      id: `${model.id}_${body.environment ?? "staging"}_${Date.now()}`,
      modelId: model.id,
      modelVersionId: body.versionId ?? latestVersion.id,
      environment: body.environment ?? "staging",
      status: "deploying",
      endpointUrl: `https://${body.environment ?? "staging"}.api.reflection.ai/models/${model.id}`,
      replicas: body.replicas ?? 2,
      lastDeployedAt: new Date().toISOString(),
    };

    model.deployments.unshift(deployment);

    return HttpResponse.json(ok(deployment), { status: 202 });
  }),

  http.get("/api/deployments", ({ request }) => {
    const environment = getSearchParam(request, "environment") as DeploymentEnvironment | null;
    const status = getSearchParam(request, "status");
    const filtered = deployments.filter((deployment) => {
      return (
        (environment ? deployment.environment === environment : true) &&
        (status ? deployment.status === status : true)
      );
    });

    return HttpResponse.json(paginate(request, filtered));
  }),

  http.get("/api/deployments/:id", ({ params }) => {
    const deployment = deployments.find((item) => item.id === String(params.id));

    if (!deployment) {
      return notFound("Deployment not found");
    }

    return HttpResponse.json(ok(deployment));
  }),

  http.get("/api/deployments/:id/logs", ({ params }) => {
    const deployment = deployments.find((item) => item.id === String(params.id));

    if (!deployment) {
      return notFound("Deployment not found");
    }

    return new HttpResponse(createDeploymentStream(deployment.logs), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }),

  http.get("/api/teams", ({ request }) => {
    return HttpResponse.json(paginate(request, teamMembers));
  }),

  http.post("/api/teams/invite", async ({ request }) => {
    const body = await parseJsonBody<{ email: string; role: Role; name: string }>(request);
    const role = body.role ?? "viewer";
    const member: TeamMember = {
      id: `team_member_${teamMembers.length + 1}`,
      name: body.name ?? String(body.email ?? "Invited User").split("@")[0] ?? "Invited User",
      email: body.email ?? "invited@reflection.ai",
      role,
      permissions: getRolePermissions(role),
      status: "invited",
      createdAt: new Date().toISOString(),
    };

    teamMembers.unshift(member);

    return HttpResponse.json(ok(member), { status: 201 });
  }),

  http.patch("/api/teams/:id/role", async ({ params, request }) => {
    const member = teamMembers.find((item) => item.id === String(params.id));

    if (!member) {
      return notFound("Team member not found");
    }

    const body = await parseJsonBody<{ role: Role }>(request);
    const role = body.role ?? member.role;

    member.role = role;
    member.permissions = getRolePermissions(role);

    return HttpResponse.json(ok(member));
  }),

  http.get("/api/audit-logs", ({ request }) => {
    const action = getSearchParam(request, "action");
    const filtered = action ? auditLogs.filter((entry) => entry.action === action) : auditLogs;

    return HttpResponse.json(paginate<AuditLogEntry>(request, filtered));
  }),

  http.get("/api/billing/usage", () => {
    return HttpResponse.json(ok(billingUsage));
  }),

  http.get("/api/billing/invoices", ({ request }) => {
    return HttpResponse.json(paginate(request, billingInvoices));
  }),

  http.get("/api/api-keys", ({ request }) => {
    return HttpResponse.json(paginate<ApiKey>(request, apiKeys));
  }),

  http.post("/api/api-keys", async ({ request }) => {
    const body = await parseJsonBody<{
      name: string;
      environment: ApiKeyEnvironment;
      scopes: ApiKeyScope[];
      expiresAt: string;
    }>(request);
    const created = createApiKey(body);

    apiKeys.unshift(created.apiKey);

    return HttpResponse.json(ok(created), { status: 201 });
  }),

  http.patch("/api/api-keys/:id/revoke", ({ params }) => {
    const apiKey = apiKeys.find((item) => item.id === String(params.id));

    if (!apiKey) {
      return notFound("API key not found");
    }

    apiKey.status = "revoked";
    apiKey.revokedAt = new Date().toISOString();

    return HttpResponse.json(ok(apiKey));
  }),

  http.post("/api/playground/completion", async ({ request }) => {
    const body = await parseJsonBody<{ prompt: string }>(request);

    return HttpResponse.json(ok(generateMockCompletion(body.prompt ?? "")));
  }),

  http.get("/api/legacy/user-analytics", () => {
    return HttpResponse.json(ok(getUserAnalytics()));
  }),

  http.get("/api/legacy/product-sales", () => {
    return HttpResponse.json(ok(getProductSales()));
  }),

  http.get("/api/legacy/users", () => {
    const users = getLegacyUsers();

    return HttpResponse.json(ok(users, { total: users.length }));
  }),

  http.get("/api/legacy/users/:userId", ({ params }) => {
    const user = getLegacyUser(String(params.userId));

    if (!user) {
      return notFound("User not found");
    }

    return HttpResponse.json(ok(user));
  }),

  http.get("/api/legacy/products", () => {
    const products = getLegacyProducts();

    return HttpResponse.json(ok(products, { total: products.length }));
  }),

  http.get("/api/legacy/products/:productId", ({ params }) => {
    const product = getLegacyProduct(String(params.productId));

    if (!product) {
      return notFound("Product not found");
    }

    return HttpResponse.json(ok(product));
  }),
];

export { handlers };
