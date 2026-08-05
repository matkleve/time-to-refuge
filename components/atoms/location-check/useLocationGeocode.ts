"use client";

import { useCallback, useState } from "react";
import {
  compareZones,
  deviceOffsetMinutes,
  expectedOffsetHoursFromLongitude,
  formatOffsetMinutes,
  roughOffsetsMatch,
  timezoneFromGeocode,
} from "@/lib/location-check/geo";
import type {
  GeocodePayload,
  LocationInfo,
  Status,
} from "@/lib/location-check/types";

function buildDeniedInfo(deviceZone: string): LocationInfo {
  return {
    place: "",
    city: "",
    deviceZone,
    deviceOffset: formatOffsetMinutes(deviceOffsetMinutes()),
    placeZone: null,
    placeOffset: "",
    matchesLocation: false,
    matchKind: "none",
  };
}

function buildRoughInfo(
  pos: GeolocationPosition,
  deviceZone: string,
  deviceOffset: string,
  place: string,
  city: string,
): LocationInfo {
  const expectedHours = expectedOffsetHoursFromLongitude(pos.coords.longitude);
  const matches = roughOffsetsMatch(deviceOffsetMinutes() / 60, expectedHours);
  return {
    place,
    city,
    deviceZone,
    deviceOffset,
    placeZone: null,
    placeOffset: formatOffsetMinutes(expectedHours * 60),
    matchesLocation: matches,
    matchKind: matches ? "rough" : "none",
  };
}

async function resolvePlaceFromPosition(
  pos: GeolocationPosition,
  deviceZone: string,
  deviceOffset: string,
): Promise<{ info: LocationInfo; status: Status }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`,
    );
    if (!res.ok) throw new Error(`geocode ${res.status}`);
    const data = (await res.json()) as GeocodePayload;
    const city = data.city || data.locality || "";
    const place =
      [city, data.principalSubdivision, data.countryName].filter(Boolean).join(", ") ||
      "Unknown place";
    const placeZone = timezoneFromGeocode(data);

    if (placeZone) {
      const { matches, kind, placeOffsetMin } = compareZones(deviceZone, placeZone);
      return {
        info: {
          place,
          city: city || place,
          deviceZone,
          deviceOffset,
          placeZone,
          placeOffset: formatOffsetMinutes(placeOffsetMin),
          matchesLocation: matches,
          matchKind: matches ? kind : "none",
        },
        status: "ok",
      };
    }

    return {
      info: buildRoughInfo(pos, deviceZone, deviceOffset, place, city || place),
      status: "ok",
    };
  } catch {
    return {
      info: buildRoughInfo(pos, deviceZone, deviceOffset, "", ""),
      status: "unavailable",
    };
  }
}

export function useLocationGeocode() {
  const [status, setStatus] = useState<Status>("idle");
  const [info, setInfo] = useState<LocationInfo | null>(null);

  const runGeocode = useCallback(() => {
    if (info || status === "checking") return;
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }
    setStatus("checking");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const deviceOffset = formatOffsetMinutes(deviceOffsetMinutes());
        const { info: resolved, status: resolvedStatus } =
          await resolvePlaceFromPosition(pos, deviceZone, deviceOffset);
        setInfo(resolved);
        setStatus(resolvedStatus);
      },
      () => {
        const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setInfo(buildDeniedInfo(deviceZone));
        setStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, [info, status]);

  return { status, info, runGeocode };
}
