"use client";

import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import type { GlassMenuIconAction } from "./types";

export function MenuIconStrip({
  actions,
  onPick,
}: {
  actions: GlassMenuIconAction[];
  onPick: (action: GlassMenuIconAction) => void;
}) {
  if (actions.length === 0) return null;
  return (
    <div>
      <div className="mx-2 my-1.5 border-t border-line" role="separator" />
      <div className={cn("flex items-center justify-center px-1 py-0.5", BUTTON_CLUSTER_GAP)}>
        {actions.map((action) => (
          <IconButton
            key={action.id}
            icon={action.icon}
            label={action.label}
            size="md"
            disabled={action.disabled}
            onClick={() => onPick(action)}
          />
        ))}
      </div>
    </div>
  );
}
