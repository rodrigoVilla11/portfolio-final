"use client";

import Link from "next/link";
import { useI18n } from "@/app/providers/I18nProvider";
import { projects } from "@/app/data/projects";
import { OpenSource } from "@/app/components/OpenSource";

export default function ProjectsClient() {
  const { t, localeHref } = useI18n();

  return (
    <main id="main" tabIndex={-1} className="min-h-screen outline-none">
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-10 space-y-16 md:space-y-20">
        {/* HEADER */}
        <section className="space-y-4 animate-[fadein_.6s_ease-out]">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {t("projectsPage.badge")}
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            {t("projectsPage.title")}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            {t("projectsPage.subtitle")}
          </p>
        </section>

        {/* PROJECT LIST */}
        <section className="grid gap-5 sm:grid-cols-2">
          {projects
            .filter((p) => p.listed !== false)
            .map((p, idx) => (
            <article
              key={p.slug}
              className={`
                rounded-3xl border
                border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900/80
                shadow-sm
                hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)]
                hover:-translate-y-px
                transition-all duration-300
                p-5
                space-y-3
                ${idx === 0 ? "animate-[fadein_.6s_ease-out]" : ""}
              `}
            >
              {/* BADGE / CATEGORY (si lo tenés) */}
              {p.tags?.[0] ? (
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  {p.tags[0]}
                </p>
              ) : null}
              <h2 className="text-lg font-semibold">{t(p.titleKey)}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t(p.shortKey)}
              </p>

              {/* STACK / TAGS */}
              <div className="flex flex-wrap gap-2 text-xs pt-2">
                {(p.tags || []).slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* LINK */}
              <div className="pt-3">
                <Link
                  href={localeHref(`/projects/${p.slug}`)}
                  className="
                    inline-flex items-center gap-2
                    text-sm font-medium
                    text-indigo-600 dark:text-indigo-400
                    underline underline-offset-4
                    hover:opacity-80 transition-opacity
                  "
                >
                  {t("projectsPage.viewDetail")} <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* OPEN SOURCE */}
        <section>
          <OpenSource />
        </section>

        {/* CTA */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("projectsPage.ctaTitle")}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t("projectsPage.ctaText")}
          </p>

          <Link
            href={localeHref("/#contact")}
            className="
              inline-flex items-center
              px-5 py-2.5 rounded-full
              bg-indigo-600 text-white
              dark:bg-indigo-500
              hover:bg-indigo-700 dark:hover:bg-indigo-600
              hover:scale-[1.03] active:scale-[0.98]
              transition-all text-sm
            "
          >
            {t("projectsPage.ctaButton")}
          </Link>
        </section>
      </div>
    </main>
  );
}
