import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Info } from "@/components/Info/Info";
import { getProjects, getSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { wordmark } = await getSettings();
  return { title: `Info - ${wordmark}` };
}

export default async function InfoPage() {
  const [settings, projects] = await Promise.all([
    getSettings(),
    getProjects(),
  ]);

  return (
    <>
      <Header />
      <Info settings={settings} projects={projects} />
    </>
  );
}
