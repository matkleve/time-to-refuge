import type { ReactNode } from "react";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import {
  DESKTOP_CLEARANCE_WITH_TITLE,
  MOBILE_HEADER_CLEARANCE,
  PAGE_INLINE_GUTTER,
} from "@/lib/chrome";
import { cn } from "@/lib/utils";

interface ListPageFrameProps {
  children: ReactNode;
  className?: string;
  /** Pinned under the app header — e.g. retreat name chip on Session / People. */
  pin?: ReactNode;
  /** Extra pinned block under the title (e.g. retreat chip). */
  pinBelow?: ReactNode;
  /**
   * `scroll` — document page (default): one scroller, lists fade under brand.
   * `workspace` — fixed viewport slot: pin + flex children (Session, Quick Log, Home).
   */
  fill?: "scroll" | "workspace";
  /** Page title is in `DesktopNav` — extra md+ clearance for nav + title band. */
  navPage?: boolean;
  /** Page owns StickyPageChrome internally — skip fallback header clearance. */
  selfClearance?: boolean;
  /** Page applies PAGE_INLINE_GUTTER internally — skip on body wrapper. */
  selfGutter?: boolean;
}

const HEADER_CLEARANCE = cn(MOBILE_HEADER_CLEARANCE, "md:pt-[4.5rem]");
const NAV_PAGE_CLEARANCE = cn(
  MOBILE_HEADER_CLEARANCE,
  DESKTOP_CLEARANCE_WITH_TITLE,
);

/**
 * Standard page frame inside the app shell: one column, one gutter, one
 * clearance model. Title + body share `PAGE_INLINE_GUTTER`.
 */
export function ListPageFrame({
  children,
  pin,
  pinBelow,
  className,
  fill = "scroll",
  navPage = false,
  selfClearance = false,
  selfGutter = false,
}: ListPageFrameProps) {
  const isWorkspace = fill === "workspace";
  const clearance = navPage ? NAV_PAGE_CLEARANCE : HEADER_CLEARANCE;

  return (
    <div
      className={cn(
        isWorkspace
          ? "flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden px-0"
          : "focus-safe-scroll h-full min-h-0 w-full flex-1 overflow-y-auto overscroll-contain px-0",
        className,
      )}
      style={
        isWorkspace
          ? undefined
          : {
              paddingBottom:
                "max(2.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))",
            }
      }
    >
      {pin || pinBelow ? (
        <StickyPageChrome below={pinBelow} belowHeaderTitle={navPage}>
          {pin}
        </StickyPageChrome>
      ) : null}
      <div
        className={cn(
          !selfGutter && PAGE_INLINE_GUTTER,
          isWorkspace && "flex min-h-0 flex-1 flex-col",
          !pin && !pinBelow && !selfClearance && clearance,
        )}
      >
        {children}
      </div>
    </div>
  );
}
