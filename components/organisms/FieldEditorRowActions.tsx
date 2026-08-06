"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import type { FieldDef } from "@/lib/types";
import { Button } from "@/components/atoms/Button";
import { RowActionTray } from "@/components/atoms/RowReveal";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import type { useArmedAction } from "@/lib/use-armed-action";
import { cn } from "@/lib/utils";

export function FieldEditorRowActions({
  field,
  canDelete,
  canUp,
  canDown,
  onUp,
  onDown,
  remove,
}: {
  field: FieldDef;
  canDelete: boolean;
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
  remove: ReturnType<typeof useArmedAction>;
}) {
  return (
    <RowActionTray open>
      <div className={cn("flex shrink-0 items-center", BUTTON_CLUSTER_GAP)}>
        <Button
          variant="glass"
          icon={ArrowUp}
          aria-label={`Move ${field.label} up`}
          title={`Move ${field.label} up`}
          size="md"
          press="md"
          onClick={onUp}
          disabled={!canUp}
        />
        <Button
          variant="glass"
          icon={ArrowDown}
          aria-label={`Move ${field.label} down`}
          title={`Move ${field.label} down`}
          size="md"
          press="md"
          onClick={onDown}
          disabled={!canDown}
        />
        {canDelete && (
          <Button
            variant="glass"
            icon={Trash2}
            aria-label={
              remove.armed ? `Confirm delete ${field.label}` : `Delete ${field.label}`
            }
            title={
              remove.armed ? `Confirm delete ${field.label}` : `Delete ${field.label}`
            }
            size="md"
            press="md"
            tone="danger"
            onClick={remove.trigger}
            armed={remove.armed}
          />
        )}
      </div>
    </RowActionTray>
  );
}
