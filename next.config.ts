import type { NextConfig } from "next";

// Rutas por idioma (ver lib/i18n.ts):
//   - Inglés sin prefijo: "/" y "/projects/dma" se reescriben internamente a
//     "/en" y "/en/projects/dma" (afterFiles: después de archivos estáticos,
//     /api, /admin y sitemap, pero antes de las rutas dinámicas).
//   - "/en/..." como URL pública redirige (308) a la raíz para que no existan
//     dos URLs con el mismo contenido. Se redirigen solo las páginas; la imagen
//     OG "/en/opengraph-image" se sirve directo.
//   - "/es/..." llega sin tocar a app/(site)/[locale].
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/projects", destination: "/projects", permanent: true },
      { source: "/en/projects/:slug", destination: "/projects/:slug", permanent: true },
      { source: "/en/contact", destination: "/contact", permanent: true },
    ];
  },
  async rewrites() {
    return {
      afterFiles: [
        { source: "/", destination: "/en" },
        {
          // Cualquier primer segmento que no sea "en" ni "es".
          source: "/:first((?!(?:en|es)(?:/|$))[^/]+)/:rest*",
          destination: "/en/:first/:rest*",
        },
      ],
    };
  },
};

export default nextConfig;
