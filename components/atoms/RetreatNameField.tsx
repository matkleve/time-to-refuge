"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface RetreatNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * One name for the whole session, set once and carried into every export —
 * see design system §6c. Same tap-to-edit shape as a person's name in
 * PersonCard, at header scale instead of card scale.
 */
export function RetreatNameField({ value, onChange, className }: RetreatNameFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed !== value) onChange(trimmed);
    setEditing(false);
  }

  if (editing) {
    return (
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
        className={cn(
          "min-w-0 rounded-lg border border-flagblue-500 bg-white px-1.5 text-center text-ink focus:outline-none",
          className,
        )}
      />
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
      className={cn(
        "max-w-full truncate rounded-lg px-1 transition-colors duration-200 hover:bg-ink/[0.05]",
        value ? "text-muted" : "text-subtle",
        className,
      )}
    >
      {value || "Add retreat name"}
    </button>
  );
}
