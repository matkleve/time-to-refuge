"use client";

import { createPortal } from "react-dom";
import type { RefObject } from "react";
import { Surface } from "@/components/atoms/Surface";
import type {
  GlassMenuIconAction,
  GlassMenuItem,
  GlassMenuPrimaryAction,
  GlassMenuSection,
  MenuBox,
} from "./types";
import { MenuIconStrip } from "./MenuIconStrip";
import { MenuItemList } from "./MenuItemList";
import { MenuPrimaryAction } from "./MenuPrimaryAction";
import { MenuSections } from "./MenuSections";

export function GlassMenuPanel({
  panelRef,
  box,
  label,
  sections,
  items,
  primaryAction,
  iconActions,
  onPick,
  onPickIcon,
  onPrimarySelect,
}: {
  panelRef: RefObject<HTMLDivElement | null>;
  box: MenuBox;
  label: string;
  sections?: GlassMenuSection[];
  items?: GlassMenuItem[];
  primaryAction?: GlassMenuPrimaryAction;
  iconActions?: GlassMenuIconAction[];
  onPick: (item: GlassMenuItem) => void;
  onPickIcon: (action: GlassMenuIconAction) => void;
  onPrimarySelect: () => void;
}) {
  if (typeof document === "undefined") return null;

  const body = sections?.length
    ? <MenuSections sections={sections} onPick={onPick} />
    : items
      ? <MenuItemList items={items} onPick={onPick} />
      : null;

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-50"
      style={{ top: box.top, left: box.left, minWidth: box.minWidth }}
    >
      <Surface
        material="glass-panel"
        rim
        role="menu"
        aria-label={label}
        className="overflow-hidden rounded-2xl p-1.5 shadow-lg animate-scale-in"
      >
        {body}
        {primaryAction != null && (
          <MenuPrimaryAction action={primaryAction} onSelect={onPrimarySelect} />
        )}
        {iconActions && iconActions.length > 0 && (
          <MenuIconStrip actions={iconActions} onPick={onPickIcon} />
        )}
      </Surface>
    </div>,
    document.body,
  );
}
