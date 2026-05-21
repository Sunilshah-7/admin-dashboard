"use client";

import type { ReactNode } from "react";

import { useAuthStore, type Permission, type Role } from "@/stores/auth-store";

type PermissionGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  permissions?: Permission[];
  roles?: Role[];
  requireAll?: boolean;
};

function PermissionGuard({
  children,
  fallback = null,
  permissions = [],
  roles = [],
  requireAll = false,
}: PermissionGuardProps) {
  const userPermissions = useAuthStore((state) => state.permissions);
  const userRoles = useAuthStore((state) => state.roles);

  const hasRequiredRole = !roles.length || roles.some((role) => userRoles.includes(role));
  const hasRequiredPermissions =
    !permissions.length ||
    (requireAll
      ? permissions.every((permission) => userPermissions.includes(permission))
      : permissions.some((permission) => userPermissions.includes(permission)));

  if (!hasRequiredRole || !hasRequiredPermissions) {
    return fallback;
  }

  return children;
}

export { PermissionGuard };
export type { PermissionGuardProps };
