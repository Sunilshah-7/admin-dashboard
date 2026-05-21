import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ROLE_PERMISSIONS } from "@/lib/permissions";
import type { Permission, Role } from "@/types/api";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type LoginPayload = {
  user: AuthUser;
  roles: Role[];
  permissions: Permission[];
};

type AuthState = {
  user: AuthUser | null;
  roles: Role[];
  permissions: Permission[];
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => void;
  logout: () => void;
  setSessionRole: (role: Role) => void;
  hasRole: (role: Role) => boolean;
  hasPermission: (permission: Permission) => boolean;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      roles: [],
      permissions: [],
      isAuthenticated: false,
      login: ({ user, roles, permissions }) =>
        set({
          user,
          roles,
          permissions,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          roles: [],
          permissions: [],
          isAuthenticated: false,
        }),
      setSessionRole: (role) =>
        set((state) => ({
          user: state.user ?? {
            id: "user_admin",
            name: "Platform Admin",
            email: "admin@reflection.ai",
          },
          roles: [role],
          permissions: ROLE_PERMISSIONS[role],
          isAuthenticated: true,
        })),
      hasRole: (role) => get().roles.includes(role),
      hasPermission: (permission) => get().permissions.includes(permission),
    }),
    {
      name: "reflection-auth",
      partialize: ({ user, roles, permissions, isAuthenticated }) => ({
        user,
        roles,
        permissions,
        isAuthenticated,
      }),
    },
  ),
);

export { useAuthStore };
export { ROLE_PERMISSIONS };
export type { AuthUser, LoginPayload, Permission, Role };
