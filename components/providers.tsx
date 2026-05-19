"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider, useTheme } from "next-themes";

import { MswProvider } from "@/components/msw-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createQueryClient } from "@/lib/query-client";
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
  const [queryClient] = React.useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <ThemeStoreSync />
          <MswProvider>{children}</MswProvider>
          <Toaster richColors closeButton />
        </TooltipProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === "development" ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}

export { Providers };
