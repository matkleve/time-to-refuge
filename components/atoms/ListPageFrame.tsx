import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListPageFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared chrome for open-backdrop utility pages (History, Fields, Dana).
 * Horizontal padding: phone owns it here; from `md` the shell `app-content`
 * pad is the single owner (avoid double inset).
 * Vertical scroll + header clearance live on the shell so content fades under
 * the progressive header scrim — this frame only stacks the page body.
 * Bottom pad clears the iOS Safari toolbar / home indicator so content isn’t
 * clipped under the browser chrome.
 */
export function ListPageFrame({ children, className }: ListPageFrameProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col px-3 pb-2 md:px-0",
        className,
      )}
      style={{
        paddingBottom:
          "max(2.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))",
      }}
    >
      {children}
    </div>
  );
}
