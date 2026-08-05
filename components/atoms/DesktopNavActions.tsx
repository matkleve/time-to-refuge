"use client";

import { Download, HeartHandshake, Redo2, Undo2 } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import type { AppView } from "@/components/atoms/ViewMenu";
import { interactiveGlassNavTabClass } from "@/lib/interactive-glass";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";
import dana from "@/content/dana.json";

export function DesktopNavActions({
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
}: {
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
}) {
  return (
    <div className={cn("flex shrink-0 items-center", BUTTON_CLUSTER_GAP)}>
      <IconButton
        icon={Undo2}
        label={undoLabel}
        quiet
        size="sm"
        onClick={onUndo}
        disabled={undoDisabled}
      />
      <IconButton
        icon={Redo2}
        label={redoLabel}
        quiet
        size="sm"
        onClick={onRedo}
        disabled={redoDisabled}
      />
      <div
        className={cn(
          "ml-0.5 flex items-center border-l border-line pl-1.5",
          BUTTON_CLUSTER_GAP,
        )}
        role="group"
        aria-label="Actions"
      >
        <IconButton
          icon={Download}
          label="Export all"
          quiet
          size="sm"
          onClick={onExportAll}
          disabled={exportDisabled}
        />
        <IconButton
          icon={HeartHandshake}
          label={dana.menuCta}
          quiet
          size="sm"
          tone={view === "dana" ? "accent" : "neutral"}
          surfaceClass={interactiveGlassNavTabClass(view === "dana")}
          onClick={() => onChange("dana")}
        />
      </div>
    </div>
  );
}
