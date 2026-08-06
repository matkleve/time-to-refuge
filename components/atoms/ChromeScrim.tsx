import { cn } from "@/lib/utils";

/**
 * Backdrop soften band — same recipe as the app header scrim.
 * Use behind pinned page chrome when list content scrolls underneath.
 */
export function ChromeScrim({ className }: { className?: string }) {
  return <div aria-hidden className={cn("chrome-scrim", className)} />;
}
