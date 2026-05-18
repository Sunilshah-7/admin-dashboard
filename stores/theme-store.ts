import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeState = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  setResolvedTheme: (theme: ResolvedTheme) => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      resolvedTheme: "light",
      setPreference: (preference) => set({ preference }),
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    }),
    {
      name: "reflection-theme",
      partialize: ({ preference }) => ({ preference }),
    },
  ),
);

export { useThemeStore };
export type { ResolvedTheme, ThemePreference };
