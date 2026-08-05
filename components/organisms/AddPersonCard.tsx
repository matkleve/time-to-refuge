"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { FieldDef } from "@/lib/types";
import { BUTTON_CLUSTER_GAP, controlMinH } from "@/lib/control-size";
import { interactiveFeedbackClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import { Surface } from "@/components/atoms/Surface";
import { CancelConfirmTray } from "@/components/atoms/CancelConfirmTray";
import { PersonCardFieldSpacers } from "./PersonCardFieldSpacers";

interface AddPersonCardProps {
  fields: FieldDef[];
  onAdd: (name: string) => void;
}

/**
 * People grid slot — same shell + field-row stack height as PersonCard.
 * Spacer count tracks `fields.length` when fields are added on the Fields page.
 */
export function AddPersonCard({ fields, onAdd }: AddPersonCardProps) {
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

  const body = <PersonCardFieldSpacers fields={fields} />;

  return (
    <Surface
      material="glass-card"
      rim
      flush
      className="flex h-full min-h-0 flex-col rounded-3xl"
    >
      {open ? (
        <>
          <div className={cn("flex items-center px-3 pt-3", BUTTON_CLUSTER_GAP)}>
            <input
              /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by tap on the card. */
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck={false}
              name="tk-person-name"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") cancel();
              }}
              placeholder="Person's name"
              aria-label="Person's name"
              className="box-border h-10 min-w-0 flex-1 rounded-xl border border-flagblue-500 bg-white px-2 font-display text-2xl font-semibold leading-none text-ink placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted/70"
            />
            <CancelConfirmTray
              open
              onCancel={cancel}
              onConfirm={submit}
              cancelLabel="Cancel adding person"
              confirmLabel="Add person"
              confirmDisabled={!draft.trim()}
              press="md"
            />
          </div>
          <div className="px-3 py-3">{body}</div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-full min-h-0 w-full flex-col text-left"
        >
          <div className={cn("flex items-center px-3 pt-3", BUTTON_CLUSTER_GAP)}>
            <span
              className={cn(
                "flex h-10 min-w-0 flex-1 items-center gap-2 truncate rounded-xl px-2 font-display text-2xl font-semibold text-muted",
                interactiveFeedbackClass({ press: "md" }),
              )}
            >
              <Plus className="size-5 shrink-0" strokeWidth={2.5} aria-hidden />
              Add person
            </span>
            <span className={cn(controlMinH.md, "w-11 shrink-0")} aria-hidden />
          </div>
          <div className="px-3 py-3">{body}</div>
        </button>
      )}
    </Surface>
  );
}
