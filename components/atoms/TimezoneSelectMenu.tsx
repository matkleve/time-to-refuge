"use client";

import { createPortal } from "react-dom";
import type { RefObject } from "react";
import { formatTimezoneLabel } from "@/lib/timezone-options";
import { Button } from "@/components/atoms/Button";
import { Surface } from "@/components/atoms/Surface";

export type TimezoneMenuBox = {
  top: number;
  left: number;
  width: number;
};

export function TimezoneSelectMenu({
  panelRef,
  box,
  zones,
  value,
  onPick,
}: {
  panelRef: RefObject<HTMLDivElement | null>;
  box: TimezoneMenuBox;
  zones: string[];
  value: string;
  onPick: (zone: string) => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-50"
      style={{ top: box.top, left: box.left, width: box.width }}
    >
      <Surface
        material="glass-panel"
        rim
        role="listbox"
        aria-label="Time zones"
        className="focus-safe-scroll max-h-64 overflow-y-auto rounded-2xl p-1.5 animate-scale-in"
      >
        {zones.map((zone) => {
          const selected = zone === value;
          return (
            <Button
              key={zone}
              variant="menuRow"
              role="option"
              aria-selected={selected}
              selected={selected}
              onClick={(e) => {
                e.stopPropagation();
                onPick(zone);
              }}
            >
              <span className="min-w-0 truncate">{formatTimezoneLabel(zone)}</span>
            </Button>
          );
        })}
      </Surface>
    </div>,
    document.body,
  );
}
