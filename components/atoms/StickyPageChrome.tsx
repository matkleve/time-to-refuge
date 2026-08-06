import type { ReactNode } from "react";
import { PAGE_INLINE_GUTTER, STICKY_CHROME_PT_BELOW_HEADER_TITLE } from "@/lib/chrome";
import { cn } from "@/lib/utils";

interface StickyPageChromeProps {
  children?: ReactNode;
  className?: string;
  /** Extra pinned block under the title (e.g. retreat chip). */
  below?: ReactNode;
  /** Page title is in `DesktopNav` — offset through nav + title band. */
  belowHeaderTitle?: boolean;
}

/**
 * Pins optional page chrome under the floating app header (e.g. retreat chip).
 * Horizontal inset = `PAGE_INLINE_GUTTER` only (same edge as page body).
 */
export function StickyPageChrome({
  children,
  below,
  belowHeaderTitle = false,
  className,
}: StickyPageChromeProps) {
  const topClearance = belowHeaderTitle
    ? STICKY_CHROME_PT_BELOW_HEADER_TITLE
    : cn(
        "pt-[calc(max(0.375rem,env(safe-area-inset-top,0px))+2.75rem+0.375rem)]",
        "md:pt-[4.5rem]",
      );

  return (
    <div
      className={cn(
        "pointer-events-none sticky top-0 z-20",
        topClearance,
        className,
      )}
    >
      {children != null && children !== false ? (
        <div
          className={cn(
            "pointer-events-auto relative pb-1",
            PAGE_INLINE_GUTTER,
          )}
        >
          {children}
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
