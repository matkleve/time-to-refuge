"use client";

import { Check, Copy, Eye, Pencil, RotateCcw } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { Phase } from "@/lib/types";
import { cn } from "@/lib/utils";

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
        <Button
          variant="glass"
          icon={Eye}
          aria-label={`Open ${personName}`}
          title={`Open ${personName}`}
          onClick={onOpenPerson}
          tone="accent"
          size="md"
        />
      )}
      <Button
        variant="glass"
        icon={copied ? Check : Copy}
        aria-label={copied ? `${phaseLabel} time copied` : `Copy ${phaseLabel} time`}
        title={copied ? `${phaseLabel} time copied` : `Copy ${phaseLabel} time`}
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
        <Button
          variant="glass"
          icon={Pencil}
          aria-label={`Edit ${phaseLabel} time`}
          title={`Edit ${phaseLabel} time`}
          onClick={onStartEdit}
          tone="accent"
          size="md"
        />
      )}
      {onClear && (
        <Button
          variant="glass"
          icon={RotateCcw}
          aria-label={
            armedReset.armed
              ? `Confirm reset ${phaseLabel}`
              : `Reset ${phaseLabel}`
          }
          title={
            armedReset.armed
              ? `Confirm reset ${phaseLabel}`
              : `Reset ${phaseLabel}`
          }
          onClick={armedReset.trigger}
          tone="danger"
          size="md"
          armed={armedReset.armed}
        />
      )}
    </div>
  );
}
