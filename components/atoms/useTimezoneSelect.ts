"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { TimezoneMenuBox } from "@/components/atoms/TimezoneSelectMenu";
import { useGlassMenuDismiss } from "@/components/atoms/glass-menu/useGlassMenuDismiss";
import { placeMenuBelowTrigger } from "@/lib/popover-placement";
import { usePopoverReposition } from "@/lib/use-popover-reposition";
import { listTimezones } from "@/lib/timezone-options";

export function useTimezoneSelect(value: string, onChange: (tz: string) => void) {
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<TimezoneMenuBox | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  const zones = useMemo(() => listTimezones(value), [value]);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelHeight = panelRef.current?.getBoundingClientRect().height ?? 0;
    setBox(placeMenuBelowTrigger(r, panelHeight));
  }, []);

  usePopoverReposition(open, place, panelRef, box !== null);

  useGlassMenuDismiss({ open, dismiss: close, triggerRef, panelRef });

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen((o) => !o);
  }

  function pick(zone: string) {
    onChange(zone);
    close();
  }

  return { open, box, zones, triggerRef, panelRef, toggle, pick };
}
