"use client";

import { useState, FormEvent } from "react";
import { useI18n } from "@/app/providers/I18nProvider";
import Link from "next/link";

type Field = "name" | "email" | "message";
type FieldErrors = Partial<Record<Field, string>>;

type ApiResponse =
  | { ok: true }
  | { ok: false; error: string; errors?: Partial<Record<Field, string>> };

const INPUT_CLASS = `
  w-full px-3 py-2 rounded-xl
  border border-slate-300 dark:border-slate-700
  bg-white dark:bg-slate-900
  text-sm
  outline-none
  focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500
  transition-shadow
  aria-[invalid=true]:border-red-500 dark:aria-[invalid=true]:border-red-500
`;

export default function ContactClient() {
  const { t, localeHref } = useI18n();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot: campo oculto por CSS que un humano nunca completa.
  const [website, setWebsite] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearFieldError(field: Field) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, website }),
      });

      let data: ApiResponse | null = null;
      try {
        data = (await res.json()) as ApiResponse;
      } catch {
        data = null;
      }

      if (res.ok && data?.ok) {
        setSuccess(t("contactPage.formSuccess"));
        setName("");
        setEmail("");
        setMessage("");
        return;
      }

      if (res.status === 400 && data && !data.ok && data.errors) {
        const next: FieldErrors = {};
        for (const field of ["name", "email", "message"] as const) {
          const code = data.errors[field];
          if (code) next[field] = t(`contactPage.formErrors.${code}`);
        }
        setFieldErrors(next);
        setError(t("contactPage.formFixFields"));
        return;
      }

      if (res.status === 429) {
        setError(t("contactPage.formRateLimited"));
        return;
      }

      setError(t("contactPage.formError"));
    } catch (err) {
      console.error(err);
      setError(t("contactPage.formError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="main" tabIndex={-1} className="min-h-screen outline-none">
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
                href="mailto:villarrealrodrigo.n@gmail.com"
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-full
                  bg-indigo-600 text-white
                  dark:bg-indigo-500
                  hover:bg-indigo-700 dark:hover:bg-indigo-600
                  hover:scale-[1.03] active:scale-[0.98]
                  transition-all
                "
              >
                <span>✉</span>
                <span>{t("contactPage.emailCta")}</span>
              </a>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/in/rodrigonicolasvillarreal/"
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
                  <svg aria-hidden viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.24 8h4.52v14H.24V8zM8.06 8h4.33v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.52v-6.62c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H8.06V8z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://github.com/rodrigoVilla11"
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
                  <svg aria-hidden viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
                  </svg>
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

            <form className="relative space-y-4" onSubmit={handleSubmit} noValidate>
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
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError("name");
                  }}
                  className={INPUT_CLASS}
                  placeholder={t("contactPage.formNamePlaceholder")}
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  aria-invalid={fieldErrors.name ? true : undefined}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name ? (
                  <p id="name-error" role="alert" className="text-xs text-red-600 dark:text-red-400">
                    {fieldErrors.name}
                  </p>
                ) : null}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                  }}
                  className={INPUT_CLASS}
                  placeholder={t("contactPage.formEmailPlaceholder")}
                  required
                  maxLength={254}
                  autoComplete="email"
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {fieldErrors.email ? (
                  <p id="email-error" role="alert" className="text-xs text-red-600 dark:text-red-400">
                    {fieldErrors.email}
                  </p>
                ) : null}
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
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearFieldError("message");
                  }}
                  className={`${INPUT_CLASS} resize-none`}
                  placeholder={t("contactPage.formMessagePlaceholder")}
                  required
                  minLength={20}
                  maxLength={5000}
                  aria-invalid={fieldErrors.message ? true : undefined}
                  aria-describedby={fieldErrors.message ? "message-error" : undefined}
                />
                {fieldErrors.message ? (
                  <p id="message-error" role="alert" className="text-xs text-red-600 dark:text-red-400">
                    {fieldErrors.message}
                  </p>
                ) : null}
              </div>

              {/* HONEYPOT: fuera de pantalla por CSS (no display:none ni type=hidden),
                  invisible para lectores de pantalla y fuera del orden de tabulación. */}
              <div
                aria-hidden="true"
                className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden"
              >
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  inline-flex items-center justify-center
                  px-5 py-2.5 rounded-full
                  bg-indigo-600 text-white
                  dark:bg-indigo-500
                  text-sm
                  transition-all
                  ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:scale-[1.03] active:scale-[0.98]"}
                `}
              >
                {isSubmitting
                  ? t("contactPage.formSubmitting")
                  : t("contactPage.formSubmit")}
              </button>

              <div aria-live="polite">
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
              </div>
            </form>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("contactPage.altContact")}{" "}
              <Link
                href={localeHref("/projects")}
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
