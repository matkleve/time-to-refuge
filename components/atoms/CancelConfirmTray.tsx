"use client";

import { Check, X } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { RowActionTray } from "@/components/atoms/RowReveal";

interface CancelConfirmTrayProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel: string;
  confirmLabel: string;
  confirmDisabled?: boolean;
}

/**
 * Shared Cancel / Confirm chip tray for add-row and Jump-here reveals (§5a).
 */
export function CancelConfirmTray({
  open,
  onCancel,
  onConfirm,
  cancelLabel,
  confirmLabel,
  confirmDisabled = false,
}: CancelConfirmTrayProps) {
  return (
    <RowActionTray open={open}>
      <div className="flex shrink-0 items-center gap-2">
        <IconButton
          icon={X}
          label={cancelLabel}
          glass
          onClick={onCancel}
          size="md"
        />
        <IconButton
          icon={Check}
          label={confirmLabel}
          glass
          onClick={onConfirm}
          tone="accent"
          size="md"
          disabled={confirmDisabled}
        />
      </div>
    </RowActionTray>
  );
}
