"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/app/providers/I18nProvider";
import type { Project } from "../data/projects";

type LightboxImage = { src: string; alt: string };

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand";
}) {
  const base =
    "text-xs px-3 py-1 rounded-full border transition-colors";
  const neutral =
    "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/40";
  const brand =
    "border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-100/70 dark:bg-slate-800/50";
  return <span className={`${base} ${tone === "brand" ? brand : neutral}`}>{children}</span>;
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-slate-200 dark:border-slate-800",
        "bg-white/80 dark:bg-slate-900/70 backdrop-blur",
        "shadow-[0_6px_25px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_18px_55px_-30px_rgba(0,0,0,0.75)]",
        "transition-transform duration-300",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  overline,
  title,
  subtitle,
}: {
  overline?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {overline ? (
        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
          {overline}
        </p>
      ) : null}
      <h2 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h2>
      {subtitle ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
      ) : null}
    </div>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        inline-flex items-center gap-2
        px-5 py-2.5 rounded-full text-sm
        bg-slate-900 text-white
        dark:bg-slate-100 dark:text-slate-900
        hover:scale-[1.02] active:scale-[0.98]
        transition-transform
      "
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}

function SubtleLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        inline-flex items-center gap-2
        px-4 py-2 rounded-full text-sm
        border border-slate-200 dark:border-slate-800
        bg-white/60 dark:bg-slate-900/40
        hover:bg-slate-100/70 dark:hover:bg-slate-800/60
        transition-colors
      "
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}

/**
 * Visor de imagen sobre <dialog> nativo con showModal(): el navegador aporta
 * el foco atrapado, el cierre con Escape, la semántica modal y devuelve el
 * foco al elemento que lo abrió al cerrar. Siempre se cierra vía
 * dialog.close() para que se dispare `close` y esa restauración ocurra.
 */
function Lightbox({
  image,
  onClose,
}: {
  image: LightboxImage;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const close = () => ref.current?.close();

  // showModal() hace inerte el resto de la página, pero Chrome deja que Tab
  // salga del documento hacia la UI del navegador; con esto el foco cicla
  // dentro del visor.
  const trapFocus = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab" || !ref.current) return;
    const focusables = ref.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (focusables.length === 1) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={ref}
      aria-modal="true"
      aria-label={t("projectDetail.lightbox")}
      onClose={onClose}
      onKeyDown={trapFocus}
      className="
        fixed inset-0 z-50 m-0 h-full w-full max-h-none max-w-none
        border-0 bg-transparent p-0 text-white
        backdrop:bg-black/85 backdrop:backdrop-blur-sm
      "
    >
      <div
        className="flex h-full w-full items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("projectDetail.close")}
          autoFocus
          className="
            absolute top-4 right-4 rounded-full px-2
            text-3xl leading-none text-white/80
            hover:text-white transition-colors
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
          "
        >
          ×
        </button>
        <figure className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src={image.src}
            alt={image.alt}
            width={1600}
            height={900}
            className="w-full h-auto object-contain"
            priority
          />
          <figcaption className="sr-only">{image.alt}</figcaption>
        </figure>
      </div>
    </dialog>
  );
}

/** Imagen ampliable: un <button> real, operable por teclado y con foco visible. */
function ZoomImage({
  image,
  priority,
  gradient,
  onOpen,
}: {
  image: LightboxImage;
  priority?: boolean;
  gradient: string;
  onOpen: (image: LightboxImage, opener: HTMLElement) => void;
}) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={`${t("projectDetail.zoom")}: ${image.alt}`}
      onClick={(e) => onOpen(image, e.currentTarget)}
      className="
        group relative block w-full cursor-zoom-in overflow-hidden rounded-3xl text-left
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400
      "
    >
      <div className="relative aspect-video">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>
      <div className={`pointer-events-none absolute inset-0 bg-linear-to-t ${gradient} via-black/0 to-black/0`} />
    </button>
  );
}

export default function ProjectDetail({ project }: { project: Project }) {
  const { t, localeHref } = useI18n();
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
  // Elemento que abrió el visor: se le devuelve el foco al cerrar (además de
  // la restauración nativa del <dialog>, por si el visor ya se desmontó).
  const openerRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback((image: LightboxImage, opener: HTMLElement) => {
    openerRef.current = opener;
    setLightbox(image);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    const opener = openerRef.current;
    requestAnimationFrame(() => opener?.focus());
  }, []);

  const hasLinks = Boolean(project.links?.demo || project.links?.repo || project.links?.docs);
  const galleryCount = project.gallery?.length ?? 0;

  return (
    <main id="main" tabIndex={-1} className="min-h-screen outline-none">
      {lightbox && <Lightbox image={lightbox} onClose={closeLightbox} />}
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-10 space-y-10">
        {/* TOP NAV */}
        <div className="flex items-center justify-between">
          <Link
            href={localeHref("/projects")}
            className="
              text-sm inline-flex items-center gap-2
              text-slate-600 dark:text-slate-300
              hover:text-slate-900 dark:hover:text-white
              transition-colors
            "
          >
            <span aria-hidden>←</span> {t("projectDetail.backToProjects")}
          </Link>

          {project.categoryKey ? (
            <span className="text-[11px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {t(project.categoryKey)}
            </span>
          ) : null}
        </div>

        {/* HERO */}
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-5 animate-[fadein_.6s_ease-out]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {t(project.titleKey)}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              {t(project.shortKey)}
            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Pill key={tag} tone="brand">
                  {tag}
                </Pill>
              ))}
            </div>

            {/* LINKS */}
            {hasLinks ? (
              <div className="pt-2 space-y-3">
                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  {t("projectDetail.links")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.links?.demo ? (
                    <PrimaryLink href={project.links.demo}>
                      {t("projectDetail.viewDemo")}
                    </PrimaryLink>
                  ) : null}

                  {project.links?.repo ? (
                    <SubtleLink href={project.links.repo}>
                      {t("projectDetail.viewRepo")}
                    </SubtleLink>
                  ) : null}

                  {project.links?.docs ? (
                    <SubtleLink href={project.links.docs}>
                      {t("projectDetail.viewDocs")}
                    </SubtleLink>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          {/* COVER */}
          {project.cover?.src ? (
            <Card className="hover:-translate-y-px">
              <ZoomImage
                image={{ src: project.cover.src, alt: t(project.cover.altKey) }}
                priority
                gradient="from-black/35"
                onOpen={openLightbox}
              />
            </Card>
          ) : null}
        </section>

        {/* FACTS + STACK + HIGHLIGHTS */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* FACTS */}
          {project.facts?.length ? (
            <Card className="hover:-translate-y-px">
              <div className="p-6 space-y-5">
                <SectionTitle title={t("projectDetail.factsTitle")} />

                <div className="space-y-3 text-sm">
                  {project.facts.map((f) => (
                    <div
                      key={`${f.labelKey}-${f.valueKey}`}
                      className="flex items-start justify-between gap-4"
                    >
                      <span className="text-slate-500 dark:text-slate-400">
                        {t(f.labelKey)}
                      </span>
                      <span className="text-right text-slate-800 dark:text-slate-100">
                        {t(f.valueKey)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : null}

          {/* STACK */}
          <Card className="hover:-translate-y-px">
            <div className="p-6 space-y-4">
              <SectionTitle title={t("projectDetail.stack")} />
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>
            </div>
          </Card>

          {/* HIGHLIGHTS */}
          <Card className="hover:-translate-y-px">
            <div className="p-6 space-y-4">
              <SectionTitle title={t("projectDetail.highlights")} />
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {project.highlightsKeys.map((k) => (
                  <li key={k} className="flex gap-2">
                    <span aria-hidden className="mt-0.5 text-slate-400">•</span>
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        {/* GALLERY */}
        {project.gallery?.length ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <SectionTitle
                title={t("projectDetail.gallery")}
                subtitle={t("projectDetail.galleryHint") ?? undefined}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("projectDetail.screenshotCount").replace("{count}", String(galleryCount))}
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((img) => (
                <li key={img.src}>
                  <Card className="hover:-translate-y-px">
                    <ZoomImage
                      image={{ src: img.src, alt: t(img.altKey) }}
                      gradient="from-black/25"
                      onOpen={openLightbox}
                    />
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* SECTIONS */}
        <section className="space-y-10">
          {project.sections.map((sec) => (
            <article
              key={sec.titleKey}
              className="
                rounded-3xl border border-slate-200 dark:border-slate-800
                bg-white/80 dark:bg-slate-900/70
                shadow-[0_6px_25px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_18px_55px_-30px_rgba(0,0,0,0.75)]
                hover:-translate-y-px
                transition-all duration-300
                p-6
              "
            >
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {t(sec.titleKey)}
                  </h2>

                  {sec.calloutKey ? (
                    <div
                      className="
                        rounded-2xl
                        border border-slate-200 dark:border-slate-800
                        bg-slate-50/80 dark:bg-slate-800/30
                        p-4
                        text-sm
                        text-slate-700 dark:text-slate-200
                      "
                    >
                      {t(sec.calloutKey)}
                    </div>
                  ) : null}

                  {sec.paragraphsKeys?.length ? (
                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {sec.paragraphsKeys.map((k) => (
                        <p key={k}>{t(k)}</p>
                      ))}
                    </div>
                  ) : null}

                  {sec.bulletsKeys?.length ? (
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {sec.bulletsKeys.map((k) => (
                        <li key={k} className="flex gap-2">
                          <span aria-hidden className="mt-0.5 text-slate-400">—</span>
                          <span>{t(k)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {sec.noteKey ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-dashed border-slate-200 dark:border-slate-800 pt-3">
                      {t(sec.noteKey)}
                    </p>
                  ) : null}
                </div>

                {/* SECTION IMAGE */}
                {sec.image?.src ? (
                  <Card className="hover:-translate-y-px">
                    <ZoomImage
                      image={{ src: sec.image.src, alt: t(sec.image.altKey) }}
                      gradient="from-black/25"
                      onOpen={openLightbox}
                    />
                  </Card>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
