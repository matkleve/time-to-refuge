"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { glassClass } from "@/lib/surfaces";
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
      <div
        className={cn(
          "flex min-h-12 min-w-0 flex-1 items-center overflow-hidden rounded-3xl",
          glassClass("card", { rim: true }),
        )}
      >
        {open ? (
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
            className="min-h-12 min-w-0 flex-1 bg-transparent px-4 py-2.5 font-display text-lg font-semibold text-ink placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted/70 focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "flex min-h-12 w-full items-center justify-center gap-2 px-4 py-2.5 text-base text-muted",
              "transition-[colors,transform,background-color] duration-150 ease-out",
              "hover:bg-white/40 hover:text-flagblue-600 active:scale-[0.99]",
            )}
          >
            <Plus className="size-4" aria-hidden /> {idleLabel}
          </button>
        )}
      </div>

      <CancelConfirmTray
        open={open}
        onCancel={cancel}
        onConfirm={submit}
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        confirmDisabled={!draft.trim()}
      />
    </div>
  );
}
