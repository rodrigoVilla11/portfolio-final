# Portfolio — Rodrigo Villarreal

Portfolio personal de un desarrollador Fullstack (Valencia, España). Presenta
tres sistemas en producción — un ERP B2B, una plataforma SaaS gastronómica y una
landing de conversión — con foco en software operativo de negocio real.

**Live:** https://villarrealrodrigo.com

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4**
- i18n propio (ES/EN) y theming (light/dark/system) vía `useSyncExternalStore`
- Formulario de contacto con **API Routes + MongoDB** e inbox de administración
  protegido por Bearer token
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
CONTACT_ADMIN_TOKEN=...   # token del inbox /admin/messages
```

## Estructura

```
app/
  page.tsx              # home (hero, about, proyectos, contacto)
  projects/             # listado y detalle por slug
  contact/              # formulario -> /api/contact
  admin/messages/       # inbox protegido por token
  api/                  # contact (POST) y messages (GET protegido)
  components/           # Navbar, Footer, ProjectDetail
  providers/            # Theme, i18n, UI (context)
  data/projects.ts      # fuente de datos de proyectos
  translate/            # es.json / en.json
lib/mongodb.ts          # conexión cacheada a MongoDB
```
