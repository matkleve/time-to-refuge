import type { ClockProbeState, LocationInfo, Status } from "@/lib/location-check/types";

export function PanelFootnotes({
  detail,
  status,
  info,
  clock,
  hostNoun,
}: {
  detail?: string;
  status: Status;
  info: LocationInfo | null;
  clock: ClockProbeState;
  hostNoun: string;
}) {
  return (
    <>
      {status === "denied" && info ? (
        <p className="mt-3 rounded-2xl bg-ink/[0.04] px-3 py-2 font-mono text-sm text-ink">
          {info.deviceZone.replace(/_/g, " ")} · {info.deviceOffset}
        </p>
      ) : null}

      {detail ? <p className="mt-3 text-sm text-muted">{detail}</p> : null}

      {clock.status === "ready" ? (
        <p className="mt-2 text-sm text-subtle">
          Network probe uses a public UTC edge clock and round-trip delay (±
          {clock.sample.uncertaintyMs} ms). It is not a lab atomic lock — if the{" "}
          {hostNoun} looks wrong, fix Date &amp; Time in settings before the ceremony.
        </p>
      ) : status === "ok" || status === "unavailable" ? (
        <p className="mt-2 text-sm text-subtle">
          Zone check does not prove the clock is synced to the second. If the time
          itself looks wrong, fix Date &amp; Time in settings before the ceremony.
        </p>
      ) : null}
    </>
  );
}
