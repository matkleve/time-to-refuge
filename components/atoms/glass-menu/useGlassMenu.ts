"use client";

import { useCallback, useRef, useState } from "react";
import { clampPopoverHorizontal, placeMenuBelowTrigger } from "@/lib/popover-placement";
import { usePopoverReposition } from "@/lib/use-popover-reposition";
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
    const panelHeight = panelRef.current?.getBoundingClientRect().height ?? 0;
    const minWidth = Math.max(192, r.width);
    const preferredLeft = align === "right" ? r.right - minWidth : r.left;
    const { left, width } = clampPopoverHorizontal(preferredLeft, minWidth);
    const { top } = placeMenuBelowTrigger(r, panelHeight);
    setBox({
      top,
      left,
      minWidth: width,
    });
  }, [align]);

  usePopoverReposition(open, place, panelRef, box !== null);

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
