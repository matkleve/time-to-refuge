"use client";

import { Clock, Contact, Download, History, Menu, Redo2, Undo2, Users } from "lucide-react";
import {
  GlassMenu,
  type GlassMenuIconAction,
  type GlassMenuSection,
} from "@/components/atoms/GlassMenu";

export type AppView = "refuge" | "quicklog";

interface ViewMenuProps {
  view: AppView;
  onChange: (view: AppView) => void;
  onOpenHistory: () => void;
  /** Mobile People sheet. Omit on desktop (people rail is always visible). */
  onOpenPeople?: () => void;
  onUndo: () => void;
  undoDisabled?: boolean;
  undoLabel?: string;
  onRedo: () => void;
  redoDisabled?: boolean;
  redoLabel?: string;
  onExportAll: () => void;
  exportDisabled?: boolean;
  size?: "sm" | "md";
}

/**
 * Hamburger → Pages, Actions (Export), then icon-only Undo / Redo at the
 * bottom. Shared cloudy menu chrome with the person-card ⋯.
 */
export function ViewMenu({
  view,
  onChange,
  onOpenHistory,
  onOpenPeople,
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
        onSelect: onOpenHistory,
      },
      ...(onOpenPeople
        ? [
            {
              id: "people",
              label: "People",
              icon: Contact,
              onSelect: onOpenPeople,
            },
          ]
        : []),
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
      iconActions={iconActions}
    />
  );
}
