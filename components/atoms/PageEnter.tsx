import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Entrance for an AppView page. Remounts with the view key so each switch
 * fades once. Opacity only — translateY on a full-height page flashes a
 * document scrollbar and shoves the layout sideways.
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
        "relative flex h-full min-h-0 w-full flex-1 flex-col animate-fade-in",
        className,
      )}
    >
      {children}
    </div>
  );
}
