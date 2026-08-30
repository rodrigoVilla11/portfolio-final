"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  localePath,
  messages,
  resolveKey,
  type Locale,
} from "@/lib/i18n";

// El idioma lo define la URL (app/(site)/[locale]); este provider solo expone
// los mensajes de ese idioma. La preferencia que antes se guardaba en
// localStorage ya no se lee: se elimina en la primera visita.
const LEGACY_STORAGE_KEY = "portfolio-lang";

type I18nContextValue = {
  lang: Locale;
  /** Mensaje por clave "a.b.c"; devuelve la clave si no existe. */
  t: (key: string) => string;
  /** Para valores que son arrays de strings (p. ej. bullets). [] si no existe. */
  tList: (key: string) => string[];
  /** Prefija una ruta interna con el idioma actual ("/projects" → "/es/projects"). */
  localeHref: (path: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  useEffect(() => {
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const value = resolveKey(messages[lang], key);
      return typeof value === "string" ? value : key;
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

  const localeHref = useCallback(
    (path: string) => localePath(lang, path),
    [lang],
  );

  const value = useMemo(
    () => ({ lang, t, tList, localeHref }),
    [lang, t, tList, localeHref],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n debe usarse dentro de I18nProvider");
  }
  return ctx;
}
