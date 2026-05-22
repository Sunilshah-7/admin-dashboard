import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { PermissionGuard } from "@/components/guards/permission-guard";
import { ROLE_PERMISSIONS, useAuthStore } from "@/stores/auth-store";

describe("PermissionGuard", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("shows children when role and permission match", () => {
    useAuthStore.getState().login({
      user: { email: "admin@imd.ai", id: "admin", name: "Platform Admin" },
      roles: ["admin"],
      permissions: ROLE_PERMISSIONS.admin,
    });

    render(
      <PermissionGuard permissions={["settings:manage"]} roles={["admin"]}>
        <button type="button">Manage billing</button>
      </PermissionGuard>,
    );

    expect(screen.getByRole("button", { name: "Manage billing" })).toBeInTheDocument();
  });

  it("renders fallback when access is denied", () => {
    useAuthStore.getState().setSessionRole("viewer");

    render(
      <PermissionGuard fallback={<p>Hidden</p>} permissions={["teams:write"]}>
        <button type="button">Invite member</button>
      </PermissionGuard>,
    );

    expect(screen.queryByRole("button", { name: "Invite member" })).not.toBeInTheDocument();
    expect(screen.getByText("Hidden")).toBeInTheDocument();
  });
});
