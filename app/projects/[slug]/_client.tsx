"use client";

import ProjectDetail from "@/app/components/ProjectDetail";
import { projects } from "@/app/data/projects";
import { notFound } from "next/navigation";

export default function ProjectPageClient({ slug }: { slug: string }) {
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
