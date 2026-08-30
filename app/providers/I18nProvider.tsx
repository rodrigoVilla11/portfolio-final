"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import es from "../translate/es.json";
import en from "../translate/en.json";

type Lang = "es" | "en";
type Messages = Record<string, unknown>;
type AllMessages = Record<Lang, Messages>;

const I18N_STORAGE_KEY = "portfolio-lang";

const messages: AllMessages = {
  es: es as Messages,
  en: en as Messages,
};

// --- External store: the persisted language preference ---
// useSyncExternalStore keeps React in sync with localStorage without
// setState-in-effect and stays hydration-safe (server snapshot = "es").
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function readLang(): Lang {
  try {
    const v = window.localStorage.getItem(I18N_STORAGE_KEY);
    return v === "en" || v === "es" ? v : "es";
  } catch {
    return "es";
  }
}
function getServerSnapshot(): Lang {
  return "es";
}

// Resuelve "a.b.c" dentro del árbol de mensajes; undefined si no existe.
function resolveKey(root: unknown, key: string): unknown {
  let value: unknown = root;
  for (const p of key.split(".")) {
    if (
      value &&
      typeof value === "object" &&
      p in (value as Record<string, unknown>)
    ) {
      value = (value as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return value;
}

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  /** Para valores que son arrays de strings (p. ej. bullets). [] si no existe. */
  tList: (key: string) => string[];
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, getServerSnapshot);

  // Keep <html lang> in sync for accessibility / SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    try {
      window.localStorage.setItem(I18N_STORAGE_KEY, l);
    } catch {
      // ignore
    }
    emit();
  }, []);

  const t = useCallback(
    (key: string): string => {
      const value = resolveKey(messages[lang], key);
      return typeof value === "string" ? value : key; // fallback: la clave
    },
    [lang],
  );

  const tList = useCallback(
    (key: string): string[] => {
      const value = resolveKey(messages[lang], key);
      return Array.isArray(value)
        ? value.filter((v): v is string => typeof v === "string")
        : [];
    },
    [lang],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tList }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n debe usarse dentro de I18nProvider");
  }
  return ctx;
}
