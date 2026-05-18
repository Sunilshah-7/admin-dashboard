"use client";

import * as React from "react";
import { ThemeProvider, useTheme } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThemeStore, type ResolvedTheme, type ThemePreference } from "@/stores/theme-store";

function ThemeStoreSync() {
  const { resolvedTheme, theme } = useTheme();
  const setPreference = useThemeStore((state) => state.setPreference);
  const setResolvedTheme = useThemeStore((state) => state.setResolvedTheme);

  React.useEffect(() => {
    if (theme === "light" || theme === "dark" || theme === "system") {
      setPreference(theme as ThemePreference);
    }
  }, [setPreference, theme]);

  React.useEffect(() => {
    if (resolvedTheme === "light" || resolvedTheme === "dark") {
      setResolvedTheme(resolvedTheme as ResolvedTheme);
    }
  }, [resolvedTheme, setResolvedTheme]);

  return null;
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <ThemeStoreSync />
        {children}
        <Toaster richColors closeButton />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export { Providers };
