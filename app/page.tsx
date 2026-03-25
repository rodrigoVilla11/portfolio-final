"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "./providers/I18nProvider";
import { useTheme } from "./providers/ThemeProvider";
import { projects } from "./data/projects";

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
            {/* AVAILABILITY BADGE */}
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("hero.available")}
              </span>
            </div>

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
                  bg-indigo-600 text-white
                  dark:bg-indigo-500
                  hover:bg-indigo-700 dark:hover:bg-indigo-600
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

              <a
                href="/cv.pdf"
                download
                className="
                  inline-flex items-center
                  px-5 py-2.5 rounded-full
                  text-sm font-medium
                  border border-indigo-500 dark:border-indigo-400
                  text-indigo-600 dark:text-indigo-400
                  hover:bg-indigo-50 dark:hover:bg-indigo-950/30
                  transition-colors
                "
              >
                {t("hero.cvDownload")}
              </a>
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
          <aside className="md:justify-self-end space-y-4">
            <div className="flex justify-center md:justify-end">
              <div className="p-0.75 rounded-full bg-indigo-700">
                <div className="p-0.75 rounded-full bg-white dark:bg-slate-950">
                  <div className="relative w-52 h-52 sm:w-52 sm:h-52 rounded-full overflow-hidden">
                    <Image
                      src="https://res.cloudinary.com/db7kbwl5n/image/upload/v1774464913/WhatsApp_Image_2026-01-27_at_6.59.26_PM_iiarn8.jpg"
                      alt="Rodrigo Villarreal"
                      fill
                      className="object-cover object-[center_30%]"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="
                rounded-3xl
                border border-indigo-200 dark:border-indigo-900/60
                bg-white dark:bg-slate-900/80
                shadow-[0_4px_20px_-5px_rgba(99,102,241,0.12)]
                dark:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2)]
                p-5
                space-y-4
              "
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-400">
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

        {/* LOOKING FOR */}
        <section id="looking-for" className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {t("lookingFor.title")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            {t("lookingFor.text")}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400">
                {t("lookingFor.item1label")}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("lookingFor.item1text")}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400">
                {t("lookingFor.item2label")}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("lookingFor.item2text")}
              </p>
            </div>
          </div>
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article
                key={p.slug}
                className="
                  rounded-2xl border
                  border-slate-200 dark:border-slate-800
                  bg-white dark:bg-slate-900/80
                  shadow-sm
                  hover:shadow-[0_12px_40px_-12px_rgba(99,102,241,0.2)]
                  hover:-translate-y-px
                  transition-all duration-300
                  p-4
                  space-y-2
                "
              >
                <h3 className="text-sm font-semibold">{t(p.titleKey)}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t(p.shortKey)}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {p.stack.slice(0, 3).join(" · ")}
                </p>
                <Link
                  href={`/projects/${p.slug}`}
                  className="inline-block text-xs text-indigo-600 dark:text-indigo-400 underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {t("projectsPage.viewDetail")} →
                </Link>
              </article>
            ))}
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
              href="mailto:info@villarraelrodrigo.com"
              className="
                inline-flex items-center
                px-5 py-2.5 rounded-full
                bg-indigo-600 text-white
                dark:bg-indigo-500
                hover:bg-indigo-700 dark:hover:bg-indigo-600
                hover:scale-[1.03] active:scale-[0.98]
                transition-all
              "
            >
              {t("contact.cta")}
            </a>
            <a
              href="https://www.linkedin.com/in/rodrigonicolasvillarreal/"
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
              href="https://github.com/rodrigoVilla11"
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
