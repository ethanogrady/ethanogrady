import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { WorkList } from "@/components/WorkList/WorkList";
import { getProjects, getSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { wordmark } = await getSettings();
  return { title: `List - ${wordmark}` };
}

export default async function ListPage() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <WorkList projects={projects} />
    </>
  );
}
