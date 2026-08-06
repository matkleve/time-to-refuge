"use client";

import { useLayoutEffect, type RefObject } from "react";

/** Re-run placement on viewport changes and when the panel resizes. */
export function usePopoverReposition(
  open: boolean,
  place: () => void,
  panelRef: RefObject<HTMLElement | null>,
  panelMounted: boolean,
) {
  useLayoutEffect(() => {
    if (!open) return;
    place();
    if (!panelMounted) return;

    const panel = panelRef.current;
    const ro = panel ? new ResizeObserver(() => place()) : null;
    if (panel) ro?.observe(panel);

    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", place);
    vv?.addEventListener("scroll", place);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      vv?.removeEventListener("resize", place);
      vv?.removeEventListener("scroll", place);
    };
  }, [open, place, panelMounted, panelRef]);
}
