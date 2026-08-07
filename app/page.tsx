import { Header } from "@/components/Header/Header";
import { Work } from "@/components/Work/Work";
import { getProjects } from "@/lib/content";

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <Work projects={projects} />
    </>
  );
}
