"use client";

import Link from "next/link";
import { useI18n } from "@/app/providers/I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        border-t border-slate-200 dark:border-slate-800
        bg-white/80 dark:bg-slate-900/80
        backdrop-blur
        mt-8
      "
    >
      <div className="max-w-5xl mx-auto px-4 py-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Izquierda */}
        <div className="space-y-1">
          <p className="font-medium text-slate-700 dark:text-slate-200">
            © {year} Rodrigo Villarreal
          </p>
          <p>{t("footer.tagline")}</p>
        </div>

        {/* Derecha */}
        <div className="flex flex-wrap gap-3 sm:justify-end">
          <Link
            href="/projects"
            className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            {t("footer.projects")}
          </Link>
          <Link
            href="/contact"
            className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            {t("footer.contact")}
          </Link>
          <a
            href="https://github.com/rodrigoVilla11"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/rodrigonicolasvillarreal/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}