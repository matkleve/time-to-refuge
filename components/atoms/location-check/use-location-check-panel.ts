"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { PanelBox } from "@/lib/location-check/types";
import { PANEL_WIDTH } from "@/lib/location-check/tone-styles";
import {
  placePanelAboveTrigger,
} from "@/lib/popover-placement";

export function usePanelPlacement(open: boolean) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<PanelBox | null>(null);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const { left, bottom, width } = placePanelAboveTrigger(r, PANEL_WIDTH);
    setBox({ bottom, left, width });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  return { triggerRef, panelRef, box };
}

export function usePanelDismiss(
  open: boolean,
  onDismiss: () => void,
  panelRef: RefObject<HTMLDivElement | null>,
  triggerRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    if (!open) return;

    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(onDismiss, 16000);
    };

    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) {
        arm();
        return;
      }
      onDismiss();
    }

    arm();
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onDismiss, panelRef, triggerRef]);
}
