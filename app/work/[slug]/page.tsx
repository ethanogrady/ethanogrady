import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { ProjectCarousel } from "@/components/ProjectCarousel/ProjectCarousel";
import { StructuredData } from "@/components/StructuredData/StructuredData";
import { getProject, getProjects, getSettings } from "@/lib/content";
import { breadcrumbSchema, projectSchema } from "@/lib/schema";

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProject(slug),
    getSettings(),
  ]);

  if (!project) return { title: "Not found" };

  const year = project.year ? `${project.year}. ` : "";
  const context = settings.description ? ` ${settings.description}` : "";
  const description = `${project.title}. ${year}${project.assets.length} photographs by ${settings.wordmark}.${context}`;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} - ${settings.wordmark}`,
      description,
      url: `/work/${project.slug}`,
      images: [
        {
          url: `${project.cover.src}?w=1200&h=630&fit=crop&auto=format`,
          width: 1200,
          height: 630,
          alt: project.cover.alt ?? project.title,
        },
      ],
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProject(slug),
    getSettings(),
  ]);
  if (!project) notFound();

  return (
    <>
      <StructuredData data={projectSchema(project, settings)} />
      <StructuredData data={breadcrumbSchema(project)} />
      <Header />
      <h1 className="visuallyHidden">{project.title}</h1>
      <ProjectCarousel project={project} />
    </>
  );
}
