"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

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
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

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
        className="flex size-9 items-center justify-center rounded-full border border-saffron-500 bg-white text-saffron-700 shadow-row transition-colors duration-(--duration-ui) hover:bg-saffron-50 active:scale-95"
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </button>

      {open && (
        <div className="absolute right-0 bottom-11 z-20 w-64 rounded-row bg-white p-3 text-left shadow-panel">
          <p className="mb-1 text-caption tracking-wide text-saffron-700 uppercase">
            Time accuracy check
          </p>
          {status === "checking" && (
            <p className="text-label text-muted">Locating…</p>
          )}
          {(status === "ok" || status === "denied") && info && (
            <div className="space-y-1 text-sm">
              <p className="text-body text-ink">{info.place}</p>
              <p className="text-label text-muted">
                {info.timezone} · {info.offset}
              </p>
              <p className="text-caption text-subtle">
                The clock uses this device&apos;s system time for the detected timezone above.
              </p>
            </div>
          )}
          {status === "error" && (
            <p className="text-label text-muted">Location isn&apos;t available on this device.</p>
          )}
        </div>
      )}
    </div>
  );
}
