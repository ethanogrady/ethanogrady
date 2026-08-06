import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { ProjectCarousel } from "@/components/ProjectCarousel/ProjectCarousel";
import { projects } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  return { title: project ? `${project.title} — Ethan O’Grady` : "Not found" };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();

  return (
    <>
      <Header />
      <ProjectCarousel project={project} />
    </>
  );
}
