"use client";

import { Download, HeartHandshake, Redo2, Undo2 } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import type { AppView } from "@/components/atoms/ViewMenu";
import { BUTTON_CLUSTER_GAP, controlMinH } from "@/lib/control-size";
import { interactiveActionClass } from "@/lib/interactive-glass";
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
        <button
          type="button"
          onClick={() => onChange("dana")}
          aria-label={dana.menuCta}
          aria-current={view === "dana" ? "page" : undefined}
          className={cn(
            interactiveActionClass(
              "primary",
              { press: "md", on: view === "dana" },
              cn(
                "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold text-white",
                controlMinH.sm,
                "hover:brightness-[1.06]",
                "user-feedback--on-accent",
                view === "dana" && "ring-2 ring-inset ring-white/70",
              ),
            ),
          )}
        >
          <HeartHandshake
            className="size-[1.125rem] shrink-0"
            strokeWidth={2}
            aria-hidden
          />
          <span className="whitespace-nowrap">{dana.menuCta}</span>
        </button>
      </div>
    </div>
  );
}
