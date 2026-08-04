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
 * Shared page heading. On phone: centered title (+ trailing).
 * From `md` up, DesktopNav owns the page name — hide the heading; keep
 * trailing actions right-aligned when present.
 */
export function PageTitle({ title, trailing, className }: PageTitleProps) {
  return (
    <div
      className={cn(
        controlH.md,
        trailing
          ? "grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:flex md:justify-end"
          : "grid grid-cols-1 items-center md:hidden",
        className,
      )}
    >
      {trailing ? <span aria-hidden className="min-w-0 md:hidden" /> : null}
      <h2
        className={cn(
          "min-w-0 truncate text-center font-display text-2xl font-semibold text-ink",
          trailing && "md:hidden",
        )}
      >
        {title}
      </h2>
      {trailing ? (
        <div className="justify-self-end md:justify-self-auto">{trailing}</div>
      ) : null}
    </div>
  );
}
