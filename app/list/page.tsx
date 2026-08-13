import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { WorkList } from "@/components/WorkList/WorkList";
import { StructuredData } from "@/components/StructuredData/StructuredData";
import { getProjects, getSettings } from "@/lib/content";
import { workListSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const { wordmark } = await getSettings();
  const projects = await getProjects();

  return {
    title: "Index of work",
    description: `A chronological index of ${projects.length} photography projects by ${wordmark}, spanning interiors, fashion, and editorial commissions.`,
    alternates: { canonical: "/list" },
  };
}

export default async function ListPage() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSettings(),
  ]);

  return (
    <>
      <StructuredData data={workListSchema(projects, settings)} />
      <Header />
      <h1 className="visuallyHidden">Index of work</h1>
      <WorkList projects={projects} />
    </>
  );
}
