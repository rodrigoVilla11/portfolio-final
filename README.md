# Portfolio — Rodrigo Villarreal

Portfolio personal de un desarrollador Fullstack (Valencia, España). Presenta
dos sistemas en producción — un ERP B2B y una plataforma SaaS gastronómica —,
experiencia y formación, y repos públicos, con foco en software operativo de
negocio real.

**Live:** https://villarrealrodrigo.com (inglés) · https://villarrealrodrigo.com/es (español)

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4**
- i18n propio con rutas por idioma (ver abajo) y theming (light/dark/system)
  vía `useSyncExternalStore`
- Formulario de contacto con **API Route + MongoDB** (validación con Zod,
  honeypot y rate limit por IP) e inbox de administración en `/admin/messages`
  protegido por sesión en cookie httpOnly (login en `/admin/login`)
- Imágenes optimizadas con `next/image` (Cloudinary) · SEO: metadata, Open
  Graph e imagen OG por idioma, canonical + hreflang, JSON-LD (`Person`) y
  `sitemap.xml` con ambas versiones

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción (+ postbuild: scripts/check-locale-links.mjs)
npm run lint     # ESLint
npm run icons    # regenera favicon / icon.png / apple-icon.png
```

## Variables de entorno

Crear `.env.local` (ver valores requeridos):

```
MONGODB_URI=...
MONGODB_DB=...
CONTACT_ADMIN_TOKEN=...   # token para entrar al inbox (/admin/login)
```

## Idiomas y URLs

El idioma lo define la URL: **inglés sin prefijo** (`/`, `/projects/dma`) y
**español bajo `/es`** (`/es`, `/es/projects/dma`). Ambas ramas viven en
`app/(site)/[locale]/` y se prerenderizan; `next.config.ts` reescribe las URLs
sin prefijo a `/en/...` internamente y redirige (308) `/en/...` público a la
raíz. Cada página emite `<html lang>`, canonical, `hreflang` (`en`, `es`,
`x-default` → inglés), metadata/OG por idioma; el switch del navbar enlaza a
la misma ruta en el otro idioma.

Para agregar una página: crear `page.tsx` (servidor, con `generateMetadata`
vía `pageMetadata()`) + `_client.tsx` bajo `[locale]`, usar `localeHref()` en
todo `href` interno, sumar sus textos en `translate/*.json` (incluido `meta.*`),
añadirla a `PAGES` en `app/sitemap.ts` y un redirect de `/en/<ruta>` en
`next.config.ts`. `npm run build` falla si queda un enlace interno sin el
prefijo correcto o falta canonical/hreflang/`og:locale`.

## Estructura

```
app/
  (site)/[locale]/         # sitio público; locale = en | es
    layout.tsx             # root layout: html lang, metadata por idioma, JSON-LD
    page.tsx + _client.tsx # home (hero, about, qué busco, proyectos, experiencia, contacto)
    projects/              # listado y detalle por slug
    contact/               # formulario -> /api/contact
    [...rest]/             # catch-all -> notFound() (404 por idioma)
    opengraph-image.tsx    # imagen OG por idioma
  admin/                   # root layout propio: login (server action -> cookie) e inbox
  api/contact/             # POST: Zod + honeypot + rate limit -> MongoDB
  components/              # Navbar, Footer, ProjectDetail, Experience, OpenSource
  providers/               # Theme, i18n (idioma de la URL), UI
  data/projects.ts         # proyectos (listed: false = solo por URL directa)
  data/experience.ts       # ids y links de experiencia/formación (textos en translate/)
  data/openSource.ts       # repos públicos del bloque "Código abierto"
  translate/               # es.json / en.json (incluye meta.* para metadata)
  sitemap.ts               # 6 páginas × 2 idiomas, con alternates
public/cv_es.pdf, cv_en.pdf # CV descargable según el idioma activo
lib/i18n.ts                # locales, localePath/stripLocale, mensajes en servidor
lib/i18n-metadata.ts       # canonical + hreflang, OG/Twitter por idioma
lib/mongodb.ts             # conexión cacheada a MongoDB
lib/admin-auth.ts          # token/cookie de admin (comparación en tiempo constante)
lib/rate-limit.ts          # rate limit en memoria (ver limitación en el archivo)
scripts/check-locale-links.mjs # postbuild: enlaces, lang, canonical, hreflang, og:locale
next.config.ts             # rewrites "/" -> "/en" y redirects 308 de /en/* a la raíz
```

## Accesibilidad

- Skip link al `<main id="main">`, foco visible consistente (`:focus-visible`
  en `globals.css`), `prefers-reduced-motion` anula animaciones y transiciones.
- Visor de imágenes sobre `<dialog>` nativo (`showModal()`): foco atrapado,
  Escape, devolución del foco al botón que lo abrió. Menú móvil con Escape,
  focus trap y devolución del foco.
- Auditoría: `scripts/a11y/axe-audit.mjs` (axe-core sobre las 12 páginas en
  tema claro/oscuro, visor y menú abiertos) y `scripts/a11y/keyboard.mjs`
  (recorrido real por teclado). Corren con Playwright sobre el Edge instalado;
  las instrucciones están en la cabecera de cada script.

## Limitación conocida: rate limit

El límite de envíos del formulario (`lib/rate-limit.ts`) vive en memoria de la
instancia. En Vercel no se comparte entre instancias ni sobrevive a los
arranques en frío, así que solo frena ráfagas contra una instancia caliente.
Para un límite global hay que conectarlo a un store compartido (p. ej. Upstash
Redis) manteniendo la misma firma de `rateLimit`.
