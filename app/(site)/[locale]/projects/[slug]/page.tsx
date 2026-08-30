import { projects } from "@/app/data/projects";
import ProjectPageClient from "./_client";

type Params = { locale: string; slug: string };

// Se combina con los locales del layout padre: 2 idiomas × 3 proyectos.
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
