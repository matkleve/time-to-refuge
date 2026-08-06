/** Keep portaled popovers inside the visible viewport (incl. visualViewport). */

export const POPOVER_MARGIN = 16;

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

export type VerticalPanelPlacement =
  | { side: "above"; bottom: number }
  | { side: "below"; top: number };

const PANEL_MAX_HEIGHT = 28 * 16; // 28rem

/** Panel beside trigger — prefers above; flips below when needed. Never covers trigger. */
export function placePanelNearTrigger(
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight = 0,
  gap = POPOVER_MARGIN,
  margin = POPOVER_MARGIN,
): { left: number; width: number; maxHeight: number } & VerticalPanelPlacement {
  const vp = getViewportBounds();
  const { left, width } = clampPopoverHorizontal(
    triggerRect.right - panelWidth,
    panelWidth,
    margin,
  );

  const spaceAbove = Math.max(0, triggerRect.top - gap - (vp.top + margin));
  const spaceBelow = Math.max(
    0,
    vp.top + vp.height - margin - (triggerRect.bottom + gap),
  );
  const preferredBottom = vp.top + vp.height - triggerRect.top + gap;

  const fitsAbove = panelHeight === 0 || panelHeight <= spaceAbove;
  const fitsBelow = panelHeight === 0 || panelHeight <= spaceBelow;
  const useAbove = fitsAbove
    ? true
    : fitsBelow
      ? false
      : spaceAbove >= spaceBelow;

  const maxHeight = Math.min(PANEL_MAX_HEIGHT, useAbove ? spaceAbove : spaceBelow);

  if (useAbove) {
    return { side: "above", bottom: preferredBottom, left, width, maxHeight };
  }

  return {
    side: "below",
    top: triggerRect.bottom + gap,
    left,
    width,
    maxHeight,
  };
}

/** Dropdown below trigger — match trigger width, clamp horizontal. */
export function placeMenuBelowTrigger(
  triggerRect: DOMRect,
  panelHeight = 0,
  gap = 6,
  margin = POPOVER_MARGIN,
): { top: number; left: number; width: number } {
  const { left, width } = clampPopoverHorizontal(
    triggerRect.left,
    triggerRect.width,
    margin,
  );
  const vp = getViewportBounds();
  let top = triggerRect.bottom + gap;
  if (panelHeight > 0) {
    top = Math.min(top, vp.top + vp.height - margin - panelHeight);
  }
  top = Math.max(vp.top + margin, top);
  return { top, left, width };
}
