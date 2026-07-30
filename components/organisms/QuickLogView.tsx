"use client";

import { useEffect, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { QuickLogEntry, createQuickLogEntry } from "@/lib/types";
import { loadQuickLog, saveQuickLog } from "@/lib/storage";
import { formatInZone } from "@/lib/format";
import { TimezoneSelect } from "@/components/atoms/TimezoneSelect";
import { QuickLogButton } from "@/components/atoms/QuickLogButton";
import { SwipeToAction } from "@/components/atoms/SwipeToAction";
import { IconButton } from "@/components/atoms/IconButton";
import { ConfirmInline } from "@/components/atoms/ConfirmInline";

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
      <div className="border-b border-line px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="pl-1 text-label text-muted">{entries.length} logged</span>
          {confirmingReset ? (
            <ConfirmInline
              className="bg-transparent"
              message="Clear all?"
              confirmLabel="Clear all logged times"
              intent="delete"
              onConfirm={() => {
                setEntries([]);
                setConfirmingReset(false);
              }}
              onCancel={() => setConfirmingReset(false)}
            />
          ) : (
            <IconButton
              icon={RotateCcw}
              label="Clear all logged times"
              tone="danger"
              size="sm"
              disabled={entries.length === 0}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmingReset(true);
              }}
            />
          )}
        </div>
        <div className="mt-1 px-1 pb-1">
          <TimezoneSelect value={tz} onChange={setTz} />
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto px-4 py-3">
        {sorted.length === 0 ? (
          <p className="text-center text-label text-subtle">Tap anywhere to log a time.</p>
        ) : (
          sorted.map((entry, i) => {
            const { date, time, ms } = formatInZone(entry.at, tz);
            return (
              <div key={entry.id} className="shrink-0">
                <SwipeToAction
                  onSwipe={() => deleteEntry(entry.id)}
                  label="Delete"
                  className="bg-card"
                >
                  <div className="flex items-center justify-between py-1.5 pr-1 pl-4">
                    <span className="text-caption tabular-nums text-subtle">#{sorted.length - i}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-label tabular-nums text-ink">
                        {date} · {time}
                        <span className="text-subtle">.{ms}</span>
                      </span>
                      <IconButton
                        icon={X}
                        label="Delete entry"
                        tone="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEntry(entry.id);
                        }}
                      />
                    </span>
                  </div>
                </SwipeToAction>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2">
        <QuickLogButton flash={flash} onLog={handleLog} />
      </div>
    </div>
  );
}
