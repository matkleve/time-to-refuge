export function formatClock(date: Date): { day: string; time: string; ms: string } {
  const day = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const time = date.toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const ms = String(date.getMilliseconds()).padStart(3, "0");
  return { day, time, ms };
}

export function formatTimestamp(ts: number | null): string {
  if (ts === null) return "—";
  const { time, ms } = formatClock(new Date(ts));
  return `${time}.${ms}`;
}

export function formatDateForFile(ts: number | null): string {
  if (ts === null) return "";
  return new Date(ts).toISOString();
}

export function formatInZone(ts: number, timeZone: string): { date: string; time: string; ms: string } {
  const d = new Date(ts);
  const date = d.toLocaleDateString(undefined, { timeZone, month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { timeZone, hour12: false });
  const ms = String(((ts % 1000) + 1000) % 1000).padStart(3, "0");
  return { date, time, ms };
}

export function formatLogTime(ts: number): string {
  const d = new Date(ts);
  const { time, ms } = formatClock(d);
  const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${date}, ${time}.${ms}`;
}

/** `HH:MM:SS.mmm` for a time input, in the viewer's local zone. */
export function toTimeInput(ts: number): string {
  const d = new Date(ts);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
}

/**
 * Parses `HH:MM:SS`, `HH:MM:SS.m`, `HH:MM:SS.mmm` (or `HH:MM`) and applies it
 * to the calendar day of `baseTs`, so correcting a time never moves its date.
 * Returns null when the input isn't a usable time.
 */
export function fromTimeInput(value: string, baseTs: number): number | null {
  const m = /^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?(?:[.,](\d{1,3}))?\s*$/.exec(value);
  if (!m) return null;
  const [h, min, sec] = [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)];
  const ms = Number((m[4] ?? "0").padEnd(3, "0"));
  if (h > 23 || min > 59 || sec > 59) return null;
  const d = new Date(baseTs);
  d.setHours(h, min, sec, ms);
  return d.getTime();
}
