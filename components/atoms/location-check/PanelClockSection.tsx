import { Loader2 } from "lucide-react";
import type { ClockProbeState } from "@/lib/location-check/types";
import { ClockSkewRail } from "./ClockSkewRail";

export function PanelClockSection({
  clock,
  hostNoun,
  HostNoun,
}: {
  clock: ClockProbeState;
  hostNoun: string;
  HostNoun: string;
}) {
  if (clock.status === "probing") {
    return (
      <p className="mt-3 flex items-center gap-2 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" strokeWidth={2.25} aria-hidden />
        Comparing {hostNoun} time to network UTC…
      </p>
    );
  }

  if (clock.status === "ready") {
    return (
      <div className="mt-3">
        <ClockSkewRail
          sample={clock.sample}
          hostNoun={hostNoun}
          HostNoun={HostNoun}
        />
      </div>
    );
  }

  if (clock.status === "offline") {
    return (
      <p className="mt-3 rounded-2xl bg-ink/[0.04] px-3 py-2 text-sm text-muted">
        No network time — skipped the atomic/UTC probe. Zone check above still
        stands; confirm Date &amp; Time manually if the clock looks wrong.
      </p>
    );
  }

  return null;
}
