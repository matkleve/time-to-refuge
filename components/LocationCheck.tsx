"use client";

import { useEffect, useRef, useState } from "react";

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

export default function LocationCheck() {
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
        className="flex h-8 w-8 items-center justify-center rounded-full border border-saffron-500 bg-white text-saffron-600 shadow-md active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-11 right-0 z-20 w-64 rounded-xl border border-gray-200 bg-white p-3 text-left shadow-xl">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-saffron-600">
            Time accuracy check
          </p>
          {status === "checking" && (
            <p className="text-sm text-gray-600">Locating…</p>
          )}
          {(status === "ok" || status === "denied") && info && (
            <div className="space-y-1 text-sm">
              <p className="text-gray-900">{info.place}</p>
              <p className="text-gray-600">
                {info.timezone} · {info.offset}
              </p>
              <p className="text-[11px] text-gray-400">
                The clock uses this device&apos;s system time for the detected timezone above.
              </p>
            </div>
          )}
          {status === "error" && (
            <p className="text-sm text-gray-600">Location isn&apos;t available on this device.</p>
          )}
        </div>
      )}
    </div>
  );
}
