import {
  Clock,
  Contact,
  Download,
  HeartHandshake,
  History,
  Home,
  ListTree,
  Redo2,
  Undo2,
  Users,
} from "lucide-react";
import type {
  GlassMenuIconAction,
  GlassMenuPrimaryAction,
  GlassMenuSection,
} from "@/components/atoms/GlassMenu";
import type { AppView } from "@/components/atoms/ViewMenu";
import dana from "@/content/dana.json";

export function buildViewMenuPages(
  view: AppView,
  onChange: (view: AppView) => void,
): GlassMenuSection {
  return {
    title: "Pages",
    items: [
      {
        id: "home",
        label: "Home",
        icon: Home,
        selected: view === "home",
        onSelect: () => onChange("home"),
      },
      {
        id: "fields",
        label: "Fields",
        icon: ListTree,
        selected: view === "fields",
        onSelect: () => onChange("fields"),
      },
      {
        id: "people",
        label: "People",
        icon: Contact,
        selected: view === "people",
        onSelect: () => onChange("people"),
      },
      {
        id: "refuge",
        label: "Session",
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
    ],
  };
}

export function buildViewMenuActions(
  onExportAll: () => void,
  exportDisabled?: boolean,
): GlassMenuSection {
  return {
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
}

export function buildViewMenuPrimaryAction(): GlassMenuPrimaryAction {
  return {
    id: "dana",
    label: dana.menuCta,
    icon: HeartHandshake,
    href: "/dana",
  };
}

export function buildViewMenuIconActions(
  onUndo: () => void,
  onRedo: () => void,
  undoDisabled?: boolean,
  undoLabel = "Undo",
  redoDisabled?: boolean,
  redoLabel = "Redo",
): GlassMenuIconAction[] {
  return [
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
}
