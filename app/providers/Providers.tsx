"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { ThemeProvider } from "./ThemeProvider";
import { UIProvider } from "./UIProvider";
import { I18nProvider } from "./I18nProvider";

type ProvidersProps = {
  /** Idioma de la ruta actual (lo fija el layout de app/(site)/[locale]). */
  lang: Locale;
  children: ReactNode;
};

export function Providers({ lang, children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <UIProvider>
        <I18nProvider lang={lang}>{children}</I18nProvider>
      </UIProvider>
    </ThemeProvider>
  );
}
