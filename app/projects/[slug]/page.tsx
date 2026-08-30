import type { Metadata, ResolvingMetadata } from "next";
import { projects } from "@/app/data/projects";
import ProjectPageClient from "./_client";

type Params = { slug: string };

const PROJECT_META: Record<string, { title: string; description: string }> = {
  dma: {
    title: "Distribuidora DMA — B2B Distribution Platform",
    description:
      "A production B2B platform for a wholesale automotive parts distributor in Argentina — payment allocation engine with sequential document settlement, DCR-based discounts and check interest amortization, 50+ NestJS modules, 43 RTK Query slices, multi-tenant architecture, and GPS-based field sales tooling. Built with Next.js 15, NestJS, MongoDB, and RTK Query.",
  },
  "nova-sushi": {
    title: "Nõva Sushi — Marketing & Franchise Platform",
    description:
      "A marketing and franchise acquisition website for an Argentine sushi brand — interactive menu with 100+ items, full franchise investor funnel with ROI modeling, scroll-driven Framer Motion animations, and WhatsApp-first contact architecture. Built with Next.js 15, React 19, and Framer Motion.",
  },
  gourmetify: {
    title: "Gourmetify — Full-Stack Restaurant SaaS",
    description:
      "A production-grade multi-tenant SaaS platform for restaurant management — offline-first POS with IndexedDB sync, dual payment-provider integration (Stripe + MercadoPago) for SaaS billing and customer payments, 40+ database models with explicit row isolation, 3-tier plan feature gating, and 30+ operational modules. Built with Next.js 16, TypeScript, Prisma, and PostgreSQL.",
  },
};

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const meta = PROJECT_META[slug];

  if (!meta) {
    return { title: "Project not found | Rodrigo Villarreal" };
  }

  // Definir `openGraph` acá reemplaza por completo al del layout raíz, así que
  // reusamos su imagen (app/opengraph-image.tsx) para que las páginas de
  // proyecto también tengan og:image / twitter:image.
  const parentImages = (await parent).openGraph?.images ?? [];

  return {
    title: `${meta.title} | Rodrigo Villarreal`,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Rodrigo Villarreal`,
      description: meta.description,
      type: "article",
      images: parentImages,
    },
  };
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  return <ProjectPageClient slug={slug} />;
}
