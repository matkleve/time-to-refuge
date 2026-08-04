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
 * Shared page heading — centered `font-display text-2xl` title.
 * Brand stays in the header above; this row is the page name only.
 * With `trailing`, a 3-col grid keeps the title centered.
 */
export function PageTitle({ title, trailing, className }: PageTitleProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-3",
        controlH.md,
        trailing ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-1",
        className,
      )}
    >
      {trailing ? <span aria-hidden className="min-w-0" /> : null}
      <h2
        className={cn(
          "min-w-0 truncate text-center font-display text-2xl font-semibold text-ink",
          trailing && "justify-self-center",
        )}
      >
        {title}
      </h2>
      {trailing ? <div className="justify-self-end">{trailing}</div> : null}
    </div>
  );
}
