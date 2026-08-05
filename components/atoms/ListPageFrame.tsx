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
 * Shared chrome for open-backdrop utility pages (History, Fields, Dana).
 * Full-bleed scroller under the floating header so lists pass through
 * brand + title scrims. Horizontal pad: phone here; from `md` the shell
 * `app-content` owns inset.
 */
export function ListPageFrame({ children, pin, className }: ListPageFrameProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 overflow-y-auto overscroll-contain md:px-0",
        className,
      )}
      style={{
        paddingBottom:
          "max(2.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))",
      }}
    >
      {pin ? <StickyPageChrome>{pin}</StickyPageChrome> : null}
      <div className={cn("px-3 md:px-0", !pin && "pt-[calc(max(0.375rem,env(safe-area-inset-top,0px))+2.75rem+0.375rem)] md:pt-[4.5rem]")}>
        {children}
      </div>
    </div>
  );
}
