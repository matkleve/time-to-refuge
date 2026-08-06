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

export type PanelPlacement =
  | { side: "above"; bottom: number; left: number; width: number; maxHeight: number }
  | { side: "below"; top: number; left: number; width: number; maxHeight: number }
  | { side: "left"; top: number; left: number; width: number; maxHeight: number }
  | { side: "right"; top: number; left: number; width: number; maxHeight: number };

const PANEL_MAX_HEIGHT = 28 * 16; // 28rem
const MIN_VERTICAL_SPACE = 120;

function verticalMaxHeight(
  vp: ViewportBounds,
  margin: number,
  top: number,
): number {
  return Math.min(PANEL_MAX_HEIGHT, vp.top + vp.height - margin - top);
}

function clampPanelTop(
  triggerTop: number,
  panelHeight: number,
  vp: ViewportBounds,
  margin: number,
): number {
  let top = triggerTop;
  if (panelHeight > 0) {
    top = Math.min(top, vp.top + vp.height - margin - panelHeight);
  }
  return Math.max(vp.top + margin, top);
}

function placeAbove(
  triggerRect: DOMRect,
  panelWidth: number,
  spaceAbove: number,
  gap: number,
  margin: number,
  vp: ViewportBounds,
): PanelPlacement {
  const { left, width } = clampPopoverHorizontal(
    triggerRect.right - panelWidth,
    panelWidth,
    margin,
  );
  const preferredBottom = vp.top + vp.height - triggerRect.top + gap;
  return {
    side: "above",
    bottom: preferredBottom,
    left,
    width,
    maxHeight: Math.min(PANEL_MAX_HEIGHT, spaceAbove),
  };
}

function placeBelow(
  triggerRect: DOMRect,
  panelWidth: number,
  spaceBelow: number,
  gap: number,
  margin: number,
  vp: ViewportBounds,
  panelHeight: number,
): PanelPlacement {
  const { left, width } = clampPopoverHorizontal(
    triggerRect.right - panelWidth,
    panelWidth,
    margin,
  );
  const top = clampPanelTop(triggerRect.bottom + gap, panelHeight, vp, margin);
  return {
    side: "below",
    top,
    left,
    width,
    maxHeight: Math.min(PANEL_MAX_HEIGHT, spaceBelow),
  };
}

function placeBeside(
  triggerRect: DOMRect,
  panelWidth: number,
  spaceLeft: number,
  spaceRight: number,
  gap: number,
  margin: number,
  vp: ViewportBounds,
  panelHeight: number,
): PanelPlacement {
  const useLeft = spaceLeft >= spaceRight;
  const preferredLeft = useLeft
    ? triggerRect.left - gap - panelWidth
    : triggerRect.right + gap;
  const { left, width } = clampPopoverHorizontal(preferredLeft, panelWidth, margin);
  const top = clampPanelTop(triggerRect.top, panelHeight, vp, margin);
  return {
    side: useLeft ? "left" : "right",
    top,
    left,
    width,
    maxHeight: verticalMaxHeight(vp, margin, top),
  };
}

/** Panel near trigger — above, beside, or below. Never covers trigger. */
export function placePanelNearTrigger(
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight = 0,
  gap = POPOVER_MARGIN,
  margin = POPOVER_MARGIN,
): PanelPlacement {
  const vp = getViewportBounds();

  const spaceAbove = Math.max(0, triggerRect.top - gap - (vp.top + margin));
  const spaceBelow = Math.max(
    0,
    vp.top + vp.height - margin - (triggerRect.bottom + gap),
  );
  const spaceLeft = Math.max(0, triggerRect.left - gap - (vp.left + margin));
  const spaceRight = Math.max(
    0,
    vp.left + vp.width - margin - (triggerRect.right + gap),
  );

  const fitsAbove =
    panelHeight === 0
      ? spaceAbove >= MIN_VERTICAL_SPACE
      : panelHeight <= spaceAbove;
  const fitsBelow =
    panelHeight === 0
      ? spaceBelow >= MIN_VERTICAL_SPACE
      : panelHeight <= spaceBelow;
  const fitsBeside = spaceLeft >= panelWidth || spaceRight >= panelWidth;

  if (fitsAbove) {
    return placeAbove(triggerRect, panelWidth, spaceAbove, gap, margin, vp);
  }
  if (fitsBeside) {
    return placeBeside(
      triggerRect,
      panelWidth,
      spaceLeft,
      spaceRight,
      gap,
      margin,
      vp,
      panelHeight,
    );
  }
  if (fitsBelow) {
    return placeBelow(
      triggerRect,
      panelWidth,
      spaceBelow,
      gap,
      margin,
      vp,
      panelHeight,
    );
  }

  const viewportHeight = vp.height - margin * 2;
  const options: Array<{ score: number; placement: PanelPlacement }> = [
    {
      score: spaceAbove * panelWidth,
      placement: placeAbove(triggerRect, panelWidth, spaceAbove, gap, margin, vp),
    },
    {
      score: spaceBelow * panelWidth,
      placement: placeBelow(
        triggerRect,
        panelWidth,
        spaceBelow,
        gap,
        margin,
        vp,
        panelHeight,
      ),
    },
    {
      score: spaceLeft * viewportHeight,
      placement: placeBeside(
        triggerRect,
        panelWidth,
        spaceLeft,
        spaceRight,
        gap,
        margin,
        vp,
        panelHeight,
      ),
    },
    {
      score: spaceRight * viewportHeight,
      placement: placeBeside(
        triggerRect,
        panelWidth,
        spaceRight,
        spaceLeft,
        gap,
        margin,
        vp,
        panelHeight,
      ),
    },
  ];

  return options.reduce((best, option) =>
    option.score > best.score ? option : best,
  ).placement;
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
