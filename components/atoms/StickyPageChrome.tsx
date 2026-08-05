import type { ReactNode } from "react";
import { TitleScrim } from "@/components/atoms/TitleScrim";
import { PAGE_INLINE_GUTTER } from "@/lib/chrome";
import { cn } from "@/lib/utils";

interface StickyPageChromeProps {
  children?: ReactNode;
  className?: string;
  /** Extra pinned block under the title (e.g. retreat chip). */
  below?: ReactNode;
}

/**
 * Pins page title under the floating brand toolbar.
 * Parent must be a full-bleed scroller that extends under the header so
 * lists pass behind brand (`HeaderScrim`) and this title (`TitleScrim`).
 * Horizontal inset = `PAGE_INLINE_GUTTER` only (same edge as page body).
 */
export function StickyPageChrome({
  children,
  below,
  className,
}: StickyPageChromeProps) {
  return (
    <div
      className={cn(
        "pointer-events-none sticky top-0 z-20",
        /* Brand toolbar offset — matches `lib/chrome.ts`. */
        "pt-[calc(max(0.375rem,env(safe-area-inset-top,0px))+2.75rem+0.375rem)]",
        "md:pt-[4.5rem]",
        className,
      )}
    >
      {children != null && children !== false ? (
        <div className="relative">
          <TitleScrim className="absolute inset-0" />
          <div
            className={cn(
              "pointer-events-auto relative pb-1 pt-2 md:pt-3",
              PAGE_INLINE_GUTTER,
            )}
          >
            {children}
          </div>
        </div>
      ) : null}
      {below ? (
        <div
          className={cn(
            "pointer-events-auto relative pb-2",
            PAGE_INLINE_GUTTER,
          )}
        >
          {below}
        </div>
      ) : null}
    </div>
  );
}
