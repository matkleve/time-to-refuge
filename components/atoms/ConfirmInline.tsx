"use client";

import { Check, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";

interface ConfirmInlineProps {
  /** Short question, e.g. "Reset Sangha?" */
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** `delete` swaps the tick for a bin; both are destructive. */
  intent?: "reset" | "delete";
  /** Accessible name for the confirm button, e.g. "Reset Sangha". */
  confirmLabel: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * The single destructive-confirm control. Four different layouts with text
 * buttons ("Cancel"/"Reset"/"Delete"/"Clear") used to exist; this replaces all
 * of them with the same icon pair, so confirming always looks the same.
 */
export function ConfirmInline({
  message,
  onConfirm,
  onCancel,
  intent = "reset",
  confirmLabel,
  size = "sm",
  className,
}: ConfirmInlineProps) {
  return (
    <div
      className={cn(
        "no-select flex items-center justify-between gap-2 rounded-row bg-danger-50 py-1 pr-1 pl-3",
        className,
      )}
    >
      <span className="min-w-0 truncate text-label text-danger-600">{message}</span>
      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton icon={X} label="Cancel" onClick={onCancel} tone="neutral" size={size} />
        <IconButton
          icon={intent === "delete" ? Trash2 : Check}
          label={confirmLabel}
          onClick={onConfirm}
          tone="danger"
          size={size}
          className="text-danger-600 hover:bg-danger-600 hover:text-white"
        />
      </div>
    </div>
  );
}
