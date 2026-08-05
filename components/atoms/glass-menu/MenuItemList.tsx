"use client";

import type { GlassMenuItem } from "./types";
import { MenuRows } from "./MenuRows";

/** Safe items first; any `tone: "danger"` items sit below a hairline. */
export function MenuItemList({
  items,
  onPick,
}: {
  items: GlassMenuItem[];
  onPick: (item: GlassMenuItem) => void;
}) {
  const safe = items.filter((item) => item.tone !== "danger");
  const danger = items.filter((item) => item.tone === "danger");
  return (
    <>
      <MenuRows items={safe} onPick={onPick} />
      {safe.length > 0 && danger.length > 0 && (
        <div className="mx-2 my-1.5 border-t border-line" role="separator" />
      )}
      <MenuRows items={danger} onPick={onPick} />
    </>
  );
}
