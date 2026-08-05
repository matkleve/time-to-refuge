import type { ReactNode } from "react";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
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
 *
 * `shrink-0` — the stamp is `flex-1 min-w-0`; without this the tray collapses
 * and `overflow-hidden` slices the chips (and their shadows) mid-circle.
 * When open, overflow is visible so glass specular isn’t clipped.
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
        "grid shrink-0 transition-[grid-template-columns]",
        REVEAL_DURATION,
        REVEAL_EASE,
        open ? "grid-cols-[1fr]" : "grid-cols-[0fr] pointer-events-none",
        className,
      )}
      aria-hidden={!open}
    >
      <div className={cn(open ? "overflow-visible" : "min-w-0 overflow-hidden")}>
        <div
          className={cn(
            "flex w-max items-center py-1 pr-1.5",
            BUTTON_CLUSTER_GAP,
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
