import { cn } from "@/lib/utils";

/**
 * Progressive blur for the sticky page-title band — same recipe as
 * `HeaderScrim`, shorter. Lists scrolling under the title soften here;
 * the title text sits above (`relative z-10`).
 */
export function TitleScrim({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("title-scrim", className)}>
      <div className="title-scrim__layer" data-strength="1" />
      <div className="title-scrim__layer" data-strength="2" />
      <div className="title-scrim__layer" data-strength="3" />
      <div className="title-scrim__tint" />
    </div>
  );
}
