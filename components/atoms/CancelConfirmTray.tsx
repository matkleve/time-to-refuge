"use client";

import { Check, X } from "lucide-react";
import { IconButton, type IconButtonSize } from "@/components/atoms/IconButton";
import { RowActionTray } from "@/components/atoms/RowReveal";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import type { FeedbackPress } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

interface CancelConfirmTrayProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel: string;
  confirmLabel: string;
  confirmDisabled?: boolean;
  /** Match sibling stamps — Fields / People use `md`. */
  press?: FeedbackPress;
  size?: IconButtonSize;
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
  press = "sm",
  size = "md",
}: CancelConfirmTrayProps) {
  return (
    <RowActionTray open={open}>
      <div className={cn("flex shrink-0 items-center", BUTTON_CLUSTER_GAP)}>
        <IconButton
          icon={X}
          label={cancelLabel}
          glass
          onClick={onCancel}
          size={size}
          press={press}
        />
        <IconButton
          icon={Check}
          label={confirmLabel}
          glass
          onClick={onConfirm}
          tone="accent"
          size={size}
          press={press}
          disabled={confirmDisabled}
        />
      </div>
    </RowActionTray>
  );
}
