"use client";

import type { GlassMenuItem } from "./types";
import { UiMenuItem } from "@/components/ui";

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
        const armed = danger && !!item.selected;
        return (
          <UiMenuItem
            key={item.id}
            id={item.id}
            textValue={item.label}
            isDisabled={item.disabled}
            shouldCloseOnSelect={!item.keepOpen}
            danger={danger}
            armed={armed}
            onAction={() => onPick(item)}
          >
            <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
          </UiMenuItem>
        );
      })}
    </>
  );
}
