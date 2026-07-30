"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { QuickLogEntry, createQuickLogEntry } from "@/lib/types";
import { loadQuickLog, saveQuickLog } from "@/lib/storage";
import { formatInZone } from "@/lib/format";
import { TimezoneSelect } from "@/components/atoms/TimezoneSelect";
import { QuickLogButton } from "@/components/atoms/QuickLogButton";
import { SwipeToAction } from "@/components/atoms/SwipeToAction";

export function QuickLogView() {
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
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
       Pointer-only convenience layer so any tap on the page logs a time. The
       keyboard-accessible equivalent is the real <button> in QuickLogButton
       below, which is focusable and fires on Enter/Space. */
    <div className="no-select flex flex-1 cursor-pointer flex-col overflow-hidden" onClick={handleLog}>
      <div className="border-b border-line px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">{entries.length} logged</span>
          {confirmingReset ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink">Clear all?</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmingReset(false);
                }}
                className="rounded-lg border border-line px-2.5 py-1 text-xs text-muted active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
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
        <div className="mt-2">
          <TimezoneSelect value={tz} onChange={setTz} />
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto px-4 py-3">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-muted/70">Tap anywhere to log a time.</p>
        ) : (
          sorted.map((entry, i) => {
            const { date, time, ms } = formatInZone(entry.at, tz);
            return (
              <div key={entry.id} className="shrink-0">
                <SwipeToAction
                  onSwipe={() => deleteEntry(entry.id)}
                  label="Delete"
                  className="border border-line bg-card"
                >
                  <div className="flex items-center justify-between py-2.5 pl-4 pr-2">
                    <span className="text-xs text-muted/70">#{sorted.length - i}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono tabular-nums text-ink">
                        {date} · {time}
                        <span className="text-muted/70">.{ms}</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEntry(entry.id);
                        }}
                        aria-label="Delete entry"
                        className="rounded-md p-1 text-line hover:bg-red-50 hover:text-red-500 active:scale-95"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
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
        <QuickLogButton flash={flash} onLog={handleLog} />
      </div>
    </div>
  );
}
