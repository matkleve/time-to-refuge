/** Keep portaled popovers inside the visible viewport (incl. visualViewport). */

export const POPOVER_MARGIN = 8;

export type ViewportBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function getViewportBounds(): ViewportBounds {
  const vv = window.visualViewport;
  if (vv) {
    return {
      left: vv.offsetLeft,
      top: vv.offsetTop,
      width: vv.width,
      height: vv.height,
    };
  }
  return {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/** Clamp a fixed panel horizontally; shrink width on narrow viewports. */
export function clampPopoverHorizontal(
  preferredLeft: number,
  preferredWidth: number,
  margin = POPOVER_MARGIN,
): { left: number; width: number } {
  const vp = getViewportBounds();
  const maxWidth = Math.max(0, vp.width - margin * 2);
  const width = Math.min(preferredWidth, maxWidth);
  const minLeft = vp.left + margin;
  const maxLeft = Math.max(minLeft, vp.left + vp.width - width - margin);
  const left = Math.min(Math.max(minLeft, preferredLeft), maxLeft);
  return { left, width };
}

/** Panel above trigger — right edges align when space allows. */
export function placePanelAboveTrigger(
  triggerRect: DOMRect,
  panelWidth: number,
  gap = POPOVER_MARGIN,
): { left: number; bottom: number; width: number } {
  const vp = getViewportBounds();
  const { left, width } = clampPopoverHorizontal(
    triggerRect.right - panelWidth,
    panelWidth,
  );
  const bottom = Math.max(
    gap,
    vp.top + vp.height - triggerRect.top + gap,
  );
  return { left, bottom, width };
}

/** Dropdown below trigger — match trigger width, clamp horizontal. */
export function placeMenuBelowTrigger(
  triggerRect: DOMRect,
  gap = 6,
): { top: number; left: number; width: number } {
  const { left, width } = clampPopoverHorizontal(triggerRect.left, triggerRect.width);
  const vp = getViewportBounds();
  const top = Math.min(
    triggerRect.bottom + gap,
    vp.top + vp.height - marginBottomReserve(vp.height),
  );
  return { top, left, width };
}

/** Leave room for at least one menu row when clamping vertical open-down. */
function marginBottomReserve(viewportHeight: number): number {
  return Math.min(120, Math.max(48, viewportHeight * 0.25));
}
