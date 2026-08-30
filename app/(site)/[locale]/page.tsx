import type { Metadata, ResolvingMetadata } from "next";
import { getMessage, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n-metadata";
import HomeClient from "./_client";

type Params = { locale: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const meta = await pageMetadata({
    locale,
    path: "/",
    title: getMessage(locale, "meta.site.title"),
    description: getMessage(locale, "meta.site.description"),
    parent,
  });
  // La home usa el título del sitio tal cual, sin sufijo.
  const title = getMessage(locale, "meta.site.title");
  return {
    ...meta,
    title,
    openGraph: { ...meta.openGraph, title },
    twitter: { ...meta.twitter, title },
  };
}

export default function HomePage() {
  return <HomeClient />;
}
