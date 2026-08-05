import { cn } from "@/lib/utils";

/**
 * Progressive top blur under the brand toolbar only.
 * Page titles use `TitleScrim` inside `StickyPageChrome` so lists fade under
 * both zones without frosting the title text. Pointer-events none.
 */
export function HeaderScrim({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "header-scrim h-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:h-[4.75rem]",
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
