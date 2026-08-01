"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { glassClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import { RowActionTray } from "@/components/atoms/RowReveal";

/**
 * Add-person control — same §5a reveal as a field / Quick Log row: one stamp
 * structure, tray grows for Add / Cancel. Idle is the label; open is the name
 * field in that stamp (not a swapped second card).
 */
export function AddPersonRow({ onAdd }: { onAdd: (name: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
    setAdding(false);
  }

  function cancel() {
    setAdding(false);
    setName("");
  }

  return (
    <div className="flex w-full items-center">
      <div
        className={cn(
          "flex min-h-12 min-w-0 flex-1 items-center overflow-hidden rounded-3xl",
          glassClass("card", { rim: true }),
        )}
      >
        {adding ? (
          <input
            /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by an
               explicit user action; focusing the field is expected. */
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") cancel();
            }}
            placeholder="Person's name"
            aria-label="Person's name"
            className="min-h-12 min-w-0 flex-1 bg-transparent px-4 py-2.5 font-display text-lg font-semibold text-ink placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted/70 focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className={cn(
              "flex min-h-12 w-full items-center justify-center gap-2 px-4 py-2.5 text-base text-muted",
              "transition-[colors,transform,background-color] duration-150 ease-out",
              "hover:bg-white/40 hover:text-flagblue-600 active:scale-[0.99]",
            )}
          >
            <Plus className="size-4" aria-hidden /> Add person
          </button>
        )}
      </div>

      <RowActionTray open={adding}>
        <div className="flex shrink-0 items-center gap-2">
          <IconButton
            icon={X}
            label="Cancel adding person"
            glass
            onClick={cancel}
            size="md"
          />
          <IconButton
            icon={Check}
            label="Add person"
            glass
            onClick={submit}
            tone="accent"
            size="md"
            disabled={!name.trim()}
          />
        </div>
      </RowActionTray>
    </div>
  );
}
