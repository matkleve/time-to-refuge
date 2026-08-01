import { cn } from "@/lib/utils";

/**
 * Progressive top blur — Cursor-style fade, not a hard glass bar.
 * Stacked backdrop-filter bands + a soft light tint so chrome can float
 * over scrolling content. Pointer-events none; toolbar sits above.
 */
export function HeaderScrim({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("header-scrim h-[7.5rem]", className)}>
      <div className="header-scrim__layer" data-strength="1" />
      <div className="header-scrim__layer" data-strength="2" />
      <div className="header-scrim__layer" data-strength="3" />
      <div className="header-scrim__layer" data-strength="4" />
      <div className="header-scrim__tint" />
    </div>
  );
}
