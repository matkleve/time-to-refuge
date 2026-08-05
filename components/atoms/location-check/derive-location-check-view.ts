import type { ClockProbeState, LocationInfo, Status } from "@/lib/location-check/types";
import {
  deriveBadgeLabel,
  deriveButtonAria,
  deriveClockTone,
  deriveMismatch,
  deriveProbeTone,
  deriveSoftUnavailable,
  deriveSuccessAria,
  deriveTrouble,
} from "./location-check-ui";
import { headline, offsetGapCopy } from "./location-check-headlines";

export function deriveLocationCheckView(
  status: Status,
  info: LocationInfo | null,
  clock: ClockProbeState,
  hostNoun: string,
) {
  const mismatch = deriveMismatch(status, info);
  const clockTone = deriveClockTone(clock);
  const clockDanger = clockTone === "danger";
  const clockWarn = clockTone === "warn";
  const trouble = deriveTrouble(status, info, mismatch, clockDanger);
  const softUnavailable = deriveSoftUnavailable(status, info);
  const tone = deriveProbeTone(
    status,
    clock,
    trouble,
    softUnavailable,
    clockWarn,
    info,
  );
  const badgeLabel = deriveBadgeLabel(
    status,
    clock,
    clockDanger,
    info,
    softUnavailable,
    clockWarn,
    trouble,
  );
  const successAria = deriveSuccessAria(info);
  const buttonAria = deriveButtonAria(
    status,
    info,
    mismatch,
    softUnavailable,
    successAria,
  );
  const { title, detail } = headline(status, info, hostNoun);
  const gapCopy =
    info?.placeOffset && info.deviceOffset && status !== "checking"
      ? offsetGapCopy(
          info.placeOffset,
          info.deviceOffset,
          info.matchesLocation,
          hostNoun,
        )
      : null;

  return {
    mismatch,
    trouble,
    softUnavailable,
    tone,
    badgeLabel,
    buttonAria,
    title,
    detail,
    gapCopy,
  };
}
