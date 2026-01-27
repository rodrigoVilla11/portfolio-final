"use client";

import ProjectDetail from "@/app/components/ProjectDetail";
import { projects } from "@/app/data/projects";
import { notFound, useParams } from "next/navigation";
export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
