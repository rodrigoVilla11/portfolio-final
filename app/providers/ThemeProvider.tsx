"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;                 // preferencia guardada: light | dark | system
  resolvedTheme: ResolvedTheme; // lo que realmente está aplicado
  setTheme: (theme: Theme) => void;
  mounted: boolean;             // para que el UI sepa si ya sincronizamos
};

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

const THEME_STORAGE_KEY = "portfolio-theme";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Leer tema guardado al inicio
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        THEME_STORAGE_KEY,
      ) as Theme | null;
      if (
        stored === "light" ||
        stored === "dark" ||
        stored === "system"
      ) {
        setThemeState(stored);
      }
    } catch {
      // ignore
    } finally {
      setMounted(true);
    }
  }, []);

  const getSystemPrefersDark = () => {
    if (typeof window === "undefined") return false;
    return window
      .matchMedia("(prefers-color-scheme: dark)")
      .matches;
  };

  // Escuchar cambios del sistema cuando el tema es "system"
  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    if (!media) return;

    const handler = () => {
      if (theme === "system") {
        const prefersDark = media.matches;
        setResolvedTheme(prefersDark ? "dark" : "light");
        const root = document.documentElement;
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  // Aplicar clase `dark` cuando cambie theme
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const prefersDark = getSystemPrefersDark();

    const shouldUseDark =
      theme === "dark" || (theme === "system" && prefersDark);

    setResolvedTheme(shouldUseDark ? "dark" : "light");

    if (shouldUseDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      // ignore
    }
  };

  // 🔴 IMPORTANTE: SIEMPRE devolvemos el Provider, aunque mounted sea false
  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, mounted }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return ctx;
}
