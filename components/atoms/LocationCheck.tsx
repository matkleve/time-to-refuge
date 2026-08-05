"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Check,
  Clock,
  Loader2,
  MapPin,
  Monitor,
  Smartphone,
} from "lucide-react";
import { controlH } from "@/lib/control-size";
import {
  clockSkewTone,
  formatSkewMs,
  probeNetworkTime,
  type ClockSkewTone,
  type NetworkTimeSample,
} from "@/lib/network-time";
import { useMediaQuery } from "@/lib/use-media-query";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import { Surface } from "@/components/atoms/Surface";

/**
 * Copy noun for the local clock host: fine pointer → "computer", else
 * "device" (phone/tablet — never hard-code "phone" in the probe UI).
 */
function useHostNoun(): { noun: string; Noun: string; Icon: typeof Monitor } {
  const computer = useMediaQuery("(pointer: fine)");
  return computer
    ? { noun: "computer", Noun: "Computer", Icon: Monitor }
    : { noun: "device", Noun: "Device", Icon: Smartphone };
}

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
  idle: "border-white/80 bg-white/95 text-muted hover:text-ink",
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

const PANEL_WIDTH = 312; // 19.5rem

/** Plain-language gap between place and device UTC offsets. */
function offsetGapCopy(
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
    return `Same UTC offset — this ${hostNoun}’s wall clock matches this place.`;
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

type PanelBox = { bottom: number; left: number };

type ClockProbeState =
  | { status: "idle" }
  | { status: "probing" }
  | { status: "offline" }
  | { status: "ready"; sample: NetworkTimeSample };

const skewDot: Record<ClockSkewTone | "network", string> = {
  ok: "bg-saffron-400",
  warn: "bg-saffron-500",
  danger: "bg-danger-500",
  network: "bg-flagblue-600",
};

/**
 * Horizontal rail: network UTC at center (0), host mark at measured skew.
 * Uncertainty band = ±RTT/2 from the probe.
 */
function ClockSkewRail({
  sample,
  hostNoun,
  HostNoun,
}: {
  sample: NetworkTimeSample;
  hostNoun: string;
  HostNoun: string;
}) {
  const tone = clockSkewTone(sample);
  const halfRange = Math.max(
    sample.uncertaintyMs * 3,
    Math.abs(sample.skewMs) * 1.35,
    500,
  );
  const toPct = (ms: number) =>
    Math.min(100, Math.max(0, ((ms + halfRange) / (2 * halfRange)) * 100));
  const netPct = toPct(0);
  const hostPct = toPct(sample.skewMs);
  const bandLeft = toPct(-sample.uncertaintyMs);
  const bandRight = toPct(sample.uncertaintyMs);
  const aligned = Math.abs(hostPct - netPct) < 2.5;
  const rangeLabel =
    halfRange >= 1000
      ? `±${(halfRange / 1000).toFixed(halfRange >= 10_000 ? 0 : 1)} s`
      : `±${Math.round(halfRange)} ms`;

  return (
    <div className="space-y-2 rounded-2xl bg-ink/[0.04] px-3 py-3">
      <div className="flex items-center justify-between gap-2 text-xs font-medium tracking-wide text-muted uppercase">
        <span>{HostNoun} slow</span>
        <span>Clock probe</span>
        <span>{HostNoun} fast</span>
      </div>

      <div className="relative h-4">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink/10" />
        <div
          aria-hidden
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-flagblue-600/20"
          style={{
            left: `${bandLeft}%`,
            width: `${Math.max(2, bandRight - bandLeft)}%`,
          }}
        />
        <div
          aria-hidden
          className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-ink/25"
          style={{ left: `${netPct}%` }}
        />
        {aligned ? (
          <span
            className={cn(
              "absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
              skewDot[tone],
            )}
            style={{ left: `${netPct}%` }}
            title={`Network & ${hostNoun}`}
          />
        ) : (
          <>
            <span
              className={cn(
                "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
                skewDot.network,
              )}
              style={{ left: `${netPct}%` }}
              title="Network UTC"
            />
            <span
              className={cn(
                "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white",
                skewDot[tone],
              )}
              style={{ left: `${hostPct}%` }}
              title={HostNoun}
            />
          </>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", skewDot.network)} aria-hidden />
          Network UTC
        </span>
        <span className="text-center tabular-nums text-subtle">{rangeLabel}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", skewDot[tone])} aria-hidden />
          {HostNoun}
        </span>
      </div>

      <p
        className={cn(
          "text-sm",
          tone === "ok" && "text-saffron-800",
          tone === "warn" && "text-saffron-800",
          tone === "danger" && "text-danger-700",
        )}
      >
        {HostNoun} is{" "}
        <span className="font-semibold tabular-nums">{formatSkewMs(sample.skewMs)}</span>
        {" · "}
        round-trip {sample.rttMs} ms · uncertainty ±{sample.uncertaintyMs} ms
      </p>
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
      <p className="mt-0.5 truncate text-sm text-muted">{zone || "Unknown"}</p>
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
 * Settles "is this device's *time zone* plausible for where we are?" and,
 * when online, probes network UTC (Cristian / RTT) so a right-zone / wrong-
 * minute clock can still be caught. Offline skips the probe honestly.
 * Prefer IANA zone from reverse-geocode over a longitude estimate. See §6b.
 */
export function LocationCheck() {
  const { noun: hostNoun, Noun: HostNoun, Icon: HostIcon } = useHostNoun();
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<PanelBox | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [info, setInfo] = useState<LocationInfo | null>(null);
  const [clock, setClock] = useState<ClockProbeState>({ status: "idle" });
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Portaled panel (shell overflow clips in-flow popovers). Longer idle —
  // several lines to read. onDismiss must stay stable: this sits beside the
  // live clock (rAF re-renders), so an inline arrow would reset the timer.
  const dismiss = useCallback(() => setOpen(false), []);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const left = Math.min(
      Math.max(8, r.right - PANEL_WIDTH),
      window.innerWidth - PANEL_WIDTH - 8,
    );
    setBox({
      bottom: Math.max(8, window.innerHeight - r.top + 8),
      left,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;

    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(dismiss, 16000);
    };

    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) {
        arm();
        return;
      }
      dismiss();
    }

    arm();
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, dismiss]);

  async function runClockProbe() {
    setClock({ status: "probing" });
    const sample = await probeNetworkTime();
    setClock(sample ? { status: "ready", sample } : { status: "offline" });
  }

  function handleOpen() {
    setOpen(true);
    void runClockProbe();
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
  const clockTone =
    clock.status === "ready" ? clockSkewTone(clock.sample) : null;
  const clockDanger = clockTone === "danger";
  const clockWarn = clockTone === "warn";
  const trouble =
    status === "denied" ||
    status === "error" ||
    mismatch ||
    (status === "unavailable" && !info?.matchesLocation) ||
    clockDanger;
  const softUnavailable = status === "unavailable" && info?.matchesLocation;

  const tone: ProbeTone =
    status === "checking" || clock.status === "probing"
      ? "checking"
      : trouble
        ? "danger"
        : softUnavailable || clockWarn
          ? "warn"
          : status === "ok" && info?.matchesLocation
            ? "ok"
            : "idle";

  const badgeLabel =
    status === "checking" || clock.status === "probing"
      ? "Checking…"
      : clockDanger
        ? "Check clock"
        : status === "ok" && info?.matchesLocation
          ? info.city || "Zone OK"
          : softUnavailable
            ? "Zone OK?"
            : clockWarn
              ? "Clock?"
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
    status === "checking" || clock.status === "probing" ? (
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
            "Same zone id as this location — the " +
            hostNoun +
            " isn’t still set somewhere you traveled from.",
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
  const gapCopy =
    info?.placeOffset && info.deviceOffset && status !== "checking"
      ? offsetGapCopy(
          info.placeOffset,
          info.deviceOffset,
          info.matchesLocation,
          hostNoun,
        )
      : null;

  const panel =
    open &&
    box &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        ref={panelRef}
        className="fixed z-50"
        style={{ bottom: box.bottom, left: box.left, width: PANEL_WIDTH }}
      >
        <Surface
          material="glass-panel"
          rim
          className="animate-scale-in max-h-[min(28rem,calc(100dvh-1.5rem))] overflow-y-auto overflow-x-clip rounded-3xl p-4 text-left shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
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
                  icon={<HostIcon className="size-3.5" aria-hidden />}
                  label={HostNoun}
                  zone={info.deviceZone.replace(/_/g, " ")}
                  offset={info.deviceOffset}
                  tone={info.matchesLocation ? "ok" : "danger"}
                />
              </div>

              {gapCopy ? (
                <p
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm",
                    info.matchesLocation
                      ? "bg-saffron-400/15 text-saffron-800"
                      : "bg-danger-500/10 text-danger-700",
                  )}
                >
                  {gapCopy}
                </p>
              ) : null}
            </div>
          ) : null}

          {clock.status === "probing" ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <Loader2 className="size-4 animate-spin" strokeWidth={2.25} aria-hidden />
              Comparing {hostNoun} time to network UTC…
            </p>
          ) : null}

          {clock.status === "ready" ? (
            <div className="mt-3">
              <ClockSkewRail
                sample={clock.sample}
                hostNoun={hostNoun}
                HostNoun={HostNoun}
              />
            </div>
          ) : null}

          {clock.status === "offline" ? (
            <p className="mt-3 rounded-2xl bg-ink/[0.04] px-3 py-2 text-sm text-muted">
              No network time — skipped the atomic/UTC probe. Zone check above still
              stands; confirm Date &amp; Time manually if the clock looks wrong.
            </p>
          ) : null}

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
        </Surface>
      </div>,
      document.body,
    );

  return (
    <div className={cn("relative", open && "z-50")} ref={triggerRef}>
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
          /* pl matches vertical inset around the size-7 mark in h-11 ((44-28)/2). */
          "no-select flex max-w-44 items-center gap-1.5 rounded-full border pr-3 pl-2 shadow-sm",
          controlH.md,
          userFeedbackClass({ press: "sm", on: open }),
          /* Opaque light fill — glass was too see-through on the record button. */
          toneBadge[tone],
        )}
      >
        <StatusMark tone={tone}>{badgeIcon}</StatusMark>
        <span className="truncate text-sm font-medium">{badgeLabel}</span>
      </button>
      {panel}
    </div>
  );
}
