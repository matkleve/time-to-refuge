"use client";

import { Menu } from "lucide-react";
import { GlassMenu } from "@/components/atoms/GlassMenu";
import type { ButtonSize } from "@/components/atoms/button-classes";
import {
  buildViewMenuActions,
  buildViewMenuIconActions,
  buildViewMenuPages,
  buildViewMenuPrimaryAction,
} from "@/components/atoms/view-menu-sections";

export type AppView =
  | "home"
  | "refuge"
  | "quicklog"
  | "history"
  | "people"
  | "fields"
  | "dana";

interface ViewMenuProps {
  view: AppView;
  onChange: (view: AppView) => void;
  onUndo: () => void;
  undoDisabled?: boolean;
  undoLabel?: string;
  onRedo: () => void;
  redoDisabled?: boolean;
  redoLabel?: string;
  onExportAll: () => void;
  exportDisabled?: boolean;
  /** Hamburger chip — default `md` (same as row actions). */
  size?: ButtonSize;
}

/**
 * Hamburger → Pages, Actions, primary Dana CTA, then icon-only Undo / Redo.
 */
export function ViewMenu({
  view,
  onChange,
  onUndo,
  undoDisabled = false,
  undoLabel = "Undo",
  onRedo,
  redoDisabled = false,
  redoLabel = "Redo",
  onExportAll,
  exportDisabled = false,
  size = "md",
}: ViewMenuProps) {
  const pages = buildViewMenuPages(view, onChange);
  const actions = buildViewMenuActions(onExportAll, exportDisabled);
  const primaryAction = buildViewMenuPrimaryAction();
  const iconActions = buildViewMenuIconActions(
    onUndo,
    onRedo,
    undoDisabled,
    undoLabel,
    redoDisabled,
    redoLabel,
  );

  return (
    <GlassMenu
      label="Open menu"
      triggerIcon={Menu}
      triggerVariant="quiet"
      size={size}
      sections={[pages, actions]}
      primaryAction={primaryAction}
      iconActions={iconActions}
    />
  );
}
