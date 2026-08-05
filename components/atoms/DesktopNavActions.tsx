"use client";

import { Download, HeartHandshake, Redo2, Undo2 } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import type { AppView } from "@/components/atoms/ViewMenu";
import { glassNavSelectedClass } from "@/lib/surfaces";
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
    <div className="flex shrink-0 items-center gap-0.5">
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
        className="ml-0.5 flex items-center gap-0.5 border-l border-line pl-1.5"
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
          feedbackOn={view === "dana"}
          className={
            view === "dana" ? cn(glassNavSelectedClass()) : undefined
          }
          onClick={() => onChange("dana")}
        />
      </div>
    </div>
  );
}
