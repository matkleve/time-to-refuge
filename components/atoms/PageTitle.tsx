import type { ReactNode } from "react";
import { controlH } from "@/lib/control-size";
import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  /** Right-aligned control on the same row (e.g. Quick Log Clear). */
  trailing?: ReactNode;
  className?: string;
}

/**
 * Shared page heading — left-aligned `font-display text-lg` (retreat chip
 * sits under it on Session / People). Person names stay `text-2xl`; page
 * titles stay a step below. From `md` up, DesktopNav owns the page name:
 * hide the heading; keep trailing actions when present.
 */
export function PageTitle({ title, trailing, className }: PageTitleProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        controlH.md,
        !trailing && "md:hidden",
        className,
      )}
    >
      <h2
        className={cn(
          "min-w-0 truncate font-display text-lg font-semibold text-ink",
          trailing && "md:hidden",
        )}
      >
        {title}
      </h2>
      {trailing ? <div className="shrink-0 md:ml-auto">{trailing}</div> : null}
    </div>
  );
}
