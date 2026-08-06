import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a scrollport — blurs and fades content at the top and bottom edges
 * as it scrolls underneath (pointer-events pass through to the scroller).
 */
export function ScrollFadeShell({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & { children: ReactNode }) {
  return (
    <div className={cn("scroll-fade-shell relative min-h-0", className)} {...props}>
      {children}
      <div aria-hidden className="scroll-fade-edge scroll-fade-edge-top" />
      <div aria-hidden className="scroll-fade-edge scroll-fade-edge-bottom" />
    </div>
  );
}
