"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "portfolio-theme";

// --- External store: the persisted theme preference ---
// A blocking script in <head> (see layout.tsx) sets the `.dark` class before
// paint to avoid FOUC; this store keeps React state in sync afterwards.
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function readTheme(): Theme {
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" || v === "system" ? v : "system";
  } catch {
    return "system";
  }
}

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function resolve(theme: Theme): ResolvedTheme {
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  return systemPrefersDark() ? "dark" : "light";
}

function subscribePref(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function subscribeResolved(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
    media.removeEventListener("change", cb);
  };
}

type ThemeContextValue = {
  theme: Theme; // preferencia guardada: light | dark | system
  resolvedTheme: ResolvedTheme; // lo que realmente está aplicado
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribePref,
    readTheme,
    () => "system" as Theme,
  );
  const resolvedTheme = useSyncExternalStore(
    subscribeResolved,
    () => resolve(readTheme()),
    () => "light" as ResolvedTheme,
  );

  // Apply the class to <html> whenever the resolved theme changes.
  // DOM side effect only — no setState, so no cascading renders.
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [resolvedTheme]);

  const setTheme = useCallback((t: Theme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      // ignore
    }
    emit();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
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
