"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/providers/I18nProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useUI } from "@/app/providers/UIProvider";

const NAV_LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/projects", key: "nav.projects" },
  { href: "/contact", key: "nav.contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useI18n();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { isMobileMenuOpen, toggleMobileMenu } = useUI();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
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
        <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* LEFT - LOGO / NAME */}
          <Link
            href="/"
            className="font-semibold tracking-tight text-lg hover:opacity-90 transition-opacity"
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
                  href={link.href}
                  className={`
                    transition-colors
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

            {/* LANGUAGE SWITCH */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setLang("es")}
                className={`px-2 py-1 rounded transition-all ${
                  lang === "es"
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded transition-all ${
                  lang === "en"
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                }`}
              >
                EN
              </button>
            </div>

            {/* THEME TOGGLE */}
            <button
              onClick={cycleTheme}
              className="
                px-3 py-1.5 rounded-full text-xs
                border border-slate-300 dark:border-slate-700
                hover:bg-slate-100/70 dark:hover:bg-slate-800/70
                transition-all
              "
              aria-label="Cambiar tema"
            >
              {theme === "system"
                ? `🖥`
                : theme === "dark"
                ? "🌙"
                : "☀️"}
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={toggleMobileMenu}
              className="
                md:hidden px-3 py-2 rounded
                border border-slate-300 dark:border-slate-700
                hover:bg-slate-100/70 dark:hover:bg-slate-800/70
                transition-colors
              "
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={toggleMobileMenu}
        >
          <div
            onClick={(e) => e.stopPropagation()}
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
              <p className="font-semibold">Menú</p>
              <button
                onClick={toggleMobileMenu}
                aria-label="Cerrar menú"
                className="text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMobileMenu}
                  className={`
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
