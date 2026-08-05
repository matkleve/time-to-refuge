import {
  clockSkewTone,
  formatSkewMs,
  type NetworkTimeSample,
} from "@/lib/network-time";
import { skewDot } from "@/lib/location-check/tone-styles";
import { cn } from "@/lib/utils";
import { SkewRailDots } from "./SkewRailDots";

function skewRailLayout(sample: NetworkTimeSample) {
  const tone = clockSkewTone(sample);
  const halfRange = Math.max(
    sample.uncertaintyMs * 3,
    Math.abs(sample.skewMs) * 1.35,
    500,
  );
  const toPct = (ms: number) =>
    Math.min(100, Math.max(0, ((ms + halfRange) / (2 * halfRange)) * 100));
  const netPct = toPct(0);
  const hostPct = toPct(sample.skewMs);
  const bandLeft = toPct(-sample.uncertaintyMs);
  const bandRight = toPct(sample.uncertaintyMs);
  const aligned = Math.abs(hostPct - netPct) < 2.5;
  const rangeLabel =
    halfRange >= 1000
      ? `±${(halfRange / 1000).toFixed(halfRange >= 10_000 ? 0 : 1)} s`
      : `±${Math.round(halfRange)} ms`;

  return {
    tone,
    netPct,
    hostPct,
    bandLeft,
    bandRight,
    aligned,
    rangeLabel,
  };
}

function SkewRailMarkers({
  sample,
  hostNoun,
  HostNoun,
}: {
  sample: NetworkTimeSample;
  hostNoun: string;
  HostNoun: string;
}) {
  const { tone, netPct, hostPct, bandLeft, bandRight, aligned } =
    skewRailLayout(sample);

  return (
    <>
      <div className="flex items-center justify-between gap-2 text-xs font-medium tracking-wide text-muted uppercase">
        <span>{HostNoun} slow</span>
        <span>Clock probe</span>
        <span>{HostNoun} fast</span>
      </div>

      <div className="relative h-4">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink/10" />
        <div
          aria-hidden
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-flagblue-600/20"
          style={{
            left: `${bandLeft}%`,
            width: `${Math.max(2, bandRight - bandLeft)}%`,
          }}
        />
        <div
          aria-hidden
          className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-ink/25"
          style={{ left: `${netPct}%` }}
        />
        <SkewRailDots
          tone={tone}
          netPct={netPct}
          hostPct={hostPct}
          aligned={aligned}
          hostNoun={hostNoun}
          HostNoun={HostNoun}
        />
      </div>
    </>
  );
}

function SkewRailSummary({
  sample,
  HostNoun,
}: {
  sample: NetworkTimeSample;
  HostNoun: string;
}) {
  const { tone, rangeLabel } = skewRailLayout(sample);

  return (
    <>
      <div className="flex items-start justify-between gap-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", skewDot.network)} aria-hidden />
          Network UTC
        </span>
        <span className="text-center tabular-nums text-subtle">{rangeLabel}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", skewDot[tone])} aria-hidden />
          {HostNoun}
        </span>
      </div>

      <p
        className={cn(
          "text-sm",
          tone === "ok" && "text-saffron-800",
          tone === "warn" && "text-saffron-800",
          tone === "danger" && "text-danger-700",
        )}
      >
        {HostNoun} is{" "}
        <span className="font-semibold tabular-nums">{formatSkewMs(sample.skewMs)}</span>
        {" · "}
        round-trip {sample.rttMs} ms · uncertainty ±{sample.uncertaintyMs} ms
      </p>
    </>
  );
}

/**
 * Horizontal rail: network UTC at center (0), host mark at measured skew.
 * Uncertainty band = ±RTT/2 from the probe.
 */
export function ClockSkewRail({
  sample,
  hostNoun,
  HostNoun,
}: {
  sample: NetworkTimeSample;
  hostNoun: string;
  HostNoun: string;
}) {
  return (
    <div className="space-y-2 rounded-2xl bg-ink/[0.04] px-3 py-3">
      <SkewRailMarkers sample={sample} hostNoun={hostNoun} HostNoun={HostNoun} />
      <SkewRailSummary sample={sample} HostNoun={HostNoun} />
    </div>
  );
}
