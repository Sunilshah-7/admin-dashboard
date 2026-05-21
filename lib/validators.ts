import { z } from "zod";

const roleSchema = z.enum(["admin", "engineer", "viewer"]);

const inviteMemberSchema = z.object({
  email: z.email("Enter a valid email address."),
  role: roleSchema,
  workspace: z.string().min(1, "Select a workspace."),
});

const apiKeySchema = z.object({
  environment: z.enum(["development", "staging", "production"]),
  name: z.string().min(3, "Name must be at least 3 characters."),
  scopes: z
    .array(z.enum(["models:read", "models:write", "deployments:write", "metrics:read"]))
    .min(1, "Select at least one scope."),
});

const webhookSchema = z.object({
  events: z.array(z.string()).min(1, "Select at least one event."),
  name: z.string().min(3, "Name must be at least 3 characters."),
  secret: z.string().min(12, "Secret must be at least 12 characters."),
  url: z.url("Enter a valid HTTPS URL.").startsWith("https://", "Webhook URL must use HTTPS."),
});

const playgroundPromptSchema = z.object({
  maxTokens: z.number().int().min(128).max(4096),
  prompt: z.string().min(1, "Enter a prompt."),
  systemPrompt: z.string().min(1, "Enter a system prompt."),
  temperature: z.number().min(0).max(1),
  topP: z.number().min(0.1).max(1),
});

export { apiKeySchema, inviteMemberSchema, playgroundPromptSchema, roleSchema, webhookSchema };
