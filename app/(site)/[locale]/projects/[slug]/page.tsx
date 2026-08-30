import type { Metadata, ResolvingMetadata } from "next";
import { projects } from "@/app/data/projects";
import { getMessage, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n-metadata";
import ProjectPageClient from "./_client";

type Params = { locale: string; slug: string };

// Se combina con los locales del layout padre: 2 idiomas × 3 proyectos.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const known = projects.some((p) => p.slug === slug);
  if (!known) {
    return { title: `${getMessage(locale, "notFound.title")} | Rodrigo Villarreal` };
  }

  // Textos en translate/*.json bajo meta.projects.<slug>.
  return pageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: getMessage(locale, `meta.projects.${slug}.title`),
    description: getMessage(locale, `meta.projects.${slug}.description`),
    ogType: "article",
    parent,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  return <ProjectPageClient slug={slug} />;
}
