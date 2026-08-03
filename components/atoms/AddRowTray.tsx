"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { controlMinH } from "@/lib/control-size";
import { glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import { CancelConfirmTray } from "@/components/atoms/CancelConfirmTray";

interface AddRowTrayProps {
  idleLabel: string;
  placeholder: string;
  inputLabel: string;
  cancelLabel: string;
  confirmLabel: string;
  onAdd: (value: string) => void;
}

/**
 * Idle glass stamp → name field + Cancel/Confirm tray (§5a).
 * Shared by People (add person) and Fields (add field).
 * Whole glass pill is the press-bounce target (same as field name chips).
 */
export function AddRowTray({
  idleLabel,
  placeholder,
  inputLabel,
  cancelLabel,
  confirmLabel,
  onAdd,
}: AddRowTrayProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setDraft("");
    setOpen(false);
  }

  function cancel() {
    setOpen(false);
    setDraft("");
  }

  return (
    <div className="flex w-full items-center">
      {open ? (
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center rounded-full",
            controlMinH.md,
            glassClass("card", { rim: true }),
          )}
        >
          <input
            /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by an
               explicit user action; focusing the field is expected. */
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") cancel();
            }}
            placeholder={placeholder}
            aria-label={inputLabel}
            className={cn(
              "min-w-0 flex-1 bg-transparent px-4 py-2.5 font-display text-lg font-semibold leading-snug text-ink placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted/70 focus:outline-none",
              controlMinH.md,
            )}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-base leading-snug text-muted",
            controlMinH.md,
            glassClass("card", { rim: true }),
            "hover:text-flagblue-600",
            userFeedbackClass({ press: "md" }),
          )}
        >
          <Plus className="size-4" aria-hidden />
          <span>{idleLabel}</span>
        </button>
      )}

      <CancelConfirmTray
        open={open}
        onCancel={cancel}
        onConfirm={submit}
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        confirmDisabled={!draft.trim()}
        press="md"
      />
    </div>
  );
}
