import { http, HttpResponse } from "msw";

const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json({
      status: "ok",
      service: "mock-api",
      timestamp: new Date().toISOString(),
    });
  }),

  http.get("/api/auth/me", () => {
    return HttpResponse.json({
      user: {
        id: "user_admin",
        name: "Platform Admin",
        email: "admin@reflection.ai",
      },
      roles: ["admin"],
      permissions: [
        "dashboard:read",
        "models:read",
        "models:write",
        "deployments:read",
        "deployments:write",
        "teams:read",
        "teams:write",
        "monitoring:read",
        "integrations:manage",
        "settings:manage",
      ],
    });
  }),

  http.get("/api/metrics/gpu/summary", () => {
    return HttpResponse.json({
      utilization: 72,
      memoryUsedGb: 612,
      memoryTotalGb: 960,
      activeJobs: 14,
      alerts: 2,
    });
  }),

  http.get("/api/models", () => {
    return HttpResponse.json({
      data: [
        {
          id: "model_reflect_llm_70b",
          name: "Reflect LLM 70B",
          version: "v2.3.1",
          status: "deployed",
          type: "LLM",
        },
        {
          id: "model_embed_core",
          name: "Embed Core",
          version: "v1.8.0",
          status: "training",
          type: "Embedding",
        },
      ],
      meta: {
        page: 1,
        limit: 20,
        total: 2,
      },
    });
  }),
];

export { handlers };
