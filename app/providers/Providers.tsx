"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { UIProvider } from "./UIProvider";
import { I18nProvider } from "./I18nProvider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <UIProvider>
        <I18nProvider>{children}</I18nProvider>
      </UIProvider>
    </ThemeProvider>
  );
}
