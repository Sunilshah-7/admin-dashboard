import { beforeEach, describe, expect, it } from "vitest";

import { ROLE_PERMISSIONS, useAuthStore } from "@/stores/auth-store";

describe("auth store", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("logs users in and out", () => {
    useAuthStore.getState().login({
      user: { email: "admin@reflection.ai", id: "admin", name: "Platform Admin" },
      roles: ["admin"],
      permissions: ROLE_PERMISSIONS.admin,
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().hasRole("admin")).toBe(true);
    expect(useAuthStore.getState().hasPermission("settings:manage")).toBe(true);

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("switches session role with matching permissions", () => {
    useAuthStore.getState().setSessionRole("engineer");

    expect(useAuthStore.getState().roles).toEqual(["engineer"]);
    expect(useAuthStore.getState().permissions).toEqual(ROLE_PERMISSIONS.engineer);
    expect(useAuthStore.getState().hasPermission("models:write")).toBe(true);
    expect(useAuthStore.getState().hasPermission("teams:write")).toBe(false);
  });
});
