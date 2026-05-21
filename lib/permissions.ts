import type { Permission, Role } from "@/types/api";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
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
  engineer: [
    "dashboard:read",
    "models:read",
    "models:write",
    "deployments:read",
    "deployments:write",
    "monitoring:read",
  ],
  viewer: ["dashboard:read", "models:read", "deployments:read", "monitoring:read"],
};

function getRolePermissions(role: Role) {
  return ROLE_PERMISSIONS[role];
}

function hasPermission(permissions: Permission[], permission: Permission) {
  return permissions.includes(permission);
}

function canAccessRole(roles: Role[], allowedRoles: Role[]) {
  return roles.some((role) => allowedRoles.includes(role));
}

export { ROLE_PERMISSIONS, canAccessRole, getRolePermissions, hasPermission };
