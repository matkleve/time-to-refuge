"use client";

import { useMemo } from "react";
import { ChevronDown, Globe } from "lucide-react";

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
}

export function TimezoneSelect({ value, onChange }: TimezoneSelectProps) {
  const zones = useMemo(() => getTimezones(), []);

  return (
    <span className="relative inline-flex items-center">
      <Globe className="pointer-events-none absolute left-2.5 size-4 text-muted" aria-hidden />
      <select
        value={value}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.value)}
      className="max-w-[60vw] appearance-none rounded-control border border-line bg-white py-1.5 pr-7 pl-8 text-label text-ink transition-colors duration-(--duration-ui) hover:border-muted"
    >
        {zones.map((z) => (
          <option key={z} value={z}>
            {z.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 size-4 text-muted" aria-hidden />
    </span>
  );
}
