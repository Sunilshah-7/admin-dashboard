import { faker } from "@faker-js/faker";

import { ROLE_PERMISSIONS } from "@/lib/permissions";
import type { Role, TeamMember } from "@/types/api";

const ROLES: Role[] = ["admin", "engineer", "viewer"];

function generateTeamMembers(count = 12): TeamMember[] {
  faker.seed(2404);

  return Array.from({ length: count }, (_, index) => {
    const role = index === 0 ? "admin" : faker.helpers.arrayElement(ROLES);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const status = faker.helpers.arrayElement([
      "active",
      "active",
      "active",
      "invited",
      "disabled",
    ]);

    return {
      id: `team_member_${index + 1}`,
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName, provider: "reflection.ai" }).toLowerCase(),
      avatarUrl: faker.image.avatar(),
      role,
      permissions: ROLE_PERMISSIONS[role],
      status,
      lastActiveAt: status === "active" ? faker.date.recent({ days: 14 }).toISOString() : undefined,
      createdAt: faker.date.past({ years: 2 }).toISOString(),
    };
  });
}

function getRolePermissions(role: Role) {
  return ROLE_PERMISSIONS[role];
}

export { generateTeamMembers, getRolePermissions };
