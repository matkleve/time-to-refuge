"use client";

import { useState } from "react";
import type { FieldDef } from "@/lib/types";
import { controlMinH, BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { FieldEditorRowActions } from "./FieldEditorRowActions";
import { FieldEditorRowLabel } from "./FieldEditorRowLabel";
import { useArmedAction } from "@/lib/use-armed-action";
import { cn } from "@/lib/utils";

export function FieldEditorRow({
  field,
  canDelete,
  canUp,
  canDown,
  bumpNonce,
  onRename,
  onUp,
  onDown,
  onDelete,
}: {
  field: FieldDef;
  canDelete: boolean;
  canUp: boolean;
  canDown: boolean;
  bumpNonce: number;
  onRename: (label: string) => void;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.label);
  const remove = useArmedAction(onDelete);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== field.label) onRename(trimmed);
    else setDraft(field.label);
    setEditing(false);
  }

  const pill = cn(
    "flex min-w-0 flex-1 items-center rounded-full px-4 py-2.5",
    controlMinH.md,
  );

  return (
    <div className={cn("flex min-w-0 w-full items-center", BUTTON_CLUSTER_GAP, controlMinH.md)}>
      <FieldEditorRowLabel
        field={field}
        editing={editing}
        draft={draft}
        bumpNonce={bumpNonce}
        armed={remove.armed}
        pillClass={pill}
        onDraftChange={setDraft}
        onCommit={commit}
        onStartEdit={() => {
          setDraft(field.label);
          setEditing(true);
        }}
        onCancelEdit={() => {
          setDraft(field.label);
          setEditing(false);
        }}
        onAnimationEnd={(e) => {
          if (e.animationName.includes("flash-ring")) {
            e.currentTarget.style.boxShadow = "";
          }
        }}
      />
      <FieldEditorRowActions
        field={field}
        canDelete={canDelete}
        canUp={canUp}
        canDown={canDown}
        onUp={onUp}
        onDown={onDown}
        remove={remove}
      />
    </div>
  );
}
