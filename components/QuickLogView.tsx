"use client";

import { useEffect, useState } from "react";
import { QuickLogEntry, createQuickLogEntry } from "@/lib/types";
import { loadQuickLog, saveQuickLog } from "@/lib/storage";
import { formatInZone } from "@/lib/format";
import TimezoneSelect from "./TimezoneSelect";
import QuickLogButton from "./QuickLogButton";

export default function QuickLogView() {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<QuickLogEntry[]>([]);
  const [tz, setTz] = useState("UTC");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setEntries(loadQuickLog());
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveQuickLog(entries);
  }, [entries, ready]);

  function handleLog() {
    setEntries((prev) => [...prev, createQuickLogEntry()]);
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    if (navigator.vibrate) navigator.vibrate(15);
  }

  if (!ready) return null;

  const sorted = [...entries].sort((a, b) => b.at - a.at);

  return (
    <div className="no-select flex flex-1 flex-col overflow-hidden" onClick={handleLog}>
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <span className="text-sm text-gray-500">{entries.length} logged</span>
        <TimezoneSelect value={tz} onChange={setTz} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {sorted.length === 0 ? (
          <p className="mt-10 text-center text-sm text-gray-400">Tap anywhere to log a time.</p>
        ) : (
          <ul className="space-y-2">
            {sorted.map((entry, i) => {
              const { date, time, ms } = formatInZone(entry.at, tz);
              return (
                <li
                  key={entry.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5"
                >
                  <span className="text-xs text-gray-400">#{sorted.length - i}</span>
                  <span className="font-mono tabular-nums text-gray-900">
                    {date} · {time}
                    <span className="text-gray-400">.{ms}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <QuickLogButton flash={flash} />
      </div>
    </div>
  );
}
