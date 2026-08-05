"use client";

import { controlMinH } from "@/lib/control-size";
import { armedDestroyClass, userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import type { GlassMenuItem } from "./types";

export function MenuRows({
  items,
  onPick,
}: {
  items: GlassMenuItem[];
  onPick: (item: GlassMenuItem) => void;
}) {
  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const danger = item.tone === "danger";
        const armed = danger && item.selected;
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => onPick(item)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3.5 text-left text-base font-medium",
              controlMinH.md,
              "disabled:pointer-events-none disabled:opacity-35",
              /* Chrome recipe: wash + bounce only — no second hover:bg. */
              userFeedbackClass({ press: "md", on: item.selected }),
              /* Destroy arm: same filled chip as IconButton.armed. */
              armed
                ? armedDestroyClass
                : danger
                  ? "text-danger-700"
                  : "text-ink",
            )}
          >
            <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
          </button>
        );
      })}
    </>
  );
}
