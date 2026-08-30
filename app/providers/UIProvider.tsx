"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type UIContextValue = {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
};

const UIContext = createContext<UIContextValue | undefined>(undefined);

type UIProviderProps = {
  children: ReactNode;
};

export function UIProvider({ children }: UIProviderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((open) => !open),
    [],
  );

  return (
    <UIContext.Provider
      value={{
        isMobileMenuOpen,
        openMobileMenu,
        closeMobileMenu,
        toggleMobileMenu,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI debe usarse dentro de UIProvider");
  }
  return ctx;
}
