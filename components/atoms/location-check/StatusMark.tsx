import type { ReactNode } from "react";
import { toneMark } from "@/lib/location-check/tone-styles";
import type { ProbeTone } from "@/lib/location-check/types";
import { cn } from "@/lib/utils";

export function StatusMark({
  tone,
  children,
  size = "sm",
}: {
  tone: ProbeTone;
  children: ReactNode;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        size === "sm" ? "size-7" : "size-12",
        toneMark[tone],
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}
