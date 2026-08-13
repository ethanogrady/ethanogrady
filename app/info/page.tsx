import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Info } from "@/components/Info/Info";
import { StructuredData } from "@/components/StructuredData/StructuredData";
import { getSettings } from "@/lib/content";
import { personSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const statement = settings.statement?.trim();

  return {
    title: "Info",
    description:
      statement ||
      `Contact and representation for ${settings.wordmark}, photographer. Selected clients and enquiries.`,
    alternates: { canonical: "/info" },
  };
}

export default async function InfoPage() {
  const settings = await getSettings();

  return (
    <>
      <StructuredData data={personSchema(settings)} />
      <Header />
      <h1 className="visuallyHidden">About {settings.wordmark}</h1>
      <Info settings={settings} />
    </>
  );
}
