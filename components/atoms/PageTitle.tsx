import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { glassChipClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

interface PageTitleProps {
  icon: LucideIcon;
  title: string;
  /** Right-aligned control on the same row (e.g. Quick Log Clear). */
  trailing?: ReactNode;
  className?: string;
}

/**
 * Shared page heading — `font-display text-2xl` + leading cloudy-glass icon chip.
 */
export function PageTitle({ icon: Icon, title, trailing, className }: PageTitleProps) {
  return (
    <div className={cn("flex h-10 items-center justify-between gap-3", className)}>
      <h2 className="flex min-w-0 items-center gap-2.5 font-display text-2xl font-semibold text-ink">
        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
            glassChipClass(),
          )}
          aria-hidden
        >
          <Icon className="size-[1.125rem] text-flagblue-600" strokeWidth={2} />
        </span>
        <span className="truncate">{title}</span>
      </h2>
      {trailing}
    </div>
  );
}
