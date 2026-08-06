"use client";

import { ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { TimezoneSelectMenu } from "@/components/atoms/TimezoneSelectMenu";
import { useTimezoneSelect } from "@/components/atoms/useTimezoneSelect";
import { controlMinH } from "@/lib/control-size";
import { formatTimezoneLabel } from "@/lib/timezone-options";
import { cn } from "@/lib/utils";

interface TimezoneSelectProps {
  value: string;
  onChange: (tz: string) => void;
  /** Glass pill trigger — matches field / add-row rails when not `fullWidth`. */
  chip?: boolean;
  /** Span the container (e.g. dev showcase). Default false — flex child in page chrome. */
  fullWidth?: boolean;
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
  fullWidth = false,
  className,
}: TimezoneSelectProps) {
  const { open, box, zones, triggerRef, panelRef, toggle, pick } =
    useTimezoneSelect(value, onChange);
  const label = formatTimezoneLabel(value);

  const triggerProps = {
    variant: "flushPill" as const,
    press: "md" as const,
    selected: open,
    onClick: toggle,
    "aria-expanded": open,
    "aria-haspopup": "listbox" as const,
    "aria-label": `Time zone: ${label}`,
  };

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
      <div ref={triggerRef} className={cn("relative min-w-0", fullWidth && "w-full", className)}>
        <Button
          {...triggerProps}
          fullWidth={fullWidth}
          className={cn(
            "gap-2.5 rounded-full px-4 py-2.5 text-left font-display text-lg font-semibold leading-snug",
            controlMinH.md,
            !fullWidth && "w-full",
          )}
        >
          <Globe className="size-5 shrink-0 text-flagblue-600" strokeWidth={2} aria-hidden />
          <span className="min-w-0 flex-1 truncate text-ink">{label}</span>
          <ChevronDown
            className={cn("size-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </Button>
        {menu}
      </div>
    );
  }

  return (
    <div ref={triggerRef} className={cn("flex flex-col gap-0.5", className)}>
      <span className="pl-1 text-sm font-medium text-muted">Time zone</span>
      <span className="relative inline-flex min-w-0 items-center">
        <Button
          {...triggerProps}
          className={cn("inline-flex min-w-0 max-w-full gap-2 rounded-xl px-3", controlMinH.md)}
        >
          <Globe className="size-4 shrink-0 text-muted" aria-hidden />
          <span className="min-w-0 truncate text-sm text-ink">{label}</span>
          <ChevronDown
            className={cn("size-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </Button>
      </span>
      {menu}
    </div>
  );
}
