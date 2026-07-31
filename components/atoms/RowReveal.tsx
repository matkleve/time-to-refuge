import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Packs a stamp left without jumping: a flex spacer grows when idle (time on
 * the right) and collapses when open (time beside the label). `flex-grow`
 * interpolates; `margin-left: auto` does not (design system §5a).
 */
export function RowPackSpacer({ packed }: { packed: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "min-w-0 transition-[flex-grow] duration-200 ease-out",
        packed ? "grow-0" : "grow",
      )}
    />
  );
}

/**
 * Sibling action tray outside the glass stamp. `0fr` ↔ `1fr` grows to the
 * exact content width — unlike a large `max-width`, which overshoots.
 */
export function RowActionTray({
  open,
  children,
  className,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-columns,opacity] duration-200 ease-out",
        open ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0",
        className,
      )}
      aria-hidden={!open}
    >
      <div className="min-w-0 overflow-hidden">
        <div className="flex items-center gap-4 py-0.5 pl-2 pr-1.5">{children}</div>
      </div>
    </div>
  );
}
