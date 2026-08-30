"use client";

import { useI18n } from "@/app/providers/I18nProvider";
import { education, experience } from "@/app/data/experience";

const CARD =
  "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80";
const OVERLINE =
  "text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400";

export function Experience() {
  const { t, tList } = useI18n();

  return (
    <section id="experience" className="space-y-8">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        {t("experience.title")}
      </h2>

      {/* EXPERIENCIA */}
      <div className="space-y-4">
        <h3 className={OVERLINE}>{t("experience.workTitle")}</h3>

        <ol className="space-y-4">
          {experience.map((item) => {
            const base = `experience.items.${item.id}`;
            const summary = t(`${base}.summary`);

            return (
              <li
                key={item.id}
                className={`${CARD} p-5 grid gap-3 md:grid-cols-[150px_minmax(0,1fr)]`}
              >
                <p className="text-xs text-slate-500 dark:text-slate-400 md:pt-1">
                  {t(`${base}.period`)}
                </p>

                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <p className="font-semibold">{t(`${base}.role`)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {t(`${base}.org`)}
                      {item.link ? (
                        <>
                          {" · "}
                          <a
                            href={item.link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 hover:opacity-80 transition-opacity"
                          >
                            {item.link.label}
                            <span aria-hidden> ↗</span>
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>

                  {summary ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {summary}
                    </p>
                  ) : null}

                  <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                    {tList(`${base}.b`).map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-0.5 text-slate-400">—</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* FORMACIÓN + IDIOMAS */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className={`${CARD} p-5 space-y-4`}>
          <h3 className={OVERLINE}>{t("experience.educationTitle")}</h3>
          <ul className="space-y-3">
            {education.map((id) => {
              const base = `experience.education.${id}`;
              const detail = t(`${base}.detail`);
              return (
                <li key={id} className="space-y-0.5">
                  <p className="text-sm font-medium">{t(`${base}.title`)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t(`${base}.org`)} · {t(`${base}.period`)}
                  </p>
                  {detail ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {detail}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={`${CARD} p-5 space-y-4`}>
          <h3 className={OVERLINE}>{t("experience.languagesTitle")}</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>{t("experience.languages.es")}</li>
            <li>{t("experience.languages.en")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
