// Núcleo de i18n compartido por servidor y cliente.
//
// El idioma lo define la URL: inglés en la raíz ("/", "/projects/dma") y
// español bajo "/es" ("/es", "/es/projects/dma"). Internamente ambas ramas
// viven en app/(site)/[locale]/; next.config.ts reescribe las URLs sin prefijo
// a "/en/..." y redirige (308) "/en/..." público a la raíz.

import es from "@/app/translate/es.json";
import en from "@/app/translate/en.json";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** Idioma sin prefijo en la URL pública. */
export const DEFAULT_LOCALE: Locale = "en";

export const messages: Record<Locale, unknown> = { en, es };

/** Valor de og:locale por idioma. */
export const OG_LOCALES: Record<Locale, string> = { en: "en_GB", es: "es_ES" };

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

/** Resuelve "a.b.c" dentro del árbol de mensajes; undefined si no existe. */
export function resolveKey(root: unknown, key: string): unknown {
  let value: unknown = root;
  for (const p of key.split(".")) {
    if (
      value &&
      typeof value === "object" &&
      p in (value as Record<string, unknown>)
    ) {
      value = (value as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return value;
}

/** Versión de servidor de t(): devuelve la clave si no existe. */
export function getMessage(locale: Locale, key: string): string {
  const value = resolveKey(messages[locale], key);
  return typeof value === "string" ? value : key;
}

/**
 * Prefija una ruta interna con el locale: ("es", "/projects/dma") →
 * "/es/projects/dma"; ("en", "/projects/dma") → "/projects/dma".
 * Deja intactos externos, mailto:, anclas sueltas ("#x") y rutas ya prefijadas.
 */
export function localePath(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  if (locale === DEFAULT_LOCALE) return path;
  if (path === `/${locale}` || path.startsWith(`/${locale}/`)) return path;
  if (path === "/") return `/${locale}`;
  if (path.startsWith("/#") || path.startsWith("/?")) {
    return `/${locale}${path.slice(1)}`;
  }
  return `/${locale}${path}`;
}

/**
 * Separa el locale de un pathname. Acepta tanto la URL pública ("/es/projects")
 * como la interna tras el rewrite ("/en/projects"), así el resultado es el
 * mismo en servidor y en cliente y no hay desajustes de hidratación.
 */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return { locale, path: "/" };
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) };
    }
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}
