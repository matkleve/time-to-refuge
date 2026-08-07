"use client";

import { useState } from "react";
import { Mountain, Pencil } from "lucide-react";
import { WORKSPACE_RAIL_MAX_WIDTH } from "@/lib/chrome";
import { controlMinH } from "@/lib/control-size";
import { glassPillFocusWithin, suppressInputOutline } from "@/lib/focus-cues";
import {
  interactiveGlassFlushClass,
  staticGlassFlushClass,
} from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";

interface RetreatNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Share a row with session person nav — chip shrinks; label uses fluid type. */
  layout?: "default" | "inline";
}

/**
 * Session retreat name — left-aligned glass pill under the app bar on
 * Session / People only. Leading mountain icon; tap anywhere on the chip
 * to edit (whole pill highlights — not just an inner input). See §6c.
 */
export function RetreatNameField({
  value,
  onChange,
  className,
  layout = "default",
}: RetreatNameFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed !== value) onChange(trimmed);
    setEditing(false);
  }

  const inline = layout === "inline";
  const shellLayout = cn(
    inline
      ? "@container flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-2.5"
      : cn(
          "flex w-fit max-w-full items-center gap-2.5 rounded-full px-3.5 py-2.5",
          WORKSPACE_RAIL_MAX_WIDTH,
        ),
    controlMinH.md,
    className,
  );
  const labelClass = cn(
    "min-w-0 flex-1 truncate font-display font-semibold leading-snug",
    inline
      ? "text-[length:clamp(0.8125rem,0.5rem+4cqi,1rem)]"
      : "text-base",
    value ? "text-ink" : "text-muted",
  );
  const editingShell = cn(shellLayout, staticGlassFlushClass(), glassPillFocusWithin);

  if (editing) {
    return (
      <div className={editingShell}>
        <Mountain className="size-5 shrink-0 text-flagblue-600" strokeWidth={2} aria-hidden />
        <input
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by an explicit tap. */
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          name="tk-retreat-name"
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
          className={cn(
            "box-border max-w-full min-w-[8rem] rounded-full bg-transparent font-display font-semibold leading-snug text-ink placeholder:font-sans placeholder:font-normal placeholder:text-muted/70",
            inline
              ? "text-[length:clamp(0.8125rem,0.5rem+4cqi,1rem)]"
              : "text-base",
            suppressInputOutline,
          )}
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
      className={cn(shellLayout, interactiveGlassFlushClass(undefined, { press: "md" }))}
    >
      <Mountain
        className={cn("size-5 shrink-0", value ? "text-flagblue-600" : "text-muted")}
        strokeWidth={2}
        aria-hidden
      />
      <span className={labelClass}>
        {value || "Add retreat name"}
      </span>
      {value ? <Pencil className="size-3.5 shrink-0 text-muted" aria-hidden /> : null}
    </button>
  );
}
