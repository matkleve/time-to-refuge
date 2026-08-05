"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { TimezoneMenuBox } from "@/components/atoms/TimezoneSelectMenu";
import { useGlassMenuDismiss } from "@/components/atoms/glass-menu/useGlassMenuDismiss";
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
    setBox({ top: r.bottom + 6, left: r.left, width: r.width });
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
