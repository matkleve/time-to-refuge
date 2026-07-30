"use client";

import { useEffect, useState } from "react";
import { QuickLogEntry, createQuickLogEntry } from "@/lib/types";
import { loadQuickLog, saveQuickLog } from "@/lib/storage";
import { formatInZone } from "@/lib/format";
import TimezoneSelect from "./TimezoneSelect";
import QuickLogButton from "./QuickLogButton";
import SwipeToAction from "./SwipeToAction";

export default function QuickLogView() {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<QuickLogEntry[]>([]);
  const [tz, setTz] = useState("UTC");
  const [flash, setFlash] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

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

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  if (!ready) return null;

  const sorted = [...entries].sort((a, b) => b.at - a.at);

  return (
    <div className="no-select flex flex-1 cursor-pointer flex-col overflow-hidden" onClick={handleLog}>
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{entries.length} logged</span>
          {confirmingReset ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <span className="text-sm text-gray-700">Clear all?</span>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs text-gray-600 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setEntries([]);
                  setConfirmingReset(false);
                }}
                className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 text-xs text-red-600 active:scale-95"
              >
                Clear
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmingReset(true);
              }}
              disabled={entries.length === 0}
              className="text-sm font-medium text-red-500 disabled:opacity-30 active:scale-95"
            >
              Reset
            </button>
          )}
        </div>
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <TimezoneSelect value={tz} onChange={setTz} />
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto px-4 py-3">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-gray-400">Tap anywhere to log a time.</p>
        ) : (
          sorted.map((entry, i) => {
            const { date, time, ms } = formatInZone(entry.at, tz);
            return (
              <div key={entry.id} className="shrink-0">
                <SwipeToAction
                  onSwipe={() => deleteEntry(entry.id)}
                  label="Delete"
                  className="border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center justify-between py-2.5 pl-4 pr-2">
                    <span className="text-xs text-gray-400">#{sorted.length - i}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono tabular-nums text-gray-900">
                        {date} · {time}
                        <span className="text-gray-400">.{ms}</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEntry(entry.id);
                        }}
                        aria-label="Delete entry"
                        className="rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 active:scale-95"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  </div>
                </SwipeToAction>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <QuickLogButton flash={flash} />
      </div>
    </div>
  );
}
