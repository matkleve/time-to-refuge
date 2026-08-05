import { clockSkewTone, type ClockSkewTone } from "@/lib/network-time";
import type {
  ClockProbeState,
  LocationInfo,
  ProbeTone,
  Status,
} from "@/lib/location-check/types";

export function deriveMismatch(
  status: Status,
  info: LocationInfo | null,
): boolean {
  return (
    (status === "ok" || status === "unavailable") &&
    info !== null &&
    !info.matchesLocation
  );
}

export function deriveClockTone(clock: ClockProbeState): ClockSkewTone | null {
  if (clock.status !== "ready") return null;
  return clockSkewTone(clock.sample);
}

export function deriveTrouble(
  status: Status,
  info: LocationInfo | null,
  mismatch: boolean,
  clockDanger: boolean,
): boolean {
  return (
    status === "denied" ||
    status === "error" ||
    mismatch ||
    (status === "unavailable" && !info?.matchesLocation) ||
    clockDanger
  );
}

export function deriveSoftUnavailable(
  status: Status,
  info: LocationInfo | null,
): boolean {
  return status === "unavailable" && Boolean(info?.matchesLocation);
}

export function deriveProbeTone(
  status: Status,
  clock: ClockProbeState,
  trouble: boolean,
  softUnavailable: boolean,
  clockWarn: boolean,
  info: LocationInfo | null,
): ProbeTone {
  if (status === "checking" || clock.status === "probing") return "checking";
  if (trouble) return "danger";
  if (softUnavailable || clockWarn) return "warn";
  if (status === "ok" && info?.matchesLocation) return "ok";
  return "idle";
}

export function deriveBadgeLabel(
  status: Status,
  clock: ClockProbeState,
  clockDanger: boolean,
  info: LocationInfo | null,
  softUnavailable: boolean,
  clockWarn: boolean,
  trouble: boolean,
): string {
  if (status === "checking" || clock.status === "probing") return "Checking…";
  if (clockDanger) return "Check clock";
  if (status === "ok" && info?.matchesLocation) return info.city || "Zone OK";
  if (softUnavailable) return "Zone OK?";
  if (clockWarn) return "Clock?";
  if (trouble) return "Check clock";
  return "Check zone";
}

export function deriveSuccessAria(info: LocationInfo | null): string {
  if (info?.matchKind === "iana") {
    return `Time zone matches this place (${info.place}). Open to review.`;
  }
  if (info?.matchKind === "offset") {
    return `Device UTC offset matches this place (${info.place}). Open to review.`;
  }
  if (info?.matchKind === "rough") {
    return `Rough time-zone check passed for this place. Open to review.`;
  }
  return "Check this device's time zone before the ceremony";
}

export function deriveButtonAria(
  status: Status,
  info: LocationInfo | null,
  mismatch: boolean,
  softUnavailable: boolean,
  successAria: string,
): string {
  if (status === "ok" && info?.matchesLocation) return successAria;
  if (mismatch) {
    return `Warning: this device's time zone may not match ${info?.place || "your location"}. Open to review.`;
  }
  if (softUnavailable) {
    return "Place name unavailable; rough time-zone check passed. Open to review.";
  }
  return "Check this device's time zone against its location before the ceremony";
}
