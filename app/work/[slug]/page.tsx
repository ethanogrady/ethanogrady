import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { ProjectCarousel } from "@/components/ProjectCarousel/ProjectCarousel";
import { getProject, getProjects, getSettings } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [project, { wordmark }] = await Promise.all([
    getProject(slug),
    getSettings(),
  ]);
  return { title: project ? `${project.title} - ${wordmark}` : "Not found" };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Header />
      <ProjectCarousel project={project} />
    </>
  );
}
