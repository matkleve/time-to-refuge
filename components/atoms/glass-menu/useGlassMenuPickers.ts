"use client";

import { useCallback } from "react";
import type { GlassMenuPrimaryAction } from "./types";

export function useGlassMenuPickers({
  setOpen,
  primaryAction,
}: {
  setOpen: (value: boolean | ((v: boolean) => boolean)) => void;
  primaryAction?: GlassMenuPrimaryAction;
}) {
  const pick = useCallback(
    (item: { onSelect: () => void; keepOpen?: boolean }) => {
      item.onSelect();
      if (!item.keepOpen) setOpen(false);
    },
    [setOpen],
  );

  const pickIcon = useCallback(
    (action: { onSelect: () => void; keepOpen?: boolean }) => {
      action.onSelect();
      if (!action.keepOpen) setOpen(false);
    },
    [setOpen],
  );

  const onPrimarySelect = useCallback(() => {
    if (!primaryAction || primaryAction.href || !primaryAction.onSelect) return;
    primaryAction.onSelect();
    setOpen(false);
  }, [primaryAction, setOpen]);

  const toggle = useCallback(() => setOpen((v) => !v), [setOpen]);

  return { pick, pickIcon, onPrimarySelect, toggle };
}
