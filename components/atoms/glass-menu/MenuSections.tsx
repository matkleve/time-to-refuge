"use client";

import type { GlassMenuItem, GlassMenuSection } from "./types";
import { MenuItemList } from "./MenuItemList";

export function MenuSections({
  sections,
  onPick,
}: {
  sections: GlassMenuSection[];
  onPick: (item: GlassMenuItem) => void;
}) {
  return sections.map((section, i) => (
    <div key={section.title}>
      {i > 0 && <div className="mx-2 my-1.5 border-t border-line" role="separator" />}
      <p className="px-3 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wide text-muted">
        {section.title}
      </p>
      <MenuItemList items={section.items} onPick={onPick} />
    </div>
  ));
}
