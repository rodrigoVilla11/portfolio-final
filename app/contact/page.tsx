"use client";

import { useState, FormEvent } from "react";
import { useI18n } from "../providers/I18nProvider";
import Link from "next/link";

export default function ContactPage() {
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Error al enviar");
      }

      setSuccess(t("contactPage.formSuccess"));
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError(t("contactPage.formError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-10 space-y-16 md:space-y-20">
        {/* HEADER */}
        <section className="space-y-4 animate-[fadein_.6s_ease-out]">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {t("contactPage.badge")}
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            {t("contactPage.title")}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            {t("contactPage.subtitle")}
          </p>
        </section>

        <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] items-start">
          {/* LEFT: INFO / LINKS DIRECTOS */}
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
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t("contactPage.intro")}
            </p>

            <div className="space-y-3 text-sm">
              <a
                href="mailto:tu-mail-aqui@example.com"
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-full
                  bg-slate-900 text-white
                  dark:bg-slate-100 dark:text-slate-900
                  hover:scale-[1.03] active:scale-[0.98]
                  transition-all
                "
              >
                <span>✉</span>
                <span>{t("contactPage.emailCta")}</span>
              </a>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 rounded-full
                    border border-slate-300 dark:border-slate-700
                    hover:bg-slate-100/80 dark:hover:bg-slate-800/70
                    transition-colors
                  "
                >
                  <span>in</span>
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 rounded-full
                    border border-slate-300 dark:border-slate-700
                    hover:bg-slate-100/80 dark:hover:bg-slate-800/70
                    transition-colors
                  "
                >
                  <span>◆</span>
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
              {t("contactPage.responseHint")}
            </p>
          </div>

          {/* RIGHT: FORM REAL */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">
              {t("contactPage.formTitle")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t("contactPage.formText")}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1 text-sm">
                <label
                  htmlFor="name"
                  className="block text-slate-700 dark:text-slate-200"
                >
                  {t("contactPage.formNameLabel")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    w-full px-3 py-2 rounded-xl
                    border border-slate-300 dark:border-slate-700
                    bg-white dark:bg-slate-900
                    text-sm
                    outline-none
                    focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500
                    transition-shadow
                  "
                  placeholder={t("contactPage.formNamePlaceholder")}
                  required
                />
              </div>

              <div className="space-y-1 text-sm">
                <label
                  htmlFor="email"
                  className="block text-slate-700 dark:text-slate-200"
                >
                  {t("contactPage.formEmailLabel")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full px-3 py-2 rounded-xl
                    border border-slate-300 dark:border-slate-700
                    bg-white dark:bg-slate-900
                    text-sm
                    outline-none
                    focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500
                    transition-shadow
                  "
                  placeholder={t("contactPage.formEmailPlaceholder")}
                  required
                />
              </div>

              <div className="space-y-1 text-sm">
                <label
                  htmlFor="message"
                  className="block text-slate-700 dark:text-slate-200"
                >
                  {t("contactPage.formMessageLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="
                    w-full px-3 py-2 rounded-xl
                    border border-slate-300 dark:border-slate-700
                    bg-white dark:bg-slate-900
                    text-sm
                    outline-none
                    focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500
                    transition-shadow
                    resize-none
                  "
                  placeholder={t("contactPage.formMessagePlaceholder")}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  inline-flex items-center justify-center
                  px-5 py-2.5 rounded-full
                  bg-slate-900 text-white
                  dark:bg-slate-100 dark:text-slate-900
                  text-sm
                  transition-all
                  ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.03] active:scale-[0.98]"}
                `}
              >
                {isSubmitting
                  ? t("contactPage.formSubmitting")
                  : t("contactPage.formSubmit")}
              </button>

              {success && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {success}
                </p>
              )}
              {error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t("contactPage.formNote")}
              </p>
            </form>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("contactPage.altContact")}{" "}
              <Link
                href="/projects"
                className="underline underline-offset-4 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {t("contactPage.altContactLink")}
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
