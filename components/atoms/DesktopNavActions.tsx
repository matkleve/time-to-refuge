"use client";

import Link from "next/link";
import { Download, HeartHandshake, Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";
import dana from "@/content/dana.json";
import { interactiveGlassFlushChipClass } from "@/lib/interactive-glass";

export function DesktopNavActions({
  onUndo,
  undoDisabled = false,
  undoLabel = "Undo",
  onRedo,
  redoDisabled = false,
  redoLabel = "Redo",
  onExportAll,
  exportDisabled = false,
}: {
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
    <div
      className={cn("flex shrink-0 items-center", BUTTON_CLUSTER_GAP)}
      role="group"
      aria-label="Actions"
    >
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
      <Button
        variant="quiet"
        icon={Download}
        aria-label="Export all"
        title="Export all"
        size="sm"
        onClick={onExportAll}
        disabled={exportDisabled}
      />
      <Link
        href="/dana"
        aria-label={dana.menuCta}
        title={dana.menuCta}
        className={cn(
          "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl px-2.5 text-base font-semibold text-ink lg:px-3",
          interactiveGlassFlushChipClass({ press: "md" }),
        )}
      >
        <HeartHandshake className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        <span className="hidden lg:inline">{dana.menuCta}</span>
      </Link>
    </div>
  );
}
