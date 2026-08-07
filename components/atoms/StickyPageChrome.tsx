import type { ReactNode } from "react";
import { PAGE_INLINE_GUTTER, MOBILE_HEADER_CLEARANCE, STICKY_CHROME_PT_BELOW_HEADER_TITLE, WORKSPACE_RETREAT_ALIGN } from "@/lib/chrome";
import { cn } from "@/lib/utils";

interface StickyPageChromeProps {
  children?: ReactNode;
  className?: string;
  /** Extra pinned block under the title (e.g. retreat chip). */
  below?: ReactNode;
  /** Page title is in `DesktopNav` — offset through nav + title band. */
  belowHeaderTitle?: boolean;
  /** Inside a workspace scroll column — sticky at scrollport top only. */
  inScrollport?: boolean;
  /** Skip `PAGE_INLINE_GUTTER` — parent column already owns mobile inset. */
  flushGutter?: boolean;
  /** Retreat pin above workspace rail — match rail scroll bleed on desktop. */
  workspacePin?: boolean;
}

/**
 * Pins optional page chrome under the floating app header (e.g. retreat chip).
 * Horizontal inset = `PAGE_INLINE_GUTTER` only (same edge as page body).
 */
export function StickyPageChrome({
  children,
  below,
  belowHeaderTitle = false,
  inScrollport = false,
  flushGutter = false,
  workspacePin = false,
  className,
}: StickyPageChromeProps) {
  const topClearance = belowHeaderTitle
    ? STICKY_CHROME_PT_BELOW_HEADER_TITLE
    : cn(MOBILE_HEADER_CLEARANCE, "md:pt-[4.5rem]");
  const inset = inScrollport || flushGutter ? undefined : PAGE_INLINE_GUTTER;

  return (
    <div
      className={cn(
        "pointer-events-none sticky top-0 z-20",
        !inScrollport && topClearance,
        className,
      )}
    >
      {children != null && children !== false ? (
        <div className={cn("pointer-events-auto relative pb-1", inset)}>
          {children}
        </div>
      ) : null}
      {below ? (
        <div
          className={cn(
            "pointer-events-auto relative pb-2",
            inset,
            workspacePin && WORKSPACE_RETREAT_ALIGN,
          )}
        >
          {below}
        </div>
      ) : null}
    </div>
  );
}
