import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { LOCALES } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/i18n-metadata";

type Page = {
  /** Ruta interna sin prefijo de idioma. */
  path: string;
  changeFrequency: "monthly" | "yearly";
  priority: number;
};

// Al agregar una página nueva: sumarla acá, darle meta.* en translate/*.json
// y, si se quiere canonicalizar /en/<ruta>, un redirect en next.config.ts.
const PAGES: Page[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  ...projects.map((p) => ({
    path: `/projects/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
];

// Cada página en cada idioma, con hreflang cruzado (xhtml:link) en cada entrada.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(locale, page.path),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          en: absoluteUrl("en", page.path),
          es: absoluteUrl("es", page.path),
          "x-default": absoluteUrl("en", page.path),
        },
      },
    })),
  );
}
