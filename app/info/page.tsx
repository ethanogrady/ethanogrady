import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Info } from "@/components/Info/Info";
import { getSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { wordmark } = await getSettings();
  return { title: `Info - ${wordmark}` };
}

export default async function InfoPage() {
  const settings = await getSettings();

  return (
    <>
      <Header />
      <Info settings={settings} />
    </>
  );
}
