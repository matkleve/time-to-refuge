import {
  AlertTriangle,
  Check,
  Clock,
  Loader2,
  MapPin,
} from "lucide-react";
import type { ClockProbeState, LocationInfo, Status } from "@/lib/location-check/types";

export function LocationCheckBadgeIcon({
  status,
  clock,
  trouble,
  info,
  softUnavailable,
}: {
  status: Status;
  clock: ClockProbeState;
  trouble: boolean;
  info: LocationInfo | null;
  softUnavailable: boolean;
}) {
  if (status === "checking" || clock.status === "probing") {
    return <Loader2 className="size-3.5 animate-spin" strokeWidth={2.5} />;
  }
  if (trouble) {
    return <AlertTriangle className="size-3.5" strokeWidth={2.5} />;
  }
  if (status === "ok" && info?.matchesLocation) {
    return <Check className="size-3.5" strokeWidth={2.5} />;
  }
  if (softUnavailable) {
    return <MapPin className="size-3.5" strokeWidth={2.5} />;
  }
  return <Clock className="size-3.5" strokeWidth={2.5} />;
}
