"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import type { FieldDef } from "@/lib/types";
import { IconButton } from "@/components/atoms/IconButton";
import { RowActionTray } from "@/components/atoms/RowReveal";
import type { useArmedAction } from "@/lib/use-armed-action";

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
      <div className="flex shrink-0 items-center gap-2">
        <IconButton
          icon={ArrowUp}
          label={`Move ${field.label} up`}
          glass
          size="md"
          press="md"
          onClick={onUp}
          disabled={!canUp}
        />
        <IconButton
          icon={ArrowDown}
          label={`Move ${field.label} down`}
          glass
          size="md"
          press="md"
          onClick={onDown}
          disabled={!canDown}
        />
        {canDelete && (
          <IconButton
            icon={Trash2}
            label={
              remove.armed ? `Confirm delete ${field.label}` : `Delete ${field.label}`
            }
            glass
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
