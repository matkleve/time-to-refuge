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
 * In-page heading under the brand toolbar. Always visible — DesktopNav
 * marks the section, this names the page you’re in (Fields / History / …).
 * Hiding only the word on `md` left a frosted TitleScrim band with a lone
 * Reset/Clear chip and no title — that read as a random light shadow.
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
      <h2 className="min-w-0 truncate font-display text-lg font-semibold text-ink">
        {title}
      </h2>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
