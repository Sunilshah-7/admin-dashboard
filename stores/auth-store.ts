import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "admin" | "engineer" | "viewer";

type Permission =
  | "dashboard:read"
  | "models:read"
  | "models:write"
  | "deployments:read"
  | "deployments:write"
  | "teams:read"
  | "teams:write"
  | "monitoring:read"
  | "integrations:manage"
  | "settings:manage";

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
export type { AuthUser, LoginPayload, Permission, Role };
