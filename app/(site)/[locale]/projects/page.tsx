import type { Metadata, ResolvingMetadata } from "next";
import { getMessage, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n-metadata";
import ProjectsClient from "./_client";

type Params = { locale: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return pageMetadata({
    locale,
    path: "/projects",
    title: getMessage(locale, "meta.pages.projects.title"),
    description: getMessage(locale, "meta.pages.projects.description"),
    parent,
  });
}

export default function ProjectsPage() {
  return <ProjectsClient />;
}
