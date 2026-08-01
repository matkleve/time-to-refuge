"use client";

import { useCallback, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Loader2,
  MapPin,
  Smartphone,
} from "lucide-react";
import { useDismissible } from "@/lib/use-dismissible";
import { controlH } from "@/lib/control-size";
import { userFeedbackClass } from "@/lib/user-feedback";
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

type ProbeTone = "idle" | "ok" | "warn" | "danger" | "checking";

function formatOffsetMinutes(offsetMin: number): string {
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(Math.round(offsetMin));
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${h}:${m}`;
}

function parseOffsetLabel(label: string): number | null {
  const m = label.replace(/^~/, "").match(/UTC([+-])(\d{2}):(\d{2})/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3]));
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

const toneBadge: Record<ProbeTone, string> = {
  idle: "border-white/80 bg-white/95 text-muted hover:bg-white hover:text-ink",
  checking: "border-white/80 bg-white/95 text-muted",
  ok: "border-saffron-200 bg-saffron-50 text-saffron-800",
  warn: "border-saffron-200 bg-saffron-50 text-saffron-800",
  danger: "border-danger-200 bg-danger-50 text-danger-700",
};

const toneMark: Record<ProbeTone, string> = {
  idle: "bg-ink/8 text-muted",
  checking: "bg-ink/8 text-muted",
  ok: "bg-saffron-400/25 text-saffron-800",
  warn: "bg-saffron-400/25 text-saffron-800",
  danger: "bg-danger-500/15 text-danger-700",
};

const toneProbe: Record<"ok" | "danger" | "neutral", string> = {
  ok: "bg-saffron-400",
  danger: "bg-danger-500",
  neutral: "bg-ink/25",
};

/** Map UTC offset minutes onto a 24h track (−12h … +12h). */
function offsetToPercent(minutes: number): number {
  const clamped = Math.max(-12 * 60, Math.min(12 * 60, minutes));
  return ((clamped + 12 * 60) / (24 * 60)) * 100;
}

function OffsetProbe({
  placeOffset,
  deviceOffset,
  matched,
}: {
  placeOffset: string;
  deviceOffset: string;
  matched: boolean;
}) {
  const placeMin = parseOffsetLabel(placeOffset);
  const deviceMin = parseOffsetLabel(deviceOffset);
  if (placeMin === null || deviceMin === null) return null;

  const placePct = offsetToPercent(placeMin);
  const devicePct = offsetToPercent(deviceMin);
  const aligned = matched || Math.abs(placePct - devicePct) < 1.2;

  return (
    <div className="space-y-2 rounded-2xl bg-ink/[0.04] px-3 py-3">
      <div className="flex items-center justify-between text-xs font-medium tracking-wide text-muted uppercase">
        <span>UTC −12</span>
        <span>Offset probe</span>
        <span>+12</span>
      </div>
      <div className="relative h-3">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink/10" />
        {/* Noon tick */}
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-ink/20"
        />
        {aligned ? (
          <span
            className={cn(
              "absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
              matched ? toneProbe.ok : toneProbe.danger,
            )}
            style={{ left: `${placePct}%` }}
            title="Here & device"
          />
        ) : (
          <>
            <span
              className={cn(
                "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
                toneProbe.ok,
              )}
              style={{ left: `${placePct}%` }}
              title="Here"
            />
            <span
              className={cn(
                "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
                toneProbe.danger,
              )}
              style={{ left: `${devicePct}%` }}
              title="Device"
            />
          </>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", toneProbe.ok)} aria-hidden />
          Here {placeOffset.replace(/^~/, "≈")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn("size-2 rounded-full", matched ? toneProbe.ok : toneProbe.danger)}
            aria-hidden
          />
          Device {deviceOffset}
        </span>
      </div>
    </div>
  );
}

function SideCard({
  icon,
  label,
  zone,
  offset,
  tone,
}: {
  icon: ReactNode;
  label: string;
  zone: string;
  offset: string;
  tone: "ok" | "danger" | "neutral";
}) {
  return (
    <div
      className={cn(
        "min-w-0 flex-1 rounded-2xl px-2.5 py-2.5",
        tone === "ok" && "bg-saffron-400/15",
        tone === "danger" && "bg-danger-500/10",
        tone === "neutral" && "bg-ink/[0.04]",
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
        {icon}
        {label}
      </div>
      <p className="mt-1 truncate font-mono text-sm font-semibold text-ink">
        {offset || "—"}
      </p>
      <p className="mt-0.5 truncate text-xs text-muted">{zone || "Unknown"}</p>
    </div>
  );
}

function StatusMark({
  tone,
  children,
  size = "sm",
}: {
  tone: ProbeTone;
  children: ReactNode;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        size === "sm" ? "size-7" : "size-12",
        toneMark[tone],
      )}
      aria-hidden
    >
      {children}
    </span>
  );
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

  const mismatch =
    (status === "ok" || status === "unavailable") && info !== null && !info.matchesLocation;
  const trouble =
    status === "denied" ||
    status === "error" ||
    mismatch ||
    (status === "unavailable" && !info?.matchesLocation);
  const softUnavailable = status === "unavailable" && info?.matchesLocation;

  const tone: ProbeTone =
    status === "checking"
      ? "checking"
      : trouble
        ? "danger"
        : softUnavailable
          ? "warn"
          : status === "ok" && info?.matchesLocation
            ? "ok"
            : "idle";

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

  const badgeIcon =
    status === "checking" ? (
      <Loader2 className="size-3.5 animate-spin" strokeWidth={2.5} />
    ) : trouble ? (
      <AlertTriangle className="size-3.5" strokeWidth={2.5} />
    ) : status === "ok" && info?.matchesLocation ? (
      <Check className="size-3.5" strokeWidth={2.5} />
    ) : softUnavailable ? (
      <MapPin className="size-3.5" strokeWidth={2.5} />
    ) : (
      <Clock className="size-3.5" strokeWidth={2.5} />
    );

  function headline(): { title: string; detail?: string } {
    if (status === "checking") {
      return { title: "Finding this place…", detail: "Comparing GPS to the device zone." };
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
    if (status === "ok" && info && !info.matchesLocation) {
      return {
        title: "Time zone doesn't match this place",
        detail:
          "If you just traveled here, the clock may still be set to where you came from. Turn on automatic time zone (or pick the local zone) before the ceremony starts.",
      };
    }
    if (status === "ok" && info?.matchesLocation) {
      if (info.matchKind === "iana") {
        return {
          title: "Time zone matches this place",
          detail:
            "Same zone id as this location — the phone isn’t still set somewhere you traveled from.",
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
    return { title: "Check zone" };
  }

  const { title, detail } = headline();

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
          "no-select flex max-w-44 items-center gap-1.5 rounded-full border py-0.5 pr-3 pl-0.5 shadow-sm",
          controlH.md,
          userFeedbackClass({ press: "sm" }),
          /* Opaque light fill — glass was too see-through on the record button. */
          toneBadge[tone],
        )}
      >
        <StatusMark tone={tone}>{badgeIcon}</StatusMark>
        <span className="truncate text-sm font-medium">{badgeLabel}</span>
      </button>

      {open && (
        <Surface
          material="glass-panel"
          rim
          className="animate-scale-in absolute right-0 bottom-11 z-20 w-[19.5rem] rounded-3xl p-4 text-left shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-3">
            <StatusMark tone={tone} size="lg">
              {status === "checking" ? (
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

          {info && (info.placeOffset || info.deviceOffset) && status !== "checking" ? (
            <div className="mt-3 space-y-2.5">
              <div className="flex gap-2">
                <SideCard
                  icon={<MapPin className="size-3.5" aria-hidden />}
                  label="Here"
                  zone={
                    info.placeZone
                      ? info.placeZone.replace(/_/g, " ")
                      : info.placeOffset
                        ? "Rough from GPS"
                        : "—"
                  }
                  offset={
                    info.placeOffset
                      ? info.placeZone
                        ? info.placeOffset
                        : `≈ ${info.placeOffset}`
                      : "—"
                  }
                  tone={
                    info.matchesLocation ? "ok" : info.placeOffset ? "danger" : "neutral"
                  }
                />
                <SideCard
                  icon={<Smartphone className="size-3.5" aria-hidden />}
                  label="Device"
                  zone={info.deviceZone.replace(/_/g, " ")}
                  offset={info.deviceOffset}
                  tone={info.matchesLocation ? "ok" : "danger"}
                />
              </div>

              {info.placeOffset && info.deviceOffset ? (
                <OffsetProbe
                  placeOffset={info.placeOffset}
                  deviceOffset={info.deviceOffset}
                  matched={info.matchesLocation}
                />
              ) : null}
            </div>
          ) : null}

          {status === "denied" && info ? (
            <p className="mt-3 rounded-2xl bg-ink/[0.04] px-3 py-2 font-mono text-sm text-ink">
              {info.deviceZone.replace(/_/g, " ")} · {info.deviceOffset}
            </p>
          ) : null}

          {detail ? <p className="mt-3 text-sm text-muted">{detail}</p> : null}

          {status === "ok" || status === "unavailable" ? (
            <p className="mt-2 text-xs text-subtle">
              Does not prove the clock is synced to the second. If the time itself looks wrong,
              fix Date &amp; Time in settings before the ceremony.
            </p>
          ) : null}
        </Surface>
      )}
    </div>
  );
}
