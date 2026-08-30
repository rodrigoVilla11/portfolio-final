"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useI18n } from "@/app/providers/I18nProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useUI } from "@/app/providers/UIProvider";
import { LOCALES, localePath, stripLocale } from "@/lib/i18n";

const NAV_LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/projects", key: "nav.projects" },
  { href: "/contact", key: "nav.contact" },
];

const THEME_LABEL_KEY = {
  light: "nav.themeLight",
  dark: "nav.themeDark",
  system: "nav.themeSystem",
} as const;

const FOCUSABLE = 'a[href], button:not([disabled])';

export default function Navbar() {
  const pathname = usePathname();
  const { t, lang, localeHref } = useI18n();
  const { theme, setTheme } = useTheme();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUI();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Ruta sin prefijo de idioma: sirve para marcar el link activo y para que el
  // switch de idioma lleve a la misma página en el otro idioma.
  const { path: currentPath } = stripLocale(pathname);

  // Menú móvil: Escape cierra; al abrir, el foco va al botón de cerrar; al
  // cerrar, vuelve al botón que lo abrió.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const toggle = toggleRef.current;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Tab/Shift+Tab no salen del panel mientras está abierto.
  const trapFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* NAVBAR */}
      <header
        className="
          sticky top-0 z-50
          border-b border-slate-200 dark:border-slate-800
          bg-white/80 dark:bg-slate-900/80
          backdrop-blur
          shadow-[0_1px_8px_rgba(0,0,0,0.04)]
          dark:shadow-[0_1px_12px_rgba(0,0,0,0.4)]
        "
      >
        <nav
          aria-label={t("nav.menu")}
          className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between"
        >
          {/* LEFT - LOGO / NAME */}
          <Link
            href={localeHref("/")}
            className="font-semibold tracking-tight text-lg hover:opacity-90 transition-opacity rounded"
          >
            Rodrigo Villarreal
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* LINKS — DESKTOP */}
            <div className="hidden md:flex gap-6 text-sm font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={localeHref(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`
                    transition-colors rounded
                    ${
                      isActive(link.href)
                        ? "text-indigo-600 dark:text-indigo-400 underline underline-offset-4"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50"
                    }
                  `}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>

            {/* LANGUAGE SWITCH: enlaces a la misma ruta en el otro idioma */}
            <div
              role="group"
              aria-label={t("nav.language")}
              className="flex items-center gap-1 text-xs"
            >
              {LOCALES.map((locale) => (
                <Link
                  key={locale}
                  href={localePath(locale, currentPath)}
                  hrefLang={locale}
                  lang={locale}
                  aria-current={lang === locale ? "true" : undefined}
                  className={`px-2 py-1 rounded transition-all ${
                    lang === locale
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  }`}
                >
                  {locale.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* THEME TOGGLE */}
            <button
              type="button"
              onClick={cycleTheme}
              className="
                px-3 py-1.5 rounded-full text-xs
                border border-slate-300 dark:border-slate-700
                hover:bg-slate-100/70 dark:hover:bg-slate-800/70
                transition-all
              "
              aria-label={`${t("nav.themeToggle")} (${t(THEME_LABEL_KEY[theme])})`}
            >
              <span aria-hidden>
                {theme === "system" ? "🖥" : theme === "dark" ? "🌙" : "☀️"}
              </span>
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              ref={toggleRef}
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="
                md:hidden px-3 py-2 rounded
                border border-slate-300 dark:border-slate-700
                hover:bg-slate-100/70 dark:hover:bg-slate-800/70
                transition-colors
              "
              aria-label={t("nav.openMenu")}
            >
              <span aria-hidden>☰</span>
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeMobileMenu}
        >
          <div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={trapFocus}
            className="
              w-64 h-full
              bg-white dark:bg-slate-900
              shadow-xl
              p-6
              flex flex-col
              transform translate-x-0
              transition-transform duration-300
            "
          >
            <div className="flex items-center justify-between mb-6">
              <p className="font-semibold">{t("nav.menu")}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={closeMobileMenu}
                aria-label={t("nav.closeMenu")}
                className="text-lg rounded px-1"
              >
                <span aria-hidden>✕</span>
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={localeHref(link.href)}
                  onClick={closeMobileMenu}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`
                    rounded
                    ${
                      isActive(link.href)
                        ? "text-indigo-600 dark:text-indigo-400 underline underline-offset-4"
                        : "text-slate-600 dark:text-slate-300"
                    }
                  `}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
