"use client";

import { useI18n } from "@/app/providers/I18nProvider";
import { openSource } from "@/app/data/openSource";

export function OpenSource() {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">
          {t("openSource.title")}
        </h3>
        <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          {t("openSource.subtitle")}
        </span>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {openSource.map((r) => (
          <li
            key={r.name}
            className="
              rounded-2xl border border-slate-200 dark:border-slate-800
              bg-white dark:bg-slate-900/80
              p-4 space-y-2
            "
          >
            <p className="font-mono text-sm font-semibold">{r.name}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t(r.descKey)}
            </p>
            <a
              href={r.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {t("openSource.viewRepo")} <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
