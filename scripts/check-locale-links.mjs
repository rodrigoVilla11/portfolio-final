// Chequeo post-build de las rutas por idioma. Recorre el HTML prerenderizado
// en .next/server/app y falla (exit 1) si encuentra:
//   - un <a href> interno sin el prefijo de idioma correcto (en páginas /es)
//     o con prefijo /es o /en en páginas inglesas (la URL pública inglesa no
//     lleva prefijo; /en/... solo redirige);
//   - <html lang> distinto del idioma de la página;
//   - canonical ausente o del idioma equivocado;
//   - falta alguno de los hreflang (en, es, x-default);
//   - og:locale ausente o del idioma equivocado;
//   - menos páginas prerenderizadas de las esperadas.
//
// Corre como `postbuild` (npm run build lo ejecuta solo, también en Vercel).
//
//   node scripts/check-locale-links.mjs

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = path.join(ROOT, ".next", "server", "app");

const LOCALES = ["en", "es"];
const DEFAULT_LOCALE = "en";
const OG_LOCALES = { en: "en_GB", es: "es_ES" };
const HREFLANGS = ["en", "es", "x-default"];
// 2 idiomas × (home, /projects, /contact, 3 proyectos)
const EXPECTED_PAGES = 12;

const SKIP_PREFIXES = ["/_next/", "/api/", "/admin/"];
const FILE_RE = /\.[a-z0-9]+(?:[?#].*)?$/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

function hasPrefix(href, locale) {
  return (
    href === `/${locale}` ||
    href.startsWith(`/${locale}/`) ||
    href.startsWith(`/${locale}#`) ||
    href.startsWith(`/${locale}?`)
  );
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? m[1] : null;
}

function checkPage(file) {
  const rel = path.relative(APP_DIR, file).replace(/\\/g, "/");
  const first = rel.split("/")[0].replace(/\.html$/, "");
  if (!LOCALES.includes(first)) return null; // _not-found.html, etc.

  const locale = first;
  const html = readFileSync(file, "utf8");
  const errors = [];

  // <html lang>
  const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
  if (lang !== locale) errors.push(`html lang="${lang}" (esperado "${locale}")`);

  // canonical
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) errors.push("sin <link rel=canonical>");
  else {
    const p = new URL(canonical).pathname;
    const ok = locale === DEFAULT_LOCALE ? !hasPrefix(p, "en") && !hasPrefix(p, "es") : hasPrefix(p, locale);
    if (!ok) errors.push(`canonical del idioma equivocado: ${canonical}`);
  }

  // hreflang
  for (const hl of HREFLANGS) {
    const re = new RegExp(`<link rel="alternate" hrefLang="${hl}" href="[^"]+"`, "i");
    if (!re.test(html)) errors.push(`falta hreflang="${hl}"`);
  }

  // og:locale
  const og = html.match(/<meta property="og:locale" content="([^"]+)"/)?.[1];
  if (og !== OG_LOCALES[locale]) errors.push(`og:locale="${og}" (esperado "${OG_LOCALES[locale]}")`);

  // <a href> internos
  let anchors = 0;
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const tag = m[0];
    const href = attr(tag, "href");
    if (!href || !href.startsWith("/") || href.startsWith("//")) continue;
    if (SKIP_PREFIXES.some((p) => href.startsWith(p))) continue;
    if (FILE_RE.test(href)) continue; // /cv_es.pdf, etc.
    anchors += 1;

    // Switch de idioma: el destino es el idioma que declara hrefLang.
    const switchTo = attr(tag, "hrefLang");
    const target = switchTo && LOCALES.includes(switchTo) ? switchTo : locale;

    const ok =
      target === DEFAULT_LOCALE
        ? !hasPrefix(href, "en") && !hasPrefix(href, "es")
        : hasPrefix(href, target);
    if (!ok) errors.push(`href sin prefijo correcto para "${target}": ${href}`);
  }

  return { rel, locale, anchors, errors };
}

let files;
try {
  files = walk(APP_DIR);
} catch {
  console.error(`No existe ${APP_DIR}. Corré "next build" antes.`);
  process.exit(1);
}

const results = files.map(checkPage).filter(Boolean);
let failed = false;

for (const r of results) {
  const status = r.errors.length ? "FAIL" : "ok  ";
  console.log(`${status} ${r.rel.padEnd(32)} lang=${r.locale} hrefs internos=${r.anchors}`);
  for (const e of r.errors) console.log(`       - ${e}`);
  if (r.errors.length) failed = true;
}

if (results.length < EXPECTED_PAGES) {
  console.log(`FAIL páginas prerenderizadas: ${results.length} (esperadas ${EXPECTED_PAGES})`);
  failed = true;
}

if (failed) {
  console.error("\ncheck-locale-links: hay errores.");
  process.exit(1);
}
console.log(`\ncheck-locale-links: ${results.length} páginas OK.`);
