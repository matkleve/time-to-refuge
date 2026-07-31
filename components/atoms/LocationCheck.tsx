"use client";

import { useCallback, useState } from "react";
import { AlertTriangle, Check, Clock, Loader2 } from "lucide-react";
import { useDismissible } from "@/lib/use-dismissible";
import { cn } from "@/lib/utils";
import { Surface } from "@/components/atoms/Surface";

type Status = "idle" | "checking" | "ok" | "denied" | "unavailable" | "error";

type MatchKind = "iana" | "offset" | "rough" | "none";

interface LocationInfo {
  place: string;
  city: string;
  /** Device-reported IANA zone. */
  deviceZone: string;
  deviceOffset: string;
  /** IANA zone for the GPS place, when the lookup returned one. */
  placeZone: string | null;
  placeOffset: string;
  matchesLocation: boolean;
  matchKind: MatchKind;
}

type GeocodePayload = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
  localityInfo?: {
    informative?: Array<{ name?: string; description?: string }>;
  };
};

function formatOffsetMinutes(offsetMin: number): string {
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(Math.round(offsetMin));
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${h}:${m}`;
}

function deviceOffsetMinutes(): number {
  return -new Date().getTimezoneOffset();
}

/**
 * Wall-clock UTC offset (minutes) for an IANA zone at `at`.
 * Same instant, different zone — no network required once the zone id is known.
 */
function offsetMinutesInZone(timeZone: string, at = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);

  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return (asUtc - at.getTime()) / 60_000;
}

/** Free reverse-geocode client embeds the IANA id under localityInfo.informative. */
function timezoneFromGeocode(data: GeocodePayload): string | null {
  const hit = data.localityInfo?.informative?.find(
    (entry) =>
      entry.description === "time zone" &&
      typeof entry.name === "string" &&
      entry.name.includes("/"),
  );
  return hit?.name ?? null;
}

/**
 * Longitude ÷ 15 — only a fallback when the place lookup has no IANA zone.
 * Real zones follow borders; tolerance is deliberately loose (see below).
 */
function expectedOffsetHoursFromLongitude(longitude: number): number {
  return Math.round(longitude / 15);
}

const ROUGH_MISMATCH_TOLERANCE_HOURS = 3.5;

function roughOffsetsMatch(deviceHours: number, expectedHours: number): boolean {
  const diff = Math.abs(deviceHours - expectedHours);
  return Math.min(diff, 24 - diff) <= ROUGH_MISMATCH_TOLERANCE_HOURS;
}

function compareZones(deviceZone: string, placeZone: string): {
  matches: boolean;
  kind: MatchKind;
  placeOffsetMin: number;
} {
  const placeOffsetMin = offsetMinutesInZone(placeZone);
  const deviceOffsetMin = deviceOffsetMinutes();
  if (deviceZone === placeZone) {
    return { matches: true, kind: "iana", placeOffsetMin };
  }
  // Same UTC offset (e.g. Europe/Vienna vs Europe/Berlin) is fine for wall time.
  if (Math.abs(deviceOffsetMin - placeOffsetMin) < 1) {
    return { matches: true, kind: "offset", placeOffsetMin };
  }
  return { matches: false, kind: "none", placeOffsetMin };
}

/**
 * Settles "is this device's *time zone* plausible for where we are?" before
 * the ceremony — the usual way recorded times go wrong (phone still on a
 * travel zone). It does **not** prove the clock is accurate to the second;
 * that needs a trusted time server, and retreat centers are often offline.
 *
 * Prefer IANA zone from reverse-geocode over a longitude estimate. See
 * design system §6b.
 */
export function LocationCheck() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [info, setInfo] = useState<LocationInfo | null>(null);

  // Same disclosure pattern as a field row's actions (design system §5c),
  // longer pause — several lines to read. onDismiss must stay stable: this
  // button sits beside the live clock (rAF re-renders), so an inline arrow
  // would reset the idle timer every frame.
  const dismiss = useCallback(() => setOpen(false), []);
  const popoverRef = useDismissible<HTMLDivElement>({
    active: open,
    onDismiss: dismiss,
    timeoutMs: 12000,
  });

  function handleOpen() {
    setOpen(true);
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
            setInfo({
              place,
              city: city || place,
              deviceZone,
              deviceOffset,
              placeZone,
              placeOffset: formatOffsetMinutes(placeOffsetMin),
              matchesLocation: matches,
              matchKind: matches ? kind : "none",
            });
            setStatus("ok");
            return;
          }

          // Named the place but no IANA — fall back to longitude estimate.
          const expectedHours = expectedOffsetHoursFromLongitude(pos.coords.longitude);
          const matches = roughOffsetsMatch(deviceOffsetMinutes() / 60, expectedHours);
          setInfo({
            place,
            city: city || place,
            deviceZone,
            deviceOffset,
            placeZone: null,
            placeOffset: formatOffsetMinutes(expectedHours * 60),
            matchesLocation: matches,
            matchKind: matches ? "rough" : "none",
          });
          setStatus("ok");
        } catch {
          // GPS worked; naming / zone lookup did not. Still run the rough
          // longitude check so a travel-zone phone can be flagged offline.
          const expectedHours = expectedOffsetHoursFromLongitude(pos.coords.longitude);
          const matches = roughOffsetsMatch(deviceOffsetMinutes() / 60, expectedHours);
          setInfo({
            place: "",
            city: "",
            deviceZone,
            deviceOffset,
            placeZone: null,
            placeOffset: formatOffsetMinutes(expectedHours * 60),
            matchesLocation: matches,
            matchKind: matches ? "rough" : "none",
          });
          setStatus("unavailable");
        }
      },
      () => {
        const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setInfo({
          place: "",
          city: "",
          deviceZone,
          deviceOffset: formatOffsetMinutes(deviceOffsetMinutes()),
          placeZone: null,
          placeOffset: "",
          matchesLocation: false,
          matchKind: "none",
        });
        setStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  const mismatch = (status === "ok" || status === "unavailable") && info !== null && !info.matchesLocation;
  const trouble =
    status === "denied" || status === "error" || mismatch || (status === "unavailable" && !info?.matchesLocation);
  // unavailable + rough match: warn soft on badge? Design: still show place/ok
  // only when named. If unnamed but match, treat as caution not success.
  const softUnavailable = status === "unavailable" && info?.matchesLocation;

  const badgeLabel =
    status === "checking"
      ? "Checking…"
      : status === "ok" && info?.matchesLocation
        ? info.city || "Zone OK"
        : softUnavailable
          ? "Zone OK?"
          : trouble
            ? "Check clock"
            : "Check zone";

  const successAria =
    info?.matchKind === "iana"
      ? `Time zone matches this place (${info.place}). Open to review.`
      : info?.matchKind === "offset"
        ? `Device UTC offset matches this place (${info.place}). Open to review.`
        : info?.matchKind === "rough"
          ? `Rough time-zone check passed for this place. Open to review.`
          : "Check this device's time zone before the ceremony";

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
        aria-label={
          status === "ok" && info?.matchesLocation
            ? successAria
            : mismatch
              ? `Warning: this device's time zone may not match ${info?.place || "your location"}. Open to review.`
              : softUnavailable
                ? `Place name unavailable; rough time-zone check passed. Open to review.`
                : "Check this device's time zone against its location before the ceremony"
        }
        className={cn(
          "no-select flex h-9 max-w-36 items-center gap-1.5 rounded-full border pr-3 pl-2.5 shadow-sm",
          "transition-[color,background-color,border-color,transform] duration-200 ease-out active:scale-95",
          /* Opaque light fill — glass was too see-through on the record button. */
          trouble
            ? "border-danger-200 bg-danger-50 text-danger-700"
            : softUnavailable
              ? "border-saffron-200 bg-saffron-50 text-saffron-800"
              : status === "ok" && info?.matchesLocation
                ? "border-saffron-200 bg-saffron-50 text-saffron-800"
                : "border-white/80 bg-white/95 text-muted hover:bg-white hover:text-ink",
        )}
      >
        {status === "checking" ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden strokeWidth={2.5} />
        ) : trouble ? (
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2.5} />
        ) : status === "ok" && info?.matchesLocation ? (
          <Check className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2.5} />
        ) : softUnavailable ? (
          <Clock className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2.5} />
        ) : (
          <Clock className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2.5} />
        )}
        <span className="truncate text-sm font-medium">{badgeLabel}</span>
      </button>

      {open && (
        <Surface
          material="glass-panel"
          rim
          className="animate-scale-in absolute right-0 bottom-11 z-20 w-72 rounded-2xl p-3.5 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {status === "checking" && (
            <>
              <p className="mb-1 text-xs tracking-wide text-saffron-700 uppercase">Checking</p>
              <p className="text-sm text-muted">Finding where this device is…</p>
            </>
          )}

          {status === "ok" && info && info.matchesLocation && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">
                {info.matchKind === "iana"
                  ? "Time zone matches this place"
                  : info.matchKind === "offset"
                    ? "UTC offset matches this place"
                    : "Time zone looks plausible here"}
              </p>
              <p className="text-base text-ink">{info.place}</p>
              <dl className="space-y-1 text-sm text-muted">
                {info.placeZone ? (
                  <div className="flex justify-between gap-2">
                    <dt className="shrink-0">This place</dt>
                    <dd className="truncate text-right text-ink">
                      {info.placeZone} · {info.placeOffset}
                    </dd>
                  </div>
                ) : (
                  <div className="flex justify-between gap-2">
                    <dt className="shrink-0">Expected here</dt>
                    <dd className="truncate text-right text-ink">~{info.placeOffset}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <dt className="shrink-0">This device</dt>
                  <dd className="truncate text-right text-ink">
                    {info.deviceZone} · {info.deviceOffset}
                  </dd>
                </div>
              </dl>
              <p className="text-sm text-muted">
                {info.matchKind === "iana"
                  ? "Same zone id as this location — the phone isn’t still set somewhere you traveled from."
                  : info.matchKind === "offset"
                    ? "Different zone name, same UTC offset — wall-clock time for this place still lines up."
                    : "Rough check from GPS longitude (no zone name from the map). Good enough to catch a travel zone many hours off."}
              </p>
              <p className="text-sm text-muted">
                Does not prove the clock is synced to the second. If the time itself looks wrong, fix Date &amp; Time in settings before the ceremony.
              </p>
            </div>
          )}

          {status === "ok" && info && !info.matchesLocation && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-danger-700">
                Time zone doesn&apos;t match this place
              </p>
              <p className="text-base text-ink">{info.place}</p>
              <dl className="space-y-1 text-sm text-muted">
                {info.placeZone ? (
                  <div className="flex justify-between gap-2">
                    <dt className="shrink-0">This place</dt>
                    <dd className="truncate text-right text-ink">
                      {info.placeZone} · {info.placeOffset}
                    </dd>
                  </div>
                ) : (
                  <div className="flex justify-between gap-2">
                    <dt className="shrink-0">Expected here</dt>
                    <dd className="truncate text-right text-ink">~{info.placeOffset}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <dt className="shrink-0">This device</dt>
                  <dd className="truncate text-right text-ink">
                    {info.deviceZone} · {info.deviceOffset}
                  </dd>
                </div>
              </dl>
              <p className="text-sm text-muted">
                If you just traveled here, the clock may still be set to where you came from. Open Date &amp; Time settings and turn on automatic time zone (or pick the local zone) before the ceremony starts.
              </p>
            </div>
          )}

          {status === "denied" && info && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-danger-700">Location access is off</p>
              <p className="text-sm text-muted">
                Device reports {info.deviceZone} ({info.deviceOffset}). Without location that can&apos;t be checked against where you are.
              </p>
              <p className="text-sm text-muted">
                If you traveled here, confirm the time zone yourself in Date &amp; Time settings before starting.
              </p>
            </div>
          )}

          {status === "unavailable" && info && (
            <div className="space-y-2">
              <p
                className={cn(
                  "text-sm font-medium",
                  info.matchesLocation ? "text-ink" : "text-danger-700",
                )}
              >
                {info.matchesLocation
                  ? "Couldn't name the place — rough check passed"
                  : "Couldn't name the place — zone may be wrong"}
              </p>
              <p className="text-sm text-muted">
                Location worked, but the place/zone lookup needs a network this device doesn&apos;t have right now.
              </p>
              <dl className="space-y-1 text-sm text-muted">
                <div className="flex justify-between gap-2">
                  <dt className="shrink-0">Expected (rough)</dt>
                  <dd className="truncate text-right text-ink">~{info.placeOffset}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="shrink-0">This device</dt>
                  <dd className="truncate text-right text-ink">
                    {info.deviceZone} · {info.deviceOffset}
                  </dd>
                </div>
              </dl>
              <p className="text-sm text-muted">
                {info.matchesLocation
                  ? "Longitude suggests this offset is plausible. Confirm the zone in Date &amp; Time if you traveled recently."
                  : "Device offset is far from what longitude suggests here. Check Date &amp; Time before starting."}
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-danger-700">Can&apos;t check location here</p>
              <p className="text-sm text-muted">
                This browser or device doesn&apos;t support location. Check date, time, and time zone in settings directly before the ceremony starts.
              </p>
            </div>
          )}
        </Surface>
      )}
    </div>
  );
}
