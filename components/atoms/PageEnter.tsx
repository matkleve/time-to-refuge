import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Entrance for an AppView page (Refuge / Quick Log / History / People).
 * Remounts with the view key so each switch plays fade-in-up once.
 *
 * Fills the page slot (`flex-1` + `min-h-0`). The slot parent MUST be a
 * flex column — otherwise flex-1 is ignored, absolute pages get height 0,
 * and only overflowing crumbs (e.g. Quick Log stamp) paint on the backdrop.
 */
export function PageEnter({
  viewKey,
  children,
  className,
}: {
  viewKey: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      key={viewKey}
      className={cn(
        "relative flex h-full min-h-0 w-full flex-1 flex-col animate-fade-in-up",
        className,
      )}
    >
      {children}
    </div>
  );
}
