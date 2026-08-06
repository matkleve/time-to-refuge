"use client";

import type { FieldDef } from "@/lib/types";
import { Button } from "@/components/atoms/Button";
import { glassPillFocusWithin, suppressInputOutline } from "@/lib/focus-cues";
import { staticGlassFlushClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";

export function FieldEditorRowLabel({
  field,
  editing,
  draft,
  bumpNonce,
  armed,
  pillClass,
  onDraftChange,
  onCommit,
  onStartEdit,
  onCancelEdit,
  onAnimationEnd,
}: {
  field: FieldDef;
  editing: boolean;
  draft: string;
  bumpNonce: number;
  armed: boolean;
  pillClass: string;
  onDraftChange: (value: string) => void;
  onCommit: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onAnimationEnd: (e: React.AnimationEvent<HTMLButtonElement>) => void;
}) {
  if (editing) {
    return (
      <div className={cn(pillClass, staticGlassFlushClass(), glassPillFocusWithin)}>
        <input
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by rename. */
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          name="tk-field-label"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onBlur={onCommit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommit();
            if (e.key === "Escape") onCancelEdit();
          }}
          aria-label="Field name"
          className={cn(
            "box-border min-w-0 flex-1 rounded-full bg-transparent font-display text-lg font-semibold leading-snug text-ink",
            suppressInputOutline,
          )}
        />
      </div>
    );
  }

  return (
    <Button
      variant="flushPill"
      key={bumpNonce > 0 ? `bump-${bumpNonce}` : "idle"}
      onClick={onStartEdit}
      onAnimationEnd={onAnimationEnd}
      className={cn(
        pillClass,
        "text-left font-display text-lg font-semibold leading-snug",
        armed ? "text-danger-600" : "text-ink",
        bumpNonce > 0 && "animate-chip-bump",
      )}
    >
      <span className="min-w-0 flex-1 truncate">{field.label}</span>
    </Button>
  );
}
