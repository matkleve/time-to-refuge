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
import { useArmedAction } from "@/lib/use-armed-action";
import { cn } from "@/lib/utils";

/** One logged time. Owns its own two-click delete. */
function LogRow({
  index,
  at,
  tz,
  armedAll,
  onDelete,
}: {
  index: number;
  at: number;
  tz: string;
  armedAll: boolean;
  onDelete: () => void;
}) {
  const remove = useArmedAction(onDelete);
  const { date, time, ms } = formatInZone(at, tz);
  const red = remove.armed || armedAll;

  return (
    <div className="shrink-0">
      <SwipeToAction onSwipe={remove.trigger} label="Delete" className="bg-card">
        <div
          className={cn(
            "flex items-center justify-between bg-card py-1.5 pr-1 pl-4",
            red && "ring-2 ring-danger-500 rounded-2xl",
          )}
        >
          <span className="text-xs tabular-nums text-subtle">#{index}</span>
          <span className="flex items-center gap-2">
            <span
              className={cn("font-mono text-sm tabular-nums", red ? "text-danger-600" : "text-ink")}
            >
              {date} · {time}
              <span className={red ? "text-danger-600/70" : "text-subtle"}>.{ms}</span>
            </span>
            <IconButton
              icon={X}
              label={remove.armed ? "Confirm delete entry" : "Delete entry"}
              tone="danger"
              size="sm"
              className={remove.armed ? "bg-danger-50 text-danger-600" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                remove.trigger();
              }}
            />
          </span>
        </div>
      </SwipeToAction>
    </div>
  );
}

export function QuickLogView() {
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

  // Two-click: the first press turns every logged time red.
  const clearAll = useArmedAction(() => setEntries([]));

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
      <div className="glass border-b border-line px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="pl-1 text-sm text-muted">{entries.length} logged</span>
          <IconButton
            icon={RotateCcw}
            label={clearAll.armed ? "Confirm clear all logged times" : "Clear all logged times"}
            tone="danger"
            size="sm"
            disabled={entries.length === 0}
            className={clearAll.armed ? "bg-danger-50 text-danger-600" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              clearAll.trigger();
            }}
          />
        </div>
        <div className="mt-1 px-1 pb-1">
          <TimezoneSelect value={tz} onChange={setTz} />
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto px-4 py-3">
        {sorted.length === 0 ? (
          <p className="glass mx-auto rounded-2xl border border-white/60 px-4 py-2 text-center text-sm text-subtle shadow-sm">
            Tap anywhere to log a time.
          </p>
        ) : (
          sorted.map((entry, i) => (
            <LogRow
              key={entry.id}
              index={sorted.length - i}
              at={entry.at}
              tz={tz}
              armedAll={clearAll.armed}
              onDelete={() => deleteEntry(entry.id)}
            />
          ))
        )}
      </div>

      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <QuickLogButton flash={flash} onLog={handleLog} />
      </div>
    </div>
  );
}
