"use client";

import { useMemo } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { controlH, controlMinH } from "@/lib/control-size";
import { glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

/**
 * Short curated list for Quick Log — device zone is always merged in.
 * Not every IANA id; just enough to re-read a stamp in another place.
 */
const CURATED_ZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Kathmandu",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Tokyo",
];

function listTimezones(): string[] {
  const device = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const set = new Set(CURATED_ZONES);
  if (device) set.add(device);
  return Array.from(set).sort((a, b) => {
    if (a === "UTC") return -1;
    if (b === "UTC") return 1;
    if (a === device) return -1;
    if (b === device) return 1;
    return a.localeCompare(b);
  });
}

interface TimezoneSelectProps {
  value: string;
  onChange: (tz: string) => void;
  /**
   * Full-width chip matching the retreat name control (md / 44px shell).
   * Default is the older compact inline select.
   */
  chip?: boolean;
  className?: string;
}

export function TimezoneSelect({
  value,
  onChange,
  chip = false,
  className,
}: TimezoneSelectProps) {
  const zones = useMemo(() => {
    const list = listTimezones();
    // If value somehow isn't in the list (stale storage), keep it selectable.
    return list.includes(value) ? list : [value, ...list];
  }, [value]);

  if (chip) {
    return (
      <div
        className={cn(
          "relative flex w-full max-w-md items-center gap-2.5 rounded-2xl px-3.5",
          controlH.md,
          glassClass("card", { rim: true }),
          className,
        )}
      >
        <Globe className="pointer-events-none size-5 shrink-0 text-flagblue-600" strokeWidth={2} aria-hidden />
        <select
          value={value}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Time zone"
          className={cn(
            "min-w-0 flex-1 appearance-none truncate bg-transparent pr-7 font-display text-base font-semibold text-ink focus:outline-none",
            controlH.sm,
            userFeedbackClass({ press: "md" }),
          )}
        >
          {zones.map((z) => (
            <option key={z} value={z}>
              {z.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 size-4 text-muted"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <label className={cn("flex flex-col gap-0.5", className)}>
      <span className="pl-1 text-sm font-medium text-muted">Time zone</span>
      <span className="relative inline-flex min-w-0 items-center">
        <Globe className="pointer-events-none absolute left-2.5 size-4 text-muted" aria-hidden />
        <select
          value={value}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Time zone"
          className={cn(
            "min-w-0 max-w-[60vw] appearance-none rounded-xl pr-7 pl-8 text-sm text-ink",
            controlMinH.md,
            userFeedbackClass({ press: "md" }),
            glassClass("card", { rim: true }),
          )}
        >
          {zones.map((z) => (
            <option key={z} value={z}>
              {z.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2 size-4 text-muted"
          aria-hidden
        />
      </span>
    </label>
  );
}
