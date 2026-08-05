"use client";

import { Check, Copy, Trash2 } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { RowActionTray } from "@/components/atoms/RowReveal";
import type { useArmedAction } from "@/lib/use-armed-action";

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
      <div className="flex shrink-0 items-center gap-2">
        <IconButton
          icon={copied ? Check : Copy}
          label={copied ? "Time copied" : "Copy time"}
          glass
          onClick={onCopy}
          tone="accent"
          size="md"
          className={copied ? "text-saffron-700" : undefined}
        />
        <IconButton
          icon={Trash2}
          label={remove.armed ? `Confirm delete entry #${index}` : `Delete entry #${index}`}
          glass
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
