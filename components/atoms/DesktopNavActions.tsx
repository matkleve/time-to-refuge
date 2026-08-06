"use client";

import { Download, HeartHandshake, Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { AppView } from "@/components/atoms/ViewMenu";
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
      <Button
        variant="quiet"
        icon={Undo2}
        aria-label={undoLabel}
        title={undoLabel}
        size="sm"
        onClick={onUndo}
        disabled={undoDisabled}
      />
      <Button
        variant="quiet"
        icon={Redo2}
        aria-label={redoLabel}
        title={redoLabel}
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
        <Button
          variant="quiet"
          icon={Download}
          aria-label="Export all"
          title="Export all"
          size="sm"
          onClick={onExportAll}
          disabled={exportDisabled}
        />
        <Button
          variant="quiet"
          size="sm"
          icon={HeartHandshake}
          selected={view === "dana"}
          labelCollapse="lg"
          press="md"
          aria-label={dana.menuCta}
          title={dana.menuCta}
          aria-current={view === "dana" ? "page" : undefined}
          onClick={() => onChange("dana")}
          className="text-base font-semibold text-ink"
        >
          {dana.menuCta}
        </Button>
      </div>
    </div>
  );
}
