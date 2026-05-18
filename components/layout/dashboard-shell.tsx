"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";
import { useUiStore } from "@/stores/ui-store";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/models", label: "Models", icon: Cpu },
  { href: "/deployments", label: "Deployments", icon: GitBranch },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/integrations", label: "Integrations", icon: KeyRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

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
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function SidebarContent({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Reflection AI</div>
            <div className="truncate text-xs text-muted-foreground">Infrastructure Console</div>
          </div>
        ) : null}
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
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
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Topbar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const mobileOpen = useUiStore((state) => state.isMobileSidebarOpen);
  const setMobileOpen = useUiStore((state) => state.setMobileSidebarOpen);

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
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
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

      <ThemeToggle />
      <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="size-4" />
      </Button>
    </header>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const collapsed = useUiStore((state) => state.isSidebarCollapsed);
  const toggleCollapsed = useUiStore((state) => state.toggleSidebarCollapsed);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:block",
          collapsed ? "w-16" : "w-72",
        )}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>
      <div
        className={cn(
          "min-h-screen transition-[padding] duration-200",
          collapsed ? "lg:pl-16" : "lg:pl-72",
        )}
      >
        <Topbar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export { DashboardShell };
