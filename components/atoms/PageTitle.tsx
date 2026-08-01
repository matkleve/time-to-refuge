import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  /** Right-aligned control on the same row (e.g. Quick Log Clear). */
  trailing?: ReactNode;
  className?: string;
}

/**
 * Shared page heading — plain `font-display text-2xl` title.
 */
export function PageTitle({ title, trailing, className }: PageTitleProps) {
  return (
    <div className={cn("flex h-10 items-center justify-between gap-3", className)}>
      <h2 className="min-w-0 truncate font-display text-2xl font-semibold text-ink">
        {title}
      </h2>
      {trailing}
    </div>
  );
}
