"use client";

import type { GlassMenuItem, GlassMenuSection } from "./types";
import { MenuItemList } from "./MenuItemList";
import { UiMenuSection, UiMenuSectionHeader } from "@/components/ui";

export function MenuSections({
  sections,
  onPick,
}: {
  sections: GlassMenuSection[];
  onPick: (item: GlassMenuItem) => void;
}) {
  return (
    <>
      {sections.map((section, i) => (
        <UiMenuSection key={section.title}>
          {i > 0 ? (
            <div className="mx-2 my-1.5 border-t border-line" role="separator" />
          ) : null}
          <UiMenuSectionHeader>{section.title}</UiMenuSectionHeader>
          <MenuItemList items={section.items} onPick={onPick} />
        </UiMenuSection>
      ))}
    </>
  );
}
