import type { Metadata } from "next";
import { BACKDROP_CLASS, backdropStyle } from "@/lib/backdrop";

export const metadata: Metadata = {
  title: "Components · Timekeeper",
  robots: { index: false, follow: false },
};

export default function DevComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-dvh ${BACKDROP_CLASS}`} style={backdropStyle}>
      {children}
    </div>
  );
}
