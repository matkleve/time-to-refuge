"use client";

import { useCallback, useState } from "react";
import { Check } from "lucide-react";
import { useDismissible } from "@/lib/use-dismissible";

type Status = "idle" | "checking" | "ok" | "denied" | "error";

interface LocationInfo {
  place: string;
  timezone: string;
  offset: string;
}

function currentOffset(): string {
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${h}:${m}`;
}

export function LocationCheck() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [info, setInfo] = useState<LocationInfo | null>(null);

  // Same disclosure pattern as a field row's actions (design system §5c),
  // just a longer pause — there's three lines to read here, not an icon row.
  // onDismiss must stay referentially stable: this button sits beside the
  // live clock, which re-renders every animation frame, so an inline arrow
  // function here would reset the idle timer before it ever got to fire.
  const dismiss = useCallback(() => setOpen(false), []);
  const popoverRef = useDismissible<HTMLDivElement>({
    active: open,
    onDismiss: dismiss,
    timeoutMs: 8000,
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
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const place =
            [data.city || data.locality, data.principalSubdivision, data.countryName]
              .filter(Boolean)
              .join(", ") || "Unknown place";
          setInfo({ place, timezone, offset });
          setStatus("ok");
        } catch {
          setInfo({ place: "Place lookup unavailable", timezone, offset });
          setStatus("ok");
        }
      },
      () => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setInfo({ place: "Location permission denied", timezone, offset: currentOffset() });
        setStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
        aria-label="Confirm current time and location"
        className="flex size-9 items-center justify-center rounded-full border border-saffron-500 bg-white text-saffron-700 shadow-sm transition-colors duration-200 hover:bg-saffron-50 active:scale-95"
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </button>

      {open && (
        <div className="animate-fade-in-up absolute right-0 bottom-11 z-20 w-64 rounded-2xl bg-white p-3 text-left shadow-2xl">
          <p className="mb-1 text-xs tracking-wide text-saffron-700 uppercase">
            Time accuracy check
          </p>
          {status === "checking" && (
            <p className="text-sm text-muted">Locating…</p>
          )}
          {(status === "ok" || status === "denied") && info && (
            <div className="space-y-1 text-sm">
              <p className="text-base text-ink">{info.place}</p>
              <p className="text-sm text-muted">
                {info.timezone} · {info.offset}
              </p>
              <p className="text-xs text-subtle">
                The clock uses this device&apos;s system time for the detected timezone above.
              </p>
            </div>
          )}
          {status === "error" && (
            <p className="text-sm text-muted">Location isn&apos;t available on this device.</p>
          )}
        </div>
      )}
    </div>
  );
}
