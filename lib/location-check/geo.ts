import type { GeocodePayload, MatchKind } from "./types";

export function formatOffsetMinutes(offsetMin: number): string {
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(Math.round(offsetMin));
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${h}:${m}`;
}

export function parseOffsetLabel(label: string): number | null {
  const m = label.replace(/^~/, "").match(/UTC([+-])(\d{2}):(\d{2})/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3]));
}

export function deviceOffsetMinutes(): number {
  return -new Date().getTimezoneOffset();
}

/**
 * Wall-clock UTC offset (minutes) for an IANA zone at `at`.
 * Same instant, different zone — no network required once the zone id is known.
 */
export function offsetMinutesInZone(timeZone: string, at = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);

  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return (asUtc - at.getTime()) / 60_000;
}

/** Free reverse-geocode client embeds the IANA id under localityInfo.informative. */
export function timezoneFromGeocode(data: GeocodePayload): string | null {
  const hit = data.localityInfo?.informative?.find(
    (entry) =>
      entry.description === "time zone" &&
      typeof entry.name === "string" &&
      entry.name.includes("/"),
  );
  return hit?.name ?? null;
}

/**
 * Longitude ÷ 15 — only a fallback when the place lookup has no IANA zone.
 * Real zones follow borders; tolerance is deliberately loose (see below).
 */
export function expectedOffsetHoursFromLongitude(longitude: number): number {
  return Math.round(longitude / 15);
}

const ROUGH_MISMATCH_TOLERANCE_HOURS = 3.5;

export function roughOffsetsMatch(
  deviceHours: number,
  expectedHours: number,
): boolean {
  const diff = Math.abs(deviceHours - expectedHours);
  return Math.min(diff, 24 - diff) <= ROUGH_MISMATCH_TOLERANCE_HOURS;
}

export function compareZones(
  deviceZone: string,
  placeZone: string,
): {
  matches: boolean;
  kind: MatchKind;
  placeOffsetMin: number;
} {
  const placeOffsetMin = offsetMinutesInZone(placeZone);
  const deviceOffsetMin = deviceOffsetMinutes();
  if (deviceZone === placeZone) {
    return { matches: true, kind: "iana", placeOffsetMin };
  }
  // Same UTC offset (e.g. Europe/Vienna vs Europe/Berlin) is fine for wall time.
  if (Math.abs(deviceOffsetMin - placeOffsetMin) < 1) {
    return { matches: true, kind: "offset", placeOffsetMin };
  }
  return { matches: false, kind: "none", placeOffsetMin };
}
