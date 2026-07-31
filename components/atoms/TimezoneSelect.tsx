"use client";

import { useMemo } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { glassClass } from "@/lib/surfaces";
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
  /** One-row chrome (Quick Log header) — no stacked label. */
  compact?: boolean;
  className?: string;
}

export function TimezoneSelect({
  value,
  onChange,
  compact = false,
  className,
}: TimezoneSelectProps) {
  const zones = useMemo(() => {
    const list = listTimezones();
    // If value somehow isn't in the list (stale storage), keep it selectable.
    return list.includes(value) ? list : [value, ...list];
  }, [value]);

  const field = (
    <span className={cn("relative inline-flex min-w-0 items-center", compact && "w-full")}>
      <Globe className="pointer-events-none absolute left-2.5 size-4 text-muted" aria-hidden />
      <select
        value={value}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Time zone"
        className={cn(
          "min-w-0 appearance-none py-1.5 pr-7 pl-8 text-sm text-ink",
          "transition-[colors,background-color,transform] duration-150 ease-out",
          "rounded-xl hover:bg-white/70 active:scale-[0.99]",
          glassClass("card", { rim: true }),
          compact ? "w-full max-w-full truncate" : "max-w-[60vw]",
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
  );

  if (compact) {
    return <div className={cn("min-w-0 flex-1", className)}>{field}</div>;
  }

  return (
    <label className={cn("flex flex-col gap-0.5", className)}>
      <span className="pl-1 text-sm font-medium text-muted">Time zone</span>
      {field}
    </label>
  );
}
