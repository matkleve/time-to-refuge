import { cn } from "@/lib/utils";

/**
 * Progressive top blur — Cursor-style fade, not a hard glass bar.
 * Tall enough to wash under brand + page title, then soft out above the
 * first content row. Pointer-events none; toolbar sits above.
 */
export function HeaderScrim({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "header-scrim h-[calc(env(safe-area-inset-top,0px)+8.5rem)]",
        className,
      )}
    >
      <div className="header-scrim__layer" data-strength="1" />
      <div className="header-scrim__layer" data-strength="2" />
      <div className="header-scrim__layer" data-strength="3" />
      <div className="header-scrim__layer" data-strength="4" />
      <div className="header-scrim__tint" />
    </div>
  );
}
