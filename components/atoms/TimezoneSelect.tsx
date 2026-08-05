"use client";

import { ChevronDown, Globe } from "lucide-react";
import {
  GlassPopover,
  ListBox,
  SelectValue,
  UiButton,
  UiListBoxItem,
  UiSelect,
} from "@/components/ui";
import { controlH, controlMinH } from "@/lib/control-size";
import { glassPillFocusWithin } from "@/lib/focus-cues";
import { listTimezones, formatTimezoneLabel } from "@/lib/timezone-options";
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
  const zones = listTimezones(value);
  const label = formatTimezoneLabel(value);

  const shell = cn(
    glassFlushClass(),
    "w-full text-left focus-visible:outline-none",
    className,
  );

  const focusWrap = cn("rounded-2xl", glassPillFocusWithin);

  const list = (
    <ListBox
      aria-label="Time zones"
      className="focus-safe-scroll max-h-64 overflow-y-auto overflow-x-clip outline-none"
      items={zones.map((zone) => ({ id: zone, label: formatTimezoneLabel(zone) }))}
    >
      {(item) => (
        <UiListBoxItem id={item.id} textValue={item.label}>
          <span className="min-w-0 truncate">{item.label}</span>
        </UiListBoxItem>
      )}
    </ListBox>
  );

  if (chip) {
    return (
      <UiSelect
        selectedKey={value}
        onSelectionChange={(key) => onChange(String(key))}
        aria-label={`Time zone: ${label}`}
        className={cn("relative w-full", focusWrap, className)}
      >
        <UiButton
          className={({ isPressed }) =>
            cn(
              "flex w-full items-center gap-2.5 rounded-2xl px-3.5 outline-none",
              controlH.md,
              shell,
              userFeedbackClass({ press: "md", on: isPressed }),
            )
          }
        >
          <Globe className="size-5 shrink-0 text-flagblue-600" strokeWidth={2} aria-hidden />
          <SelectValue className="min-w-0 flex-1 truncate font-display text-base font-semibold text-ink" />
          <ChevronDown className="size-4 shrink-0 text-muted [[data-open]_&]:rotate-180 transition-transform" aria-hidden />
        </UiButton>
        <GlassPopover panelClassName="p-1.5">{list}</GlassPopover>
      </UiSelect>
    );
  }

  return (
    <UiSelect
      selectedKey={value}
      onSelectionChange={(key) => onChange(String(key))}
      aria-label={`Time zone: ${label}`}
      className={cn("flex flex-col gap-0.5", className)}
    >
      <span className="pl-1 text-sm font-medium text-muted">Time zone</span>
      <span className={cn("relative inline-flex min-w-0 items-center", focusWrap)}>
        <UiButton
          className={({ isPressed }) =>
            cn(
              "inline-flex min-w-0 max-w-full items-center rounded-xl px-3 pr-8 pl-8 outline-none",
              controlMinH.md,
              shell,
              userFeedbackClass({ press: "md", on: isPressed }),
            )
          }
        >
          <SelectValue className="min-w-0 truncate text-sm text-ink" />
        </UiButton>
        <Globe className="pointer-events-none absolute left-2.5 size-4 text-muted" aria-hidden />
        <ChevronDown className="pointer-events-none absolute right-2 size-4 text-muted [[data-open]_&]:rotate-180 transition-transform" aria-hidden />
      </span>
      <GlassPopover panelClassName="p-1.5">{list}</GlassPopover>
    </UiSelect>
  );
}
