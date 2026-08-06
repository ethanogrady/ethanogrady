import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";

export const metadata: Metadata = {
  title: "Info — Ethan O’Grady",
};

export default function InfoPage() {
  return <Header />;
}
