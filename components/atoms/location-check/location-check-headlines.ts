import type { LocationInfo, Status } from "@/lib/location-check/types";
import { parseOffsetLabel } from "@/lib/location-check/geo";

/** Plain-language gap between place and device UTC offsets. */
export function offsetGapCopy(
  placeOffset: string,
  deviceOffset: string,
  matched: boolean,
  hostNoun: string,
): string | null {
  const placeMin = parseOffsetLabel(placeOffset);
  const deviceMin = parseOffsetLabel(deviceOffset);
  if (placeMin === null || deviceMin === null) return null;
  const diffMin = Math.abs(deviceMin - placeMin);
  if (matched || diffMin < 1) {
    return `Same UTC offset — this ${hostNoun}'s wall clock matches this place.`;
  }
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  const Host = hostNoun.charAt(0).toUpperCase() + hostNoun.slice(1);
  if (hours === 0) {
    return `${Host} is ${mins} minutes off from this place.`;
  }
  if (mins === 0) {
    return `${Host} is ${hours} hour${hours === 1 ? "" : "s"} off from this place.`;
  }
  return `${Host} is about ${hours}h ${mins}m off from this place.`;
}

function headlineForOk(
  info: LocationInfo,
  hostNoun: string,
): { title: string; detail?: string } {
  if (!info.matchesLocation) {
    return {
      title: "Time zone doesn't match this place",
      detail:
        "If you just traveled here, the clock may still be set to where you came from. Turn on automatic time zone (or pick the local zone) before the ceremony starts.",
    };
  }
  if (info.matchKind === "iana") {
    return {
      title: "Time zone matches this place",
      detail:
        "Same zone id as this location — the " +
        hostNoun +
        " isn't still set somewhere you traveled from.",
    };
  }
  if (info.matchKind === "offset") {
    return {
      title: "UTC offset matches this place",
      detail:
        "Different zone name, same UTC offset — wall-clock time for this place still lines up.",
    };
  }
  return {
    title: "Time zone looks plausible here",
    detail:
      "Rough check from GPS longitude (no zone name from the map). Good enough to catch a travel zone many hours off.",
  };
}

export function headline(
  status: Status,
  info: LocationInfo | null,
  hostNoun: string,
): { title: string; detail?: string } {
  if (status === "checking") {
    return {
      title: "Finding this place…",
      detail: "Comparing GPS to the device zone.",
    };
  }
  if (status === "error") {
    return {
      title: "Can't check location here",
      detail:
        "This browser or device doesn't support location. Check date, time, and time zone in settings directly before the ceremony starts.",
    };
  }
  if (status === "denied" && info) {
    return {
      title: "Location access is off",
      detail:
        "Without location, the device zone can't be checked against where you are. Confirm Date & Time yourself if you traveled here.",
    };
  }
  if (status === "unavailable" && info) {
    return {
      title: info.matchesLocation
        ? "Couldn't name the place"
        : "Couldn't name the place — zone may be wrong",
      detail:
        "Location worked, but the place/zone lookup needs a network this device doesn't have right now.",
    };
  }
  if (status === "ok" && info) {
    return headlineForOk(info, hostNoun);
  }
  return { title: "Check zone" };
}
