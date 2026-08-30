# Portfolio — Rodrigo Villarreal

Portfolio personal de un desarrollador Fullstack (Valencia, España). Presenta
tres sistemas en producción — un ERP B2B, una plataforma SaaS gastronómica y una
landing de conversión — con foco en software operativo de negocio real.

**Live:** https://villarrealrodrigo.com

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4**
- i18n propio (ES/EN) y theming (light/dark/system) vía `useSyncExternalStore`
- Formulario de contacto con **API Route + MongoDB** (validación con Zod,
  honeypot y rate limit por IP) e inbox de administración en `/admin/messages`
  protegido por sesión en cookie httpOnly (login en `/admin/login`)
- Imágenes optimizadas con `next/image` (Cloudinary) · SEO: metadata, Open
  Graph, JSON-LD (`Person`) y `sitemap.xml` dinámico

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint     # ESLint
```

## Variables de entorno

Crear `.env.local` (ver valores requeridos):

```
MONGODB_URI=...
MONGODB_DB=...
CONTACT_ADMIN_TOKEN=...   # token para entrar al inbox (/admin/login)
```

## Estructura

```
app/
  page.tsx              # home (hero, about, proyectos, contacto)
  projects/             # listado y detalle por slug
  contact/              # formulario -> /api/contact
  admin/login/          # login del inbox (server action -> cookie de sesión)
  admin/messages/       # inbox; sin sesión válida responde 404
  api/contact/          # POST: Zod + honeypot + rate limit -> MongoDB
  components/           # Navbar, Footer, ProjectDetail
  providers/            # Theme, i18n, UI (context)
  data/projects.ts      # fuente de datos de proyectos
  translate/            # es.json / en.json
lib/mongodb.ts          # conexión cacheada a MongoDB
lib/admin-auth.ts       # token/cookie de admin (comparación en tiempo constante)
lib/rate-limit.ts       # rate limit en memoria (ver limitación en el archivo)
```

## Limitación conocida: rate limit

El límite de envíos del formulario (`lib/rate-limit.ts`) vive en memoria de la
instancia. En Vercel no se comparte entre instancias ni sobrevive a los
arranques en frío, así que solo frena ráfagas contra una instancia caliente.
Para un límite global hay que conectarlo a un store compartido (p. ej. Upstash
Redis) manteniendo la misma firma de `rateLimit`.
