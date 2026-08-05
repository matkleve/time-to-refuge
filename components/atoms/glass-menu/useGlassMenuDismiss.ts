"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export function useGlassMenuDismiss({
  open,
  dismiss,
  triggerRef,
  panelRef,
}: {
  open: boolean;
  dismiss: () => void;
  triggerRef: RefObject<HTMLDivElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    if (!open) return;

    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(dismiss, 8000);
    };

    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) {
        arm();
        return;
      }
      dismiss();
    }

    arm();
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, dismiss, triggerRef, panelRef]);
}
