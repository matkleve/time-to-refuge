import type { Metadata } from "next";
import dana from "@/content/dana.json";
import { DanaApp } from "./DanaApp";

export const metadata: Metadata = {
  title: "Support DRCE",
  description: dana.intro,
  alternates: {
    canonical: "/dana",
  },
  openGraph: {
    title: "Support DRCE · Timekeeper",
    description: dana.intro,
    url: "/dana",
  },
};

export default function DanaRoute() {
  return <DanaApp />;
}
