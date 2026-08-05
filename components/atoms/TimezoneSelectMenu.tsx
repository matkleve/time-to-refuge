"use client";

import { createPortal } from "react-dom";
import type { RefObject } from "react";
import { controlMinH } from "@/lib/control-size";
import { formatTimezoneLabel } from "@/lib/timezone-options";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
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
            <button
              key={zone}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={(e) => {
                e.stopPropagation();
                onPick(zone);
              }}
              className={cn(
                "flex w-full items-center rounded-xl px-3.5 text-left text-base font-medium text-ink",
                controlMinH.md,
                userFeedbackClass({ press: "md", on: selected }),
                selected && "bg-white/40 font-semibold",
              )}
            >
              <span className="min-w-0 truncate">{formatTimezoneLabel(zone)}</span>
            </button>
          );
        })}
      </Surface>
    </div>,
    document.body,
  );
}
