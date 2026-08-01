"use client";

import { useState } from "react";
import { Mountain, Pencil } from "lucide-react";
import { glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

interface RetreatNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Session retreat name — large left-aligned glass chip under the app bar on
 * Refuge / People only. Leading mountain icon; tap to edit.
 * Idle and editing share one fixed-height shell so the chip never jumps.
 * See design system §6c.
 */
export function RetreatNameField({ value, onChange, className }: RetreatNameFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed !== value) onChange(trimmed);
    setEditing(false);
  }

  return (
    <div
      className={cn(
        "flex h-12 w-full max-w-md items-center gap-2.5 rounded-2xl px-3.5",
        glassClass("card", { rim: true }),
        className,
      )}
    >
      <Mountain
        className={cn(
          "size-5 shrink-0",
          value || editing ? "text-flagblue-600" : "text-muted",
        )}
        strokeWidth={2}
        aria-hidden
      />

      {editing ? (
        <input
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- the field only
             appears on an explicit user action, so focusing it is expected. */
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          placeholder="Retreat name"
          aria-label="Retreat name"
          className="box-border h-9 min-w-0 flex-1 rounded-xl border border-flagblue-500 bg-white px-2.5 font-display text-base font-semibold leading-none text-ink focus:outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          aria-label={value ? `Retreat: ${value}. Tap to change.` : "Add a retreat name"}
          className={cn(
            "flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-xl text-left",
            userFeedbackClass({ press: "md" }),
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate font-display text-base font-semibold",
              value ? "text-ink" : "text-muted",
            )}
          >
            {value || "Add retreat name"}
          </span>
          {value ? <Pencil className="size-3.5 shrink-0 text-muted" aria-hidden /> : null}
        </button>
      )}
    </div>
  );
}
