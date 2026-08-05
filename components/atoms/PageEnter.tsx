import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Entrance for an AppView page (Refuge / Quick Log / History / People).
 * Remounts with the view key so each switch plays fade-in-up once.
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
        "relative flex min-h-0 flex-1 flex-col animate-fade-in-up",
        className,
      )}
    >
      {children}
    </div>
  );
}
