import { faker } from "@faker-js/faker";

import { generateTeamMembers } from "@/mocks/data/teams";
import type { AuditAction, AuditLogEntry } from "@/types/api";

const ACTIONS: AuditAction[] = [
  "auth.login",
  "auth.logout",
  "team.invite",
  "team.role_changed",
  "model.created",
  "model.deployed",
  "deployment.started",
  "deployment.failed",
  "settings.updated",
  "api_key.created",
  "api_key.revoked",
];

const RESOURCE_BY_ACTION: Record<AuditAction, AuditLogEntry["resourceType"]> = {
  "auth.login": "auth",
  "auth.logout": "auth",
  "team.invite": "team",
  "team.role_changed": "team",
  "model.created": "model",
  "model.deployed": "model",
  "deployment.started": "deployment",
  "deployment.failed": "deployment",
  "settings.updated": "settings",
  "api_key.created": "api_key",
  "api_key.revoked": "api_key",
};

function generateAuditLogs(count = 64): AuditLogEntry[] {
  faker.seed(2505);

  const team = generateTeamMembers(10);

  return Array.from({ length: count }, (_, index) => {
    const actor = faker.helpers.arrayElement(team);
    const action = faker.helpers.arrayElement(ACTIONS);
    const resourceType = RESOURCE_BY_ACTION[action];

    return {
      id: `audit_${index + 1}`,
      timestamp: faker.date.recent({ days: 45 }).toISOString(),
      actorId: actor.id,
      actorName: actor.name,
      action,
      resourceType,
      resourceId:
        resourceType === "auth" ? undefined : `${resourceType}_${faker.string.alphanumeric(8)}`,
      ipAddress: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
      metadata: {
        workspace: "reflection-prod",
        region: faker.helpers.arrayElement(["us-east-1", "us-west-2", "eu-west-1"]),
      },
    };
  }).sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

export { generateAuditLogs };
