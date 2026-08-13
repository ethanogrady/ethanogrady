import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { StructuredData } from "@/components/StructuredData/StructuredData";
import { Work } from "@/components/Work/Work";
import { getProjects, getSettings } from "@/lib/content";
import { personSchema, websiteSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const { wordmark } = await getSettings();

  return {
    title: { absolute: `${wordmark}, Photographer` },
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSettings(),
  ]);

  return (
    <>
      <StructuredData data={personSchema(settings)} />
      <StructuredData data={websiteSchema(settings)} />
      <Header />
      <h1 className="visuallyHidden">
        {settings.wordmark}, photographer. Selected work.
      </h1>
      <Work projects={projects} />
    </>
  );
}
