"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import es from "../translate/es.json";
import en from "../translate/en.json";

type Lang = "es" | "en";

// 👇 ahora admite strings u objetos anidados
type Messages = { [key: string]: any };
type AllMessages = Record<Lang, Messages>;

const I18N_STORAGE_KEY = "portfolio-lang";

const messages: AllMessages = {
  es: es as Messages,
  en: en as Messages,
};

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(
  undefined,
);

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        I18N_STORAGE_KEY,
      ) as Lang | null;
      if (stored === "es" || stored === "en") {
        setLangState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(I18N_STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    const byLang = messages[lang];
    const parts = key.split(".");

    let value: any = byLang;

    for (const p of parts) {
      if (value && typeof value === "object" && p in value) {
        value = value[p];
      } else {
        return key; // fallback si no existe
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
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
