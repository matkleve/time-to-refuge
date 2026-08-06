import type { ReactNode } from "react";
import { controlH } from "@/lib/control-size";
import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  /** Right-aligned control on the same row (e.g. Fields Reset, Quick Log Clear). */
  trailing?: ReactNode;
  className?: string;
}

/**
 * In-page heading under the brand toolbar on desktop nav pages.
 * Mobile uses `HeaderTitle` in the shell — hide this row below `md`.
 */
export function PageTitle({ title, trailing, className }: PageTitleProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        controlH.md,
        className,
      )}
    >
      <h2 className="min-w-0 truncate font-display text-base font-semibold text-ink">
        {title}
      </h2>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
