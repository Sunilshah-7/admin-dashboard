import { faker } from "@faker-js/faker";

import type { Webhook, WebhookDelivery, WebhookEvent } from "@/types/api";

const webhookEvents: WebhookEvent[] = [
  "model.deployed",
  "deployment.failed",
  "team.member_invited",
  "billing.threshold_reached",
  "api_key.revoked",
];

function createSigningSecret() {
  return `whsec_${faker.string.alphanumeric({ length: 32, casing: "mixed" })}`;
}

function createSecretPrefix(secret: string) {
  return `${secret.slice(0, 12)}...`;
}

function generateWebhooks(): Webhook[] {
  faker.seed(3401);

  const now = Date.now();

  return [
    {
      id: "webhook_ops_alerts",
      name: "Ops alerts",
      url: "https://hooks.example.com/imd/ops",
      events: ["deployment.failed", "billing.threshold_reached"],
      status: "active",
      secretPrefix: "whsec_J9q2R...",
      createdAt: new Date(now - 47 * 24 * 60 * 60 * 1000).toISOString(),
      lastDeliveryAt: new Date(now - 38 * 60 * 1000).toISOString(),
    },
    {
      id: "webhook_model_registry",
      name: "Model registry sync",
      url: "https://platform.example.com/api/imd/events",
      events: ["model.deployed"],
      status: "active",
      secretPrefix: "whsec_F7m4K...",
      createdAt: new Date(now - 21 * 24 * 60 * 60 * 1000).toISOString(),
      lastDeliveryAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "webhook_security_archive",
      name: "Security archive",
      url: "https://audit.example.com/webhooks/imd",
      events: ["team.member_invited", "api_key.revoked"],
      status: "disabled",
      secretPrefix: "whsec_P3x8T...",
      createdAt: new Date(now - 73 * 24 * 60 * 60 * 1000).toISOString(),
      lastDeliveryAt: new Date(now - 13 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function generateWebhookDeliveries(webhooks: Webhook[]): WebhookDelivery[] {
  faker.seed(3402);

  const now = Date.now();

  return Array.from({ length: 18 }, (_, index) => {
    const webhook = faker.helpers.arrayElement(webhooks);
    const status = faker.helpers.arrayElement(["succeeded", "succeeded", "succeeded", "failed"]);
    const event = faker.helpers.arrayElement(webhook.events);
    const deliveredAt = new Date(now - index * 3 * 60 * 60 * 1000).toISOString();

    return {
      id: `webhook_delivery_${index + 1}`,
      webhookId: webhook.id,
      webhookName: webhook.name,
      event,
      url: webhook.url,
      status,
      responseCode: status === "succeeded" ? 200 : faker.helpers.arrayElement([400, 401, 500]),
      durationMs: faker.number.int({ min: 84, max: 2300 }),
      deliveredAt,
    };
  });
}

function createWebhook(input: { name?: string; url?: string; events?: WebhookEvent[] }): {
  webhook: Webhook;
  signingSecret: string;
} {
  faker.seed(Date.now());

  const signingSecret = createSigningSecret();
  const webhook: Webhook = {
    id: `webhook_${faker.string.uuid()}`,
    name: input.name?.trim() || "Untitled webhook",
    url: input.url?.trim() || "https://example.com/webhook",
    events: input.events?.length ? input.events : ["model.deployed"],
    status: "active",
    secretPrefix: createSecretPrefix(signingSecret),
    createdAt: new Date().toISOString(),
  };

  return { webhook, signingSecret };
}

export { createWebhook, generateWebhookDeliveries, generateWebhooks, webhookEvents };
