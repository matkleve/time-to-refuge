import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageTitleProps {
  icon: LucideIcon;
  title: string;
  /** Right-aligned control on the same row (e.g. Quick Log Clear). */
  trailing?: ReactNode;
  className?: string;
}

/**
 * Shared page heading — `font-display text-2xl` + leading icon.
 * Used by People, Quick Log, History, Fields, Dana (and Refuge when titled).
 */
export function PageTitle({ icon: Icon, title, trailing, className }: PageTitleProps) {
  return (
    <div className={cn("flex h-10 items-center justify-between gap-3", className)}>
      <h2 className="flex min-w-0 items-center gap-2.5 font-display text-2xl font-semibold text-ink">
        <Icon
          className="size-6 shrink-0 text-flagblue-600"
          strokeWidth={2}
          aria-hidden
        />
        <span className="truncate">{title}</span>
      </h2>
      {trailing}
    </div>
  );
}
