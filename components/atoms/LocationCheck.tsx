"use client";

import { useCallback, useState } from "react";
import { AlertTriangle, Check, Clock, Loader2 } from "lucide-react";
import { useDismissible } from "@/lib/use-dismissible";
import { cn } from "@/lib/utils";

type Status = "idle" | "checking" | "ok" | "denied" | "unavailable" | "error";

interface LocationInfo {
  place: string;
  city: string;
  timezone: string;
  offset: string;
  /** Does the device's own time zone plausibly belong to this location? */
  matchesLocation: boolean;
  expectedOffset: string;
}

function currentOffset(): string {
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${h}:${m}`;
}

function offsetHoursNow(): number {
  return -new Date().getTimezoneOffset() / 60;
}

function formatOffsetHours(hours: number): string {
  const sign = hours >= 0 ? "+" : "-";
  return `UTC${sign}${Math.abs(hours)}`;
}

/**
 * A whole-hour estimate from longitude alone — real time zones follow
 * political borders, not meridians, and can sit a couple of hours off solar
 * time (Spain, China). Deliberately loose (see MISMATCH_TOLERANCE_HOURS)
 * so it only ever flags the case that actually matters: a clock left on a
 * time zone many hours from where the device physically is.
 */
function expectedOffsetHoursFromLongitude(longitude: number): number {
  return Math.round(longitude / 15);
}

const MISMATCH_TOLERANCE_HOURS = 3.5;

function offsetsRoughlyMatch(a: number, b: number): boolean {
  const diff = Math.abs(a - b);
  return Math.min(diff, 24 - diff) <= MISMATCH_TOLERANCE_HOURS;
}

/**
 * The timekeeper only gets one chance at each moment — there's no redo once
 * the teacher's fingers snap. This exists so they can settle "is this
 * device's clock actually right?" once, quietly, before the ceremony
 * starts, instead of wondering mid-ceremony.
 *
 * It cannot prove the clock is accurate to the second — there's no trusted
 * time server involved, deliberately: retreat centers are often offline or
 * on poor wifi, and a check that silently fails right when it matters is
 * worse than not having it. What it verifies is the single most common way
 * these times go wrong in practice: a phone still set to a *different* time
 * zone (left over from traveling, or never set at all), running the wrong
 * clock without anyone noticing. GPS location and the device's own time
 * zone are two independently-sourced facts — this cross-checks them (a
 * whole-hour, generously-toleranced estimate; see MISMATCH_TOLERANCE_HOURS)
 * and says plainly whether they agree, rather than just displaying both and
 * leaving the comparison to whoever's reading — see design system §6b.
 */
export function LocationCheck() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [info, setInfo] = useState<LocationInfo | null>(null);

  // Same disclosure pattern as a field row's actions (design system §5c),
  // just a longer pause — there's several lines to read here, not an icon row.
  // onDismiss must stay referentially stable: this button sits beside the
  // live clock, which re-renders every animation frame, so an inline arrow
  // function here would reset the idle timer before it ever got to fire.
  const dismiss = useCallback(() => setOpen(false), []);
  const popoverRef = useDismissible<HTMLDivElement>({
    active: open,
    onDismiss: dismiss,
    timeoutMs: 10000,
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
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offset = currentOffset();
        const expectedHours = expectedOffsetHoursFromLongitude(pos.coords.longitude);
        const matchesLocation = offsetsRoughlyMatch(offsetHoursNow(), expectedHours);
        const expectedOffset = formatOffsetHours(expectedHours);
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const city = data.city || data.locality || "";
          const place =
            [city, data.principalSubdivision, data.countryName].filter(Boolean).join(", ") ||
            "Unknown place";
          setInfo({ place, city: city || place, timezone, offset, matchesLocation, expectedOffset });
          setStatus("ok");
        } catch {
          // GPS worked, but naming the place didn't — so there's nothing to
          // cross-check the device's time zone against. Not a success.
          setInfo({ place: "", city: "", timezone, offset, matchesLocation: false, expectedOffset: "" });
          setStatus("unavailable");
        }
      },
      () => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setInfo({
          place: "",
          city: "",
          timezone,
          offset: currentOffset(),
          matchesLocation: false,
          expectedOffset: "",
        });
        setStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  const mismatch = status === "ok" && info !== null && !info.matchesLocation;
  const trouble = status === "denied" || status === "unavailable" || status === "error" || mismatch;

  const badgeLabel =
    status === "checking"
      ? "Checking…"
      : status === "ok"
        ? info?.city || "Verified"
        : trouble
          ? "Check clock"
          : "Verify time";

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
        aria-label={
          status === "ok" && info && !mismatch
            ? `Time and location verified: ${info.place}. Open to review.`
            : status === "ok" && info && mismatch
              ? `Warning: this device's clock may not match ${info.place}. Open to review.`
              : "Verify this device's clock before the ceremony"
        }
        className={cn(
          "no-select flex h-9 max-w-32 items-center gap-1 rounded-full border pr-3 pl-2 shadow-sm transition-colors duration-200 active:scale-95",
          trouble
            ? "border-danger-500 bg-danger-50 text-danger-600 hover:bg-danger-50/70"
            : "border-saffron-500 bg-white text-saffron-700 hover:bg-saffron-50",
        )}
      >
        {status === "checking" ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" strokeWidth={2.5} />
        ) : trouble ? (
          <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={2.5} />
        ) : status === "ok" ? (
          <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
        ) : (
          <Clock className="h-4 w-4 shrink-0" strokeWidth={2.5} />
        )}
        <span className="truncate text-xs font-medium">{badgeLabel}</span>
      </button>

      {open && (
        <div className="bg-white/70 backdrop-blur-xl backdrop-saturate-150 animate-fade-in-up absolute right-0 bottom-11 z-20 w-72 rounded-2xl border border-white/60 p-3.5 text-left shadow-2xl">
          {status === "checking" && (
            <>
              <p className="mb-1 text-xs tracking-wide text-saffron-700 uppercase">
                Checking
              </p>
              <p className="text-sm text-muted">Finding this device&apos;s location…</p>
            </>
          )}

          {status === "ok" && info && !mismatch && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">
                This is why the time is accurate:
              </p>
              <p className="text-base text-ink">{info.place}</p>
              <p className="text-sm text-muted">
                Device clock: {info.timezone} · {info.offset}
              </p>
              <p className="text-xs text-subtle">
                Your device says it&apos;s here, and its clock&apos;s time zone fits
                this place — so it isn&apos;t still set to somewhere you traveled
                from. Worth a glance once before the ceremony starts.
              </p>
            </div>
          )}

          {status === "ok" && info && mismatch && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-danger-600">
                This device&apos;s clock may be wrong
              </p>
              <p className="text-base text-ink">{info.place}</p>
              <p className="text-sm text-muted">
                Device clock: {info.timezone} · {info.offset} — expected around{" "}
                {info.expectedOffset} here.
              </p>
              <p className="text-xs text-subtle">
                That&apos;s too far off to be this place&apos;s own time zone. If you
                just traveled here, the clock may still be set to where you came
                from — check your phone&apos;s date &amp; time settings before the
                ceremony starts.
              </p>
            </div>
          )}

          {status === "denied" && info && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-danger-600">
                Location access is off
              </p>
              <p className="text-xs text-subtle">
                This device reports its clock as {info.timezone} ({info.offset}), but
                without location that can&apos;t be checked against where you actually
                are. If you just traveled here, open your phone&apos;s date &amp; time
                settings and confirm the time zone yourself before starting.
              </p>
            </div>
          )}

          {status === "unavailable" && info && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-danger-600">
                Couldn&apos;t name your location
              </p>
              <p className="text-xs text-subtle">
                Location itself worked, but looking up its name needs a network
                connection this device doesn&apos;t have right now. This device reports
                its clock as {info.timezone} ({info.offset}) — if you just traveled
                here, confirm that&apos;s actually correct in your phone&apos;s date &amp;
                time settings before starting.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-danger-600">
                Can&apos;t check location here
              </p>
              <p className="text-xs text-subtle">
                This browser or device doesn&apos;t support location lookup. Check
                your phone&apos;s date, time, and time zone settings directly before
                the ceremony starts.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
