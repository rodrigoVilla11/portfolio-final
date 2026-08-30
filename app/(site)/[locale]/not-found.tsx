"use client";

import Link from "next/link";
import { useI18n } from "@/app/providers/I18nProvider";

// Se renderiza dentro del layout del idioma, así que tiene acceso a t().
export default function NotFound() {
  const { t, localeHref } = useI18n();

  return (
    <main id="main" tabIndex={-1} className="max-w-5xl mx-auto px-4 py-16 space-y-3 outline-none">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("notFound.title")}
      </h1>
      <p className="text-slate-600 dark:text-slate-300">
        <Link
          href={localeHref("/projects")}
          className="underline underline-offset-4 text-indigo-600 dark:text-indigo-400 hover:opacity-80"
        >
          ← {t("notFound.back")}
        </Link>
      </p>
    </main>
  );
}
