import type { ClockSkewTone } from "@/lib/network-time";
import { skewDot } from "@/lib/location-check/tone-styles";
import { cn } from "@/lib/utils";

export function SkewRailDots({
  tone,
  netPct,
  hostPct,
  aligned,
  hostNoun,
  HostNoun,
}: {
  tone: ClockSkewTone;
  netPct: number;
  hostPct: number;
  aligned: boolean;
  hostNoun: string;
  HostNoun: string;
}) {
  if (aligned) {
    return (
      <span
        className={cn(
          "absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
          skewDot[tone],
        )}
        style={{ left: `${netPct}%` }}
        title={`Network & ${hostNoun}`}
      />
    );
  }

  return (
    <>
      <span
        className={cn(
          "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
          skewDot.network,
        )}
        style={{ left: `${netPct}%` }}
        title="Network UTC"
      />
      <span
        className={cn(
          "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
          skewDot[tone],
        )}
        style={{ left: `${hostPct}%` }}
        title={HostNoun}
      />
    </>
  );
}
