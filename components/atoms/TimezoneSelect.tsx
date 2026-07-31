"use client";

import { useMemo } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { glassClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

const FALLBACK_ZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Kathmandu",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function getTimezones(): string[] {
  const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] })
    .supportedValuesOf;
  let zones = FALLBACK_ZONES;
  if (typeof supportedValuesOf === "function") {
    try {
      zones = supportedValuesOf("timeZone");
    } catch {
      zones = FALLBACK_ZONES;
    }
  }
  return zones.includes("UTC") ? zones : ["UTC", ...zones];
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
  const zones = useMemo(() => getTimezones(), []);

  const field = (
    <span className={cn("relative inline-flex min-w-0 items-center", compact && "w-full")}>
      <Globe className="pointer-events-none absolute left-2.5 size-4 text-muted" aria-hidden />
      <select
        value={value}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Time zone"
        className={cn(
          "min-w-0 appearance-none py-1.5 pr-7 pl-8 text-sm text-ink transition-colors duration-200",
          "rounded-xl",
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
      <span className="pl-1 text-xs font-medium text-muted">Time zone</span>
      {field}
    </label>
  );
}
