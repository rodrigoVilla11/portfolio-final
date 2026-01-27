"use client";

import Link from "next/link";
import { useI18n } from "./providers/I18nProvider";
import { useTheme } from "./providers/ThemeProvider";

export default function HomePage() {
  const { t } = useI18n();
  const { resolvedTheme } = useTheme();

  return (
    <main className="min-h-screen">
      <div
        className="
          max-w-5xl mx-auto px-4
          pb-16 pt-10
          space-y-24 md:space-y-28
        "
      >
        {/* HERO */}
        <section
          className="
            pt-6
            grid gap-10
            md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]
            items-center
            animate-[fadein_.6s_ease-out]
          "
        >
          {/* LEFT HERO TEXT */}
          <div className="space-y-6">
            <p
              className="
                text-[11px] uppercase
                tracking-[0.3em]
                text-slate-500 dark:text-slate-400
              "
            >
              {t("hero.badge")}
            </p>

            <div className="space-y-4">
              <h1
                className="
                  text-4xl sm:text-5xl md:text-6xl
                  font-bold tracking-tight
                  leading-tight
                "
              >
                {t("hero.title")}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {t("hero.subtitle")}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="#projects"
                className="
                  inline-flex items-center
                  px-5 py-2.5 rounded-full
                  text-sm font-medium
                  bg-slate-900 text-white
                  dark:bg-slate-100 dark:text-slate-900
                  hover:scale-[1.03] active:scale-[0.98]
                  transition-all
                "
              >
                {t("hero.ctaPrimary")}
              </Link>

              <Link
                href="#contact"
                className="
                  inline-flex items-center
                  px-5 py-2.5 rounded-full
                  text-sm font-medium
                  border border-slate-300 dark:border-slate-700
                  text-slate-700 dark:text-slate-200
                  hover:bg-slate-100/80 dark:hover:bg-slate-800/70
                  transition-colors
                "
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mt-4">
              <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Next.js · React
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                NestJS · Node
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                TypeScript · MongoDB
              </span>
            </div>
          </div>

          {/* RIGHT HERO CARD */}
          <aside className="md:justify-self-end">
            <div
              className="
                rounded-3xl
                border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900/80
                shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)]
                dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]
                p-5
                space-y-4
              "
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                {t("hero.highlightTitle")}
              </p>

              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <li>· {t("hero.highlight1")}</li>
                <li>· {t("hero.highlight2")}</li>
                <li>· {t("hero.highlight3")}</li>
              </ul>

              <p
                className="
                  text-[11px]
                  text-slate-500 dark:text-slate-400
                  pt-2
                  border-t border-dashed border-slate-200 dark:border-slate-800
                "
              >
                {t("hero.currentMode")}{" "}
                <span className="font-medium">
                  {resolvedTheme === "dark"
                    ? t("hero.modeDark")
                    : t("hero.modeLight")}
                </span>
              </p>
            </div>
          </aside>
        </section>

        {/* ABOUT */}
        <section id="about" className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {t("about.title")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            {t("about.text")}
          </p>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="space-y-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {t("projects.title")}
            </h2>
            <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              {t("projects.tagline")}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Proyecto 1 — DMA */}
            <article
              className="
                rounded-2xl border
                border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900/80
                shadow-sm
                hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)]
                hover:-translate-y-[1px]
                transition-all duration-300
                p-4
                space-y-2
              "
            >
              <h3 className="text-sm font-semibold">
                Distribuidora DMA · ERP / E-commerce
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {t("projects.dma")}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Next.js · NestJS · MongoDB · RTK Query
              </p>
            </article>

            {/* Proyecto 2 — Nõva Sushi */}
            <article
              className="
                rounded-2xl border
                border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900/80
                shadow-sm
                hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)]
                hover:-translate-y-[1px]
                transition-all duration-300
                p-4
                space-y-2
              "
            >
              <h3 className="text-sm font-semibold">
                Nõva Sushi · Gestión gastronómica
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {t("projects.nova")}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Next.js · Admin panel · Dashboards
              </p>
            </article>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {t("contact.title")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            {t("contact.text")}
          </p>

          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href="mailto:tu-mail-aqui@example.com"
              className="
                inline-flex items-center
                px-5 py-2.5 rounded-full
                bg-slate-900 text-white
                dark:bg-slate-100 dark:text-slate-900
                hover:scale-[1.03] active:scale-[0.98]
                transition-all
              "
            >
              {t("contact.cta")}
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex items-center
                px-5 py-2.5 rounded-full
                border border-slate-300 dark:border-slate-700
                hover:bg-slate-100/80 dark:hover:bg-slate-800/70
                transition-colors
              "
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex items-center
                px-5 py-2.5 rounded-full
                border border-slate-300 dark:border-slate-700
                hover:bg-slate-100/80 dark:hover:bg-slate-800/70
                transition-colors
              "
            >
              GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
