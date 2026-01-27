"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/providers/I18nProvider";
import type { Project } from "../data/projects";

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

function ImgFrame({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="relative aspect-16/10">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0" />
    </div>
  );
}

export default function ProjectDetail({ project }: { project: Project }) {
  const { t } = useI18n();

  const hasLinks = Boolean(project.links?.demo || project.links?.repo || project.links?.docs);

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-10 space-y-10">
        {/* TOP NAV */}
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
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
              <ImgFrame
                src={project.cover.src}
                alt={t(project.cover.altKey)}
                priority
              />
            </Card>
          ) : (
            <Card>
              <div className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Tip: agregá <code className="text-xs">project.cover</code> para mostrar una imagen principal.
                </p>
              </div>
            </Card>
          )}
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
                    <span className="mt-0.5 text-slate-400">•</span>
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
                {project.gallery.length} screenshots
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((img) => (
                <Card key={img.src} className="hover:-translate-y-px">
                  <div className="relative overflow-hidden rounded-3xl">
                    <div className="relative aspect-16/10">
                      <Image
                        src={img.src}
                        alt={t(img.altKey)}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-black/0 to-black/0" />
                  </div>
                </Card>
              ))}
            </div>
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
                  <h3 className="text-xl font-semibold tracking-tight">
                    {t(sec.titleKey)}
                  </h3>

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
                          <span className="mt-0.5 text-slate-400">—</span>
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
                    <div className="relative overflow-hidden rounded-3xl">
                      <div className="relative aspect-16/10">
                        <Image
                          src={sec.image.src}
                          alt={t(sec.image.altKey)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-black/0 to-black/0" />
                    </div>
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