"use client";

import {
  Clock,
  Contact,
  Download,
  HeartHandshake,
  History,
  ListTree,
  Menu,
  Redo2,
  Undo2,
  Users,
} from "lucide-react";
import {
  GlassMenu,
  type GlassMenuIconAction,
  type GlassMenuPrimaryAction,
  type GlassMenuSection,
} from "@/components/atoms/GlassMenu";
import type { IconButtonSize } from "@/components/atoms/IconButton";
import dana from "@/content/dana.json";

export type AppView = "refuge" | "quicklog" | "history" | "people" | "fields" | "dana";

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
  size?: IconButtonSize;
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
  const pages: GlassMenuSection = {
    title: "Pages",
    items: [
      {
        id: "refuge",
        label: "Refuge",
        icon: Users,
        selected: view === "refuge",
        onSelect: () => onChange("refuge"),
      },
      {
        id: "quicklog",
        label: "Quick Log",
        icon: Clock,
        selected: view === "quicklog",
        onSelect: () => onChange("quicklog"),
      },
      {
        id: "history",
        label: "History",
        icon: History,
        selected: view === "history",
        onSelect: () => onChange("history"),
      },
      {
        id: "people",
        label: "People",
        icon: Contact,
        selected: view === "people",
        onSelect: () => onChange("people"),
      },
      {
        id: "fields",
        label: "Fields",
        icon: ListTree,
        selected: view === "fields",
        onSelect: () => onChange("fields"),
      },
    ],
  };

  const actions: GlassMenuSection = {
    title: "Actions",
    items: [
      {
        id: "export",
        label: "Export all",
        icon: Download,
        disabled: exportDisabled,
        onSelect: onExportAll,
      },
    ],
  };

  const primaryAction: GlassMenuPrimaryAction = {
    id: "dana",
    label: dana.menuCta,
    icon: HeartHandshake,
    selected: view === "dana",
    onSelect: () => onChange("dana"),
  };

  const iconActions: GlassMenuIconAction[] = [
    {
      id: "undo",
      label: undoLabel,
      icon: Undo2,
      disabled: undoDisabled,
      onSelect: onUndo,
      keepOpen: true,
    },
    {
      id: "redo",
      label: redoLabel,
      icon: Redo2,
      disabled: redoDisabled,
      onSelect: onRedo,
      keepOpen: true,
    },
  ];

  return (
    <GlassMenu
      label="Open menu"
      triggerIcon={Menu}
      size={size}
      sections={[pages, actions]}
      primaryAction={primaryAction}
      iconActions={iconActions}
    />
  );
}
