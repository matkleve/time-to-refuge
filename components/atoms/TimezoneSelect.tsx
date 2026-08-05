"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { TimezoneSelectMenu } from "@/components/atoms/TimezoneSelectMenu";
import { useTimezoneSelect } from "@/components/atoms/useTimezoneSelect";
import { controlH, controlMinH } from "@/lib/control-size";
import { formatTimezoneLabel } from "@/lib/timezone-options";
import { glassFlushClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

interface TimezoneSelectProps {
  value: string;
  onChange: (tz: string) => void;
  /** Full-width chip matching retreat name control (Quick Log page chrome). */
  chip?: boolean;
  className?: string;
}

/**
 * Custom timezone picker — no native `<select>` (desktop or mobile).
 * Whole chip is the trigger; focus ring wraps the full control.
 */
export function TimezoneSelect({
  value,
  onChange,
  chip = false,
  className,
}: TimezoneSelectProps) {
  const { open, box, zones, triggerRef, panelRef, toggle, pick } =
    useTimezoneSelect(value, onChange);
  const label = formatTimezoneLabel(value);

  const shell = cn(
    glassFlushClass(),
    "w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flagblue-600 focus-visible:ring-offset-2",
    userFeedbackClass({ press: "md", on: open }),
    className,
  );

  const menu =
    open && box ? (
      <TimezoneSelectMenu
        panelRef={panelRef}
        box={box}
        zones={zones}
        value={value}
        onPick={pick}
      />
    ) : null;

  if (chip) {
    return (
      <div ref={triggerRef} className="relative w-full">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`Time zone: ${label}`}
          className={cn("flex items-center gap-2.5 rounded-2xl px-3.5", controlH.md, shell)}
        >
          <Globe className="size-5 shrink-0 text-flagblue-600" strokeWidth={2} aria-hidden />
          <span className="min-w-0 flex-1 truncate font-display text-base font-semibold text-ink">
            {label}
          </span>
          <ChevronDown
            className={cn("size-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
        {menu}
      </div>
    );
  }

  return (
    <div ref={triggerRef} className={cn("flex flex-col gap-0.5", className)}>
      <span className="pl-1 text-sm font-medium text-muted">Time zone</span>
      <span className="relative inline-flex min-w-0 items-center">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`Time zone: ${label}`}
          className={cn(
            "inline-flex min-w-0 max-w-full items-center rounded-xl px-3 pr-8 pl-8",
            controlMinH.md,
            shell,
          )}
        >
          <span className="min-w-0 truncate text-sm text-ink">{label}</span>
        </button>
        <Globe className="pointer-events-none absolute left-2.5 size-4 text-muted" aria-hidden />
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-2 size-4 text-muted transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </span>
      {menu}
    </div>
  );
}
