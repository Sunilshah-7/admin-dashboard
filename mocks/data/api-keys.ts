import { faker } from "@faker-js/faker";

import type { ApiKey, ApiKeyEnvironment, ApiKeyScope } from "@/types/api";

const scopes: ApiKeyScope[] = ["models:read", "models:write", "deployments:write", "metrics:read"];

function createSecretKey(environment: ApiKeyEnvironment) {
  const mode = environment === "production" ? "live" : "test";

  return `rai_${mode}_sk_${faker.string.alphanumeric({ length: 32, casing: "mixed" })}`;
}

function createPrefix(secretKey: string) {
  return `${secretKey.slice(0, 15)}...`;
}

function generateApiKeys(): ApiKey[] {
  faker.seed(3301);

  const now = Date.now();

  return [
    {
      id: "api_key_prod_inference",
      name: "Production inference",
      environment: "production",
      scopes: ["models:read", "metrics:read"],
      status: "active",
      prefix: "rai_live_sk_K8m...",
      lastUsedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 38 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "api_key_staging_deployments",
      name: "Staging deployments",
      environment: "staging",
      scopes: ["models:read", "models:write", "deployments:write"],
      status: "active",
      prefix: "rai_test_sk_Q4z...",
      lastUsedAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 19 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(now + 72 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "api_key_ci_metrics",
      name: "CI metrics smoke tests",
      environment: "development",
      scopes: ["metrics:read"],
      status: "revoked",
      prefix: "rai_test_sk_H2p...",
      lastUsedAt: new Date(now - 9 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 82 * 24 * 60 * 60 * 1000).toISOString(),
      revokedAt: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function createApiKey(input: {
  name?: string;
  environment?: ApiKeyEnvironment;
  scopes?: ApiKeyScope[];
  expiresAt?: string;
}): { apiKey: ApiKey; secretKey: string } {
  faker.seed(Date.now());

  const environment = input.environment ?? "development";
  const secretKey = createSecretKey(environment);
  const apiKey: ApiKey = {
    id: `api_key_${faker.string.uuid()}`,
    name: input.name?.trim() || "Untitled API key",
    environment,
    scopes: input.scopes?.length ? input.scopes : ["models:read"],
    status: "active",
    prefix: createPrefix(secretKey),
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt || undefined,
  };

  return { apiKey, secretKey };
}

export { createApiKey, generateApiKeys, scopes as apiKeyScopes };
