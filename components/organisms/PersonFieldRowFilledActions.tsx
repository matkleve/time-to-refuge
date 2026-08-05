import { Check, Copy, Eye, Pencil, RotateCcw } from "lucide-react";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { Phase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";

interface PersonFieldRowLookActionsProps {
  personName: string;
  phaseLabel: string;
  copied: boolean;
  onOpenPerson?: () => void;
  onCopy: () => void;
}

export function PersonFieldRowLookActions({
  personName,
  phaseLabel,
  copied,
  onOpenPerson,
  onCopy,
}: PersonFieldRowLookActionsProps) {
  return (
    <div className={cn("flex shrink-0 items-center", BUTTON_CLUSTER_GAP)}>
      {onOpenPerson && (
        <IconButton
          icon={Eye}
          label={`Open ${personName}`}
          glass
          onClick={onOpenPerson}
          tone="accent"
          size="md"
        />
      )}
      <IconButton
        icon={copied ? Check : Copy}
        label={copied ? `${phaseLabel} time copied` : `Copy ${phaseLabel} time`}
        glass
        onClick={onCopy}
        tone="accent"
        size="md"
        className={copied ? "text-saffron-700" : undefined}
      />
    </div>
  );
}

interface PersonFieldRowChangeActionsProps {
  phaseLabel: string;
  armedReset: { armed: boolean; trigger: () => void };
  onEditTime?: (phase: Phase, at: number) => void;
  onClear?: (phase: Phase) => void;
  onStartEdit: () => void;
}

export function PersonFieldRowChangeActions({
  phaseLabel,
  armedReset,
  onEditTime,
  onClear,
  onStartEdit,
}: PersonFieldRowChangeActionsProps) {
  return (
    <div className={cn("flex shrink-0 items-center", BUTTON_CLUSTER_GAP)}>
      {onEditTime && (
        <IconButton
          icon={Pencil}
          label={`Edit ${phaseLabel} time`}
          glass
          onClick={onStartEdit}
          tone="accent"
          size="md"
        />
      )}
      {onClear && (
        <IconButton
          icon={RotateCcw}
          label={
            armedReset.armed
              ? `Confirm reset ${phaseLabel}`
              : `Reset ${phaseLabel}`
          }
          glass
          onClick={armedReset.trigger}
          tone="danger"
          size="md"
          armed={armedReset.armed}
        />
      )}
    </div>
  );
}
