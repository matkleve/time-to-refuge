import { cn } from "@/lib/utils";

/**
 * Single soften band under the brand toolbar. One blur + fade — not a
 * stack of progressive layers. Pointer-events none.
 */
export function HeaderScrim({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "header-scrim h-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:h-[4.75rem]",
        className,
      )}
    />
  );
}
