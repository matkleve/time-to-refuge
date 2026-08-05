import type { ReactNode } from "react";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import { PAGE_INLINE_GUTTER } from "@/lib/chrome";
import { cn } from "@/lib/utils";

interface ListPageFrameProps {
  children: ReactNode;
  className?: string;
  /** Pinned under the brand toolbar — usually a `PageTitle` (+ blurb). */
  pin?: ReactNode;
}

/**
 * Normal document page inside the app shell: fill the PageEnter slot and
 * scroll. Title + body share `PAGE_INLINE_GUTTER` — one column, one edge.
 */
export function ListPageFrame({ children, pin, className }: ListPageFrameProps) {
  return (
    <div
      className={cn(
        "focus-safe-scroll h-full min-h-0 w-full flex-1 overflow-y-auto overflow-x-clip overscroll-contain px-0",
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
          PAGE_INLINE_GUTTER,
          !pin &&
            "pt-[calc(max(0.375rem,env(safe-area-inset-top,0px))+2.75rem+0.375rem)] md:pt-[4.5rem]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
