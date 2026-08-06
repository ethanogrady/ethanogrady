import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { WorkList } from "@/components/WorkList/WorkList";

export const metadata: Metadata = {
  title: "List — Ethan O’Grady",
};

export default function ListPage() {
  return (
    <>
      <Header />
      <WorkList />
    </>
  );
}
