"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Activity,
  Bell,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Gauge,
  GitBranch,
  KeyRound,
  LogOut,
  Menu,
  Moon,
  Play,
  Search,
  Settings,
  Sun,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuthStore, type Role } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { useUiStore } from "@/stores/ui-store";

type NavigationItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
};

const navigationItems: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge, roles: ["admin", "engineer", "viewer"] },
  { href: "/models", label: "Models", icon: Cpu, roles: ["admin", "engineer", "viewer"] },
  { href: "/deployments", label: "Deployments", icon: GitBranch, roles: ["admin", "engineer"] },
  { href: "/teams", label: "Teams", icon: Users, roles: ["admin"] },
  {
    href: "/monitoring",
    label: "Monitoring",
    icon: Activity,
    roles: ["admin", "engineer", "viewer"],
  },
  { href: "/playground", label: "Playground", icon: Play, roles: ["engineer"] },
  { href: "/integrations", label: "Integrations", icon: KeyRound, roles: ["admin"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["admin"] },
];

const roleLabels: Record<Role, string> = {
  admin: "Admin",
  engineer: "Engineer",
  viewer: "Viewer",
};

function getActiveRole(roles: Role[]): Role {
  return roles[0] ?? "admin";
}

function getVisibleNavigationItems(role: Role) {
  return navigationItems.filter((item) => item.roles.includes(role));
}

function canAccessPath(pathname: string, role: Role) {
  if (pathname === "/" || pathname === "/dashboard") {
    return true;
  }

  const matchedItem = navigationItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  if (!matchedItem) {
    return false;
  }

  return matchedItem.roles.includes(role);
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const storedTheme = useThemeStore((state) => state.resolvedTheme);
  const setPreference = useThemeStore((state) => state.setPreference);
  const isDark = (resolvedTheme ?? storedTheme) === "dark";

  function handleToggleTheme() {
    const nextTheme = isDark ? "light" : "dark";

    setPreference(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={handleToggleTheme}
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}

function SidebarContent({
  brand,
  brandCollapsed,
  collapsed = false,
  onNavigate,
}: {
  brand?: React.ReactNode;
  brandCollapsed?: React.ReactNode;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const role = useAuthStore((state) => getActiveRole(state.roles));
  const visibleNavigationItems = getVisibleNavigationItems(role);
  const navRef = React.useRef<HTMLElement>(null);

  function handleSidebarKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      return;
    }

    const links = Array.from(navRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    const activeIndex = links.findIndex((link) => link === document.activeElement);

    if (!links.length) {
      return;
    }

    event.preventDefault();

    if (event.key === "Home") {
      links[0]?.focus();
      return;
    }

    if (event.key === "End") {
      links.at(-1)?.focus();
      return;
    }

    const nextIndex =
      event.key === "ArrowDown"
        ? (activeIndex + 1) % links.length
        : (activeIndex - 1 + links.length) % links.length;

    links[nextIndex]?.focus();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-4">{collapsed ? brandCollapsed : brand}</div>
      <Separator />
      <nav
        ref={navRef}
        aria-label="Primary navigation"
        className="flex-1 space-y-1 p-2"
        onKeyDown={handleSidebarKeyDown}
      >
        {visibleNavigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              aria-current={isActive ? "page" : undefined}
              href={item.href}
              prefetch
              onClick={onNavigate}
              className={cn(
                "flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <div
          className={cn(
            "rounded-lg border bg-sidebar-accent/60 p-3",
            collapsed && "flex justify-center p-2",
          )}
        >
          <Avatar className="size-8">
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
          {!collapsed ? (
            <div className="mt-3">
              <div className="text-sm font-medium">Platform Admin</div>
              <div className="text-xs text-muted-foreground">admin@reflection.ai</div>
              <div className="mt-2 text-xs font-medium text-primary">{roleLabels[role]}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Topbar({
  brand,
  brandCollapsed,
  collapsed,
  onToggleCollapsed,
}: {
  brand?: React.ReactNode;
  brandCollapsed?: React.ReactNode;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const mobileOpen = useUiStore((state) => state.isMobileSidebarOpen);
  const setMobileOpen = useUiStore((state) => state.setMobileSidebarOpen);
  const role = useAuthStore((state) => getActiveRole(state.roles));
  const setSessionRole = useAuthStore((state) => state.setSessionRole);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Dashboard navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent
            brand={brand}
            brandCollapsed={brandCollapsed}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hidden lg:inline-flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleCollapsed}
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </Button>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-muted-foreground">AI Infrastructure</div>
        <h1 className="truncate text-base font-semibold">Operations Dashboard</h1>
      </div>

      <div className="hidden h-9 w-64 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground md:flex">
        <Search className="size-4" />
        <span>Search models, teams, logs</span>
      </div>

      <div className="hidden items-center gap-1 rounded-md border bg-muted/40 p-1 md:flex">
        {(["admin", "engineer", "viewer"] satisfies Role[]).map((item) => (
          <Button
            key={item}
            aria-label={`Switch to ${roleLabels[item]} role`}
            aria-pressed={role === item}
            type="button"
            size="xs"
            variant={role === item ? "secondary" : "ghost"}
            onClick={() => setSessionRole(item)}
          >
            {roleLabels[item]}
          </Button>
        ))}
      </div>

      <ThemeToggle />
      <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Sign out"
        onClick={() => logout()}
      >
        <LogOut className="size-4" />
      </Button>
    </header>
  );
}

function DashboardShell({
  brand,
  brandCollapsed,
  children,
}: {
  brand?: React.ReactNode;
  brandCollapsed?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const collapsed = useUiStore((state) => state.isSidebarCollapsed);
  const toggleCollapsed = useUiStore((state) => state.toggleSidebarCollapsed);
  const role = useAuthStore((state) => getActiveRole(state.roles));
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    if (!canAccessPath(pathname, role)) {
      router.replace("/dashboard");
    }
  }, [pathname, role, router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:block",
          collapsed ? "w-16" : "w-72",
        )}
      >
        <SidebarContent brand={brand} brandCollapsed={brandCollapsed} collapsed={collapsed} />
      </aside>
      <div
        className={cn(
          "min-h-screen transition-[padding] duration-200",
          collapsed ? "lg:pl-16" : "lg:pl-72",
        )}
      >
        <Topbar
          brand={brand}
          brandCollapsed={brandCollapsed}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
        />
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export { DashboardShell };
