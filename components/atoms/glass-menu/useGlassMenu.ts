"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { clampPopoverHorizontal } from "@/lib/popover-placement";
import type { GlassMenuPrimaryAction, MenuBox } from "./types";
import { useGlassMenuDismiss } from "./useGlassMenuDismiss";
import { useGlassMenuPickers } from "./useGlassMenuPickers";

export function useGlassMenu({
  align,
  primaryAction,
}: {
  align: "left" | "right";
  primaryAction?: GlassMenuPrimaryAction;
}) {
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<MenuBox | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dismiss = useCallback(() => setOpen(false), []);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const minWidth = Math.max(192, r.width);
    const preferredLeft = align === "right" ? r.right - minWidth : r.left;
    const { left, width } = clampPopoverHorizontal(preferredLeft, minWidth);
    setBox({
      top: r.bottom + 6,
      left,
      minWidth: width,
    });
  }, [align]);

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

  useGlassMenuDismiss({ open, dismiss, triggerRef, panelRef });

  const { pick, pickIcon, onPrimarySelect, toggle } = useGlassMenuPickers({
    setOpen,
    primaryAction,
  });

  return {
    open,
    box,
    triggerRef,
    panelRef,
    pick,
    pickIcon,
    onPrimarySelect,
    toggle,
  };
}
