import type { Metadata } from "next";
import privacy from "@/content/privacy.json";
import { PrivacyApp } from "./PrivacyApp";

export const metadata: Metadata = {
  title: "Privacy",
  description: privacy.intro,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy · Timekeeper",
    description: privacy.intro,
    url: "/privacy",
  },
};

export default function PrivacyRoute() {
  return <PrivacyApp />;
}
