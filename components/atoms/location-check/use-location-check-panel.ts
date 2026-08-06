"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { PanelBox } from "@/lib/location-check/types";
import { PANEL_WIDTH } from "@/lib/location-check/tone-styles";
import { placePanelNearTrigger } from "@/lib/popover-placement";
import { usePopoverReposition } from "@/lib/use-popover-reposition";

export function usePanelPlacement(open: boolean) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<PanelBox | null>(null);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelHeight = panelRef.current?.getBoundingClientRect().height ?? 0;
    const placement = placePanelNearTrigger(r, PANEL_WIDTH, panelHeight);
    setBox(placement);
  }, []);

  usePopoverReposition(open, place, panelRef, box !== null);

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
