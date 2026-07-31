import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared reveal timing — tray width only; pack spacer snaps (see below). */
const REVEAL_DURATION = "duration-300";
const REVEAL_EASE = "ease-out";

/**
 * Packs a stamp left without jumping: a flex spacer grows when idle (time on
 * the right) and collapses when open (time beside the label).
 *
 * **No width transition here.** `flex-grow` and the tray's `0fr`↔`1fr` do not
 * interpolate on the same curve, so animating both made the time race ahead
 * of the container. The spacer snaps; only `RowActionTray` animates width
 * (design system §5a).
 */
export function RowPackSpacer({ packed }: { packed: boolean }) {
  return (
    <span aria-hidden className={cn("min-w-0", packed ? "grow-0" : "grow")} />
  );
}

/**
 * Sibling action tray outside the glass stamp. `0fr` ↔ `1fr` grows to the
 * exact content width (`w-max` child). Opacity lags the open so chips are
 * never shown clipped mid-expand.
 */
export function RowActionTray({
  open,
  children,
  className,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-columns]",
        REVEAL_DURATION,
        REVEAL_EASE,
        open ? "grid-cols-[1fr]" : "grid-cols-[0fr] pointer-events-none",
        className,
      )}
      aria-hidden={!open}
    >
      <div className="min-w-0 overflow-hidden">
        <div
          className={cn(
            "flex w-max items-center gap-4 py-0.5 pl-2 pr-1.5",
            "transition-opacity",
            REVEAL_EASE,
            open
              ? "opacity-100 delay-100 duration-200"
              : "opacity-0 delay-0 duration-100",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
