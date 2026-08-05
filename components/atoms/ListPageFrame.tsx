import type { ReactNode } from "react";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import { cn } from "@/lib/utils";

interface ListPageFrameProps {
  children: ReactNode;
  className?: string;
  /** Pinned under the brand toolbar — usually a `PageTitle` (+ blurb). */
  pin?: ReactNode;
}

/**
 * Normal document page inside the app shell: fill the PageEnter slot and
 * scroll. Ordinary flex-child fill (h-full + flex-1) — not a positioned
 * overlay. History, Fields, and Dana share this frame.
 */
export function ListPageFrame({ children, pin, className }: ListPageFrameProps) {
  return (
    <div
      className={cn(
        "focus-safe-scroll h-full min-h-0 w-full flex-1 overflow-y-auto overflow-x-clip overscroll-contain md:px-0",
        className,
      )}
      style={{
        paddingBottom:
          "max(2.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))",
      }}
    >
      {pin ? <StickyPageChrome>{pin}</StickyPageChrome> : null}
      <div
        className={cn(
          "px-3 md:px-0",
          !pin &&
            "pt-[calc(max(0.375rem,env(safe-area-inset-top,0px))+2.75rem+0.375rem)] md:pt-[4.5rem]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
