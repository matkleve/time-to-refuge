"use client";

import { useState } from "react";
import { Mountain, Pencil } from "lucide-react";
import { controlMinH } from "@/lib/control-size";
import { glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

interface RetreatNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Session retreat name — left-aligned glass pill under the app bar on
 * Session / People only. Leading mountain icon; tap anywhere on the chip
 * to edit (whole pill highlights — not just an inner input). See §6c.
 */
export function RetreatNameField({ value, onChange, className }: RetreatNameFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed !== value) onChange(trimmed);
    setEditing(false);
  }

  const shell = cn(
    "flex w-fit max-w-full items-center gap-2.5 rounded-full px-3.5 py-2.5",
    controlMinH.md,
    glassClass("card", { rim: true }),
    className,
  );

  if (editing) {
    return (
      <div className={shell}>
        <Mountain className="size-5 shrink-0 text-flagblue-600" strokeWidth={2} aria-hidden />
        <input
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by an explicit tap. */
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          }}
          placeholder="Retreat name"
          aria-label="Retreat name"
          size={Math.max(draft.length, 12)}
          className="box-border max-w-full min-w-[8rem] bg-transparent font-display text-base font-semibold leading-snug text-ink placeholder:font-sans placeholder:font-normal placeholder:text-muted/70 focus:outline-none"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      aria-label={value ? `Retreat: ${value}. Tap to change.` : "Add a retreat name"}
      className={cn(shell, userFeedbackClass({ press: "md" }))}
    >
      <Mountain
        className={cn("size-5 shrink-0", value ? "text-flagblue-600" : "text-muted")}
        strokeWidth={2}
        aria-hidden
      />
      <span
        className={cn(
          "max-w-[16rem] truncate font-display text-base font-semibold leading-snug sm:max-w-md",
          value ? "text-ink" : "text-muted",
        )}
      >
        {value || "Add retreat name"}
      </span>
      {value ? <Pencil className="size-3.5 shrink-0 text-muted" aria-hidden /> : null}
    </button>
  );
}
