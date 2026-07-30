"use client";

import { useMemo } from "react";

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
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-[55vw] rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm text-ink focus:border-flagblue-500 focus:outline-none"
    >
      {zones.map((z) => (
        <option key={z} value={z}>
          {z.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
