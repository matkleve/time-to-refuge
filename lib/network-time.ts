/**
 * Browser-side network time probe — Cristian's algorithm against a trusted
 * UTC source. Prefers same-origin `/api/utc` (ms, Vercel/Node NTP), then
 * Cloudflare edge `cdn-cgi/trace` (second stamp → wider uncertainty).
 * Offline → null, never a fake pass.
 */

export type NetworkTimeSample = {
  /** Device clock minus estimated true UTC (positive = phone ahead). */
  skewMs: number;
  /** Round-trip of the time request. */
  rttMs: number;
  /** ± uncertainty on the skew (±RTT/2, floored). */
  uncertaintyMs: number;
  /** Which source answered. */
  source: "app" | "cloudflare";
};

export type ClockSkewTone = "ok" | "warn" | "danger";

const RTT_FLOOR_MS = 25;
/** Within this of uncertainty → “close enough” for ceremony recording. */
const OK_SLACK_MS = 400;
/** Beyond this of uncertainty → clearly wrong wall clock. */
const DANGER_SLACK_MS = 2000;

function parseCloudflareTrace(body: string): number | null {
  const m = body.match(/(?:^|\n)ts=([0-9]+(?:\.[0-9]+)?)/);
  if (!m) return null;
  return Math.round(Number(m[1]) * 1000);
}

function parseAppUtc(json: unknown): number | null {
  if (!json || typeof json !== "object") return null;
  const utcMs = (json as { utcMs?: unknown }).utcMs;
  return typeof utcMs === "number" && Number.isFinite(utcMs) ? utcMs : null;
}

async function fetchServerUtcMs(
  url: string,
  parse: (body: string) => number | null,
): Promise<{ serverMs: number; t0: number; t1: number } | null> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    const t1 = Date.now();
    if (!res.ok) return null;
    const serverMs = parse(text);
    if (serverMs === null) return null;
    return { serverMs, t0, t1 };
  } catch {
    return null;
  }
}

function sampleFromTrip(
  trip: { serverMs: number; t0: number; t1: number },
  source: NetworkTimeSample["source"],
  uncertaintyFloor = RTT_FLOOR_MS,
): NetworkTimeSample {
  const rttMs = Math.max(0, trip.t1 - trip.t0);
  // Cristian: skew (client ahead) = client midpoint − server stamp.
  const clientMid = (trip.t0 + trip.t1) / 2;
  const skewMs = Math.round(clientMid - trip.serverMs);
  const uncertaintyMs = Math.max(uncertaintyFloor, Math.round(rttMs / 2));
  return { skewMs, rttMs, uncertaintyMs, source };
}

/**
 * Probe network UTC. Prefers `/api/utc`, then Cloudflare. Returns null when
 * offline or both sources fail.
 */
export async function probeNetworkTime(): Promise<NetworkTimeSample | null> {
  const app = await fetchServerUtcMs("/api/utc", (body) => {
    try {
      return parseAppUtc(JSON.parse(body) as unknown);
    } catch {
      return null;
    }
  });
  if (app) return sampleFromTrip(app, "app");

  const cf = await fetchServerUtcMs(
    "https://www.cloudflare.com/cdn-cgi/trace",
    parseCloudflareTrace,
  );
  if (cf) {
    // Cloudflare `ts` is whole seconds — widen the honesty band.
    return sampleFromTrip(cf, "cloudflare", 500);
  }
  return null;
}

export function clockSkewTone(sample: NetworkTimeSample): ClockSkewTone {
  const abs = Math.abs(sample.skewMs);
  const u = sample.uncertaintyMs;
  if (abs <= u + OK_SLACK_MS) return "ok";
  if (abs <= u + DANGER_SLACK_MS) return "warn";
  return "danger";
}

/** Human skew copy — milliseconds under 1s, else seconds. */
export function formatSkewMs(skewMs: number): string {
  const abs = Math.abs(skewMs);
  const ahead = skewMs >= 0;
  if (abs < 1000) {
    return `${abs} ms ${ahead ? "ahead" : "behind"}`;
  }
  const sec = abs / 1000;
  const label = sec < 10 ? sec.toFixed(1) : String(Math.round(sec));
  return `${label} s ${ahead ? "ahead" : "behind"}`;
}
