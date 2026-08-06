"use client";

import { Button } from "@/components/atoms/Button";
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
        const danger = item.tone === "danger";
        const armed = danger && item.selected;
        return (
          <Button
            key={item.id}
            variant="menuRow"
            icon={item.icon}
            role="menuitem"
            tone={danger ? "danger" : "neutral"}
            armed={armed}
            selected={item.selected}
            disabled={item.disabled}
            onClick={() => onPick(item)}
          >
            {item.label}
          </Button>
        );
      })}
    </>
  );
}
