/** Curated zones for Quick Log — device zone is always merged in. */
export const CURATED_TIMEZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Kathmandu",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Tokyo",
] as const;

export function listTimezones(currentValue: string): string[] {
  const device = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const set = new Set<string>(CURATED_TIMEZONES);
  if (device) set.add(device);
  if (currentValue) set.add(currentValue);
  return Array.from(set).sort((a, b) => {
    if (a === "UTC") return -1;
    if (b === "UTC") return 1;
    if (a === device) return -1;
    if (b === device) return 1;
    return a.localeCompare(b);
  });
}

export function formatTimezoneLabel(zone: string): string {
  return zone.replace(/_/g, " ");
}
