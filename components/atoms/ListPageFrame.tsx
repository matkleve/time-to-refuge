import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListPageFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared chrome for open-backdrop utility pages (History, Fields, Dana).
 * Matches Refuge / People subheader padding + safe-area bottom.
 */
export function ListPageFrame({ children, className }: ListPageFrameProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pt-2 sm:px-5 sm:pt-3",
        className,
      )}
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      {children}
    </div>
  );
}
