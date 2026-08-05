import {
  AlertTriangle,
  Check,
  Loader2,
  MapPin,
} from "lucide-react";
import type {
  ClockProbeState,
  LocationInfo,
  ProbeTone,
  Status,
} from "@/lib/location-check/types";
import { cn } from "@/lib/utils";
import { StatusMark } from "./StatusMark";

export function PanelHeader({
  tone,
  trouble,
  title,
  info,
  status,
  clock,
}: {
  tone: ProbeTone;
  trouble: boolean;
  title: string;
  info: LocationInfo | null;
  status: Status;
  clock: ClockProbeState;
}) {
  return (
    <div className="flex items-start gap-3">
      <StatusMark tone={tone} size="lg">
        {status === "checking" || clock.status === "probing" ? (
          <Loader2 className="size-6 animate-spin" strokeWidth={2.25} />
        ) : trouble ? (
          <AlertTriangle className="size-6" strokeWidth={2.25} />
        ) : status === "ok" && info?.matchesLocation ? (
          <Check className="size-6" strokeWidth={2.25} />
        ) : (
          <MapPin className="size-6" strokeWidth={2.25} />
        )}
      </StatusMark>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-display text-lg font-semibold leading-snug",
            trouble ? "text-danger-700" : "text-ink",
          )}
        >
          {title}
        </p>
        {info?.place ? (
          <p className="mt-0.5 truncate text-sm text-muted">{info.place}</p>
        ) : null}
      </div>
    </div>
  );
}
