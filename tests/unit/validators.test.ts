import { describe, expect, it } from "vitest";

import {
  apiKeySchema,
  inviteMemberSchema,
  playgroundPromptSchema,
  webhookSchema,
} from "@/lib/validators";

describe("validators", () => {
  it("validates team invitations", () => {
    expect(
      inviteMemberSchema.safeParse({
        email: "teammate@imd.ai",
        role: "engineer",
        workspace: "Production AI",
      }).success,
    ).toBe(true);

    expect(
      inviteMemberSchema.safeParse({ email: "bad", role: "viewer", workspace: "" }).success,
    ).toBe(false);
  });

  it("validates integration and playground payloads", () => {
    expect(
      apiKeySchema.safeParse({
        environment: "production",
        name: "CI deploy",
        scopes: ["models:read"],
      }).success,
    ).toBe(true);

    expect(
      webhookSchema.safeParse({
        events: ["model.deployed"],
        name: "Deploy hooks",
        secret: "super-secret-value",
        url: "http://example.com/webhook",
      }).success,
    ).toBe(false);

    expect(
      playgroundPromptSchema.safeParse({
        maxTokens: 1024,
        prompt: "Summarize cluster health",
        systemPrompt: "Be concise.",
        temperature: 0.4,
        topP: 0.9,
      }).success,
    ).toBe(true);
  });
});
