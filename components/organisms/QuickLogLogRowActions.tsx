"use client";

import { Check, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { RowActionTray } from "@/components/atoms/RowReveal";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import type { useArmedAction } from "@/lib/use-armed-action";
import { cn } from "@/lib/utils";

export function QuickLogLogRowActions({
  index,
  copied,
  showActions,
  remove,
  onCopy,
}: {
  index: number;
  copied: boolean;
  showActions: boolean;
  remove: ReturnType<typeof useArmedAction>;
  onCopy: (e: React.MouseEvent) => void;
}) {
  return (
    <RowActionTray open={showActions}>
      <div className={cn("flex shrink-0 items-center", BUTTON_CLUSTER_GAP)}>
        <Button
          variant="glass"
          icon={copied ? Check : Copy}
          aria-label={copied ? "Time copied" : "Copy time"}
          title={copied ? "Time copied" : "Copy time"}
          onClick={onCopy}
          tone="accent"
          size="md"
          className={copied ? "text-saffron-700" : undefined}
        />
        <Button
          variant="glass"
          icon={Trash2}
          aria-label={remove.armed ? `Confirm delete entry #${index}` : `Delete entry #${index}`}
          title={remove.armed ? `Confirm delete entry #${index}` : `Delete entry #${index}`}
          onClick={(e) => {
            e.stopPropagation();
            remove.trigger();
          }}
          tone="danger"
          size="md"
          armed={remove.armed}
        />
      </div>
    </RowActionTray>
  );
}
