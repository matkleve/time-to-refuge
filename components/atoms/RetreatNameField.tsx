"use client";

import { useState } from "react";
import { Mountain, Pencil } from "lucide-react";
import { controlH } from "@/lib/control-size";
import { glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

interface RetreatNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Session retreat name — left-aligned glass chip under the app bar on
 * Refuge / People only. Leading mountain icon; tap to edit.
 * Shell is control md (44px) — same as row chips. See design system §6c.
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
        "flex w-fit max-w-full items-center gap-2.5 rounded-2xl px-3.5",
        controlH.md,
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
          size={Math.max(draft.length, 12)}
          className={cn(
            "box-border max-w-full min-w-[8rem] rounded-xl border border-flagblue-500 bg-white px-2.5 font-display text-base font-semibold leading-none text-ink focus:outline-none",
            controlH.sm,
          )}
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
            "flex max-w-full items-center gap-2.5 rounded-xl text-left",
            controlH.sm,
            userFeedbackClass({ press: "md" }),
          )}
        >
          <span
            className={cn(
              "max-w-[16rem] truncate font-display text-base font-semibold sm:max-w-md",
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
