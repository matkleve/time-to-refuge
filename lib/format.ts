export function formatClock(date: Date): { time: string; ms: string } {
  const time = date.toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const ms = String(date.getMilliseconds()).padStart(3, "0");
  return { time, ms };
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
