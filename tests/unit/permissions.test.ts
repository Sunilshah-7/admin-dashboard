import { describe, expect, it } from "vitest";

import {
  canAccessRole,
  getRolePermissions,
  hasPermission,
  ROLE_PERMISSIONS,
} from "@/lib/permissions";

describe("permissions", () => {
  it("assigns admin-only integration and settings permissions", () => {
    expect(ROLE_PERMISSIONS.admin).toContain("integrations:manage");
    expect(ROLE_PERMISSIONS.admin).toContain("settings:manage");
    expect(ROLE_PERMISSIONS.engineer).not.toContain("settings:manage");
    expect(ROLE_PERMISSIONS.viewer).not.toContain("models:write");
  });

  it("checks roles and permissions", () => {
    expect(getRolePermissions("engineer")).toContain("deployments:write");
    expect(hasPermission(["models:read"], "models:read")).toBe(true);
    expect(canAccessRole(["viewer"], ["admin", "engineer"])).toBe(false);
  });
});
