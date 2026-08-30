import type { Metadata, ResolvingMetadata } from "next";
import {
  DEFAULT_LOCALE,
  LOCALES,
  OG_LOCALES,
  getMessage,
  localePath,
  type Locale,
} from "./i18n";

export const BASE_URL = "https://villarrealrodrigo.com";
export const SITE_NAME = "Rodrigo Villarreal";

/** URL pública absoluta de una ruta interna sin prefijo, en el idioma dado. */
export function absoluteUrl(locale: Locale, path: string): string {
  return `${BASE_URL}${localePath(locale, path)}`;
}

/**
 * canonical del idioma actual + hreflang de todos los idiomas.
 * x-default apunta al inglés (la raíz del sitio).
 */
export function alternatesFor(
  locale: Locale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = absoluteUrl(l, path);
  languages["x-default"] = absoluteUrl(DEFAULT_LOCALE, path);
  return { canonical: absoluteUrl(locale, path), languages };
}

function otherOgLocales(locale: Locale): string[] {
  return LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALES[l]);
}

/** Metadata base del layout de cada idioma. */
export function siteMetadata(locale: Locale): Metadata {
  const title = getMessage(locale, "meta.site.title");
  const description = getMessage(locale, "meta.site.description");

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      title,
      description,
      url: absoluteUrl(locale, "/"),
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALES[locale],
      alternateLocale: otherOgLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

type PageMetadataInput = {
  locale: Locale;
  /** Ruta interna sin prefijo de idioma ("/projects", "/projects/dma"). */
  path: string;
  title: string;
  description: string;
  ogType?: "website" | "article";
  parent: ResolvingMetadata;
};

/**
 * Metadata de una página: título y descripción propios, canonical + hreflang,
 * OG y Twitter por idioma. Definir `openGraph` en una página reemplaza por
 * completo al del layout, así que se reusa su imagen (opengraph-image.tsx).
 */
export async function pageMetadata({
  locale,
  path,
  title,
  description,
  ogType = "website",
  parent,
}: PageMetadataInput): Promise<Metadata> {
  const parentImages = (await parent).openGraph?.images ?? [];
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(locale, path),
      siteName: SITE_NAME,
      type: ogType,
      locale: OG_LOCALES[locale],
      alternateLocale: otherOgLocales(locale),
      images: parentImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
