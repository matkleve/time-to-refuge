"use client";

import { useCallback } from "react";
import type {
  GlassMenuIconAction,
  GlassMenuItem,
  GlassMenuPrimaryAction,
  GlassMenuSection,
} from "./types";
import { MenuIconStrip } from "./MenuIconStrip";
import { MenuItemList } from "./MenuItemList";
import { MenuPrimaryAction } from "./MenuPrimaryAction";
import { MenuSections } from "./MenuSections";
import { UiMenu } from "@/components/ui";

export function GlassMenuBody({
  label,
  items,
  sections,
  primaryAction,
  iconActions,
  onPrimarySelect,
}: {
  label: string;
  items?: GlassMenuItem[];
  sections?: GlassMenuSection[];
  primaryAction?: GlassMenuPrimaryAction;
  iconActions?: GlassMenuIconAction[];
  onPrimarySelect: () => void;
}) {
  const pick = useCallback(
    (item: GlassMenuItem) => {
      item.onSelect();
    },
    [],
  );

  const pickIcon = useCallback((action: GlassMenuIconAction) => {
    action.onSelect();
  }, []);

  const body = sections?.length ? (
    <MenuSections sections={sections} onPick={pick} />
  ) : items ? (
    <MenuItemList items={items} onPick={pick} />
  ) : null;

  return (
    <>
      <UiMenu aria-label={label} shouldCloseOnSelect>
        {body}
      </UiMenu>
      {primaryAction != null && (
        <MenuPrimaryAction action={primaryAction} onSelect={onPrimarySelect} />
      )}
      {iconActions && iconActions.length > 0 && (
        <MenuIconStrip actions={iconActions} onPick={pickIcon} />
      )}
    </>
  );
}
