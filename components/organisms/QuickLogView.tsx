"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, RotateCcw, Trash2 } from "lucide-react";
import { QuickLogEntry, createQuickLogEntry } from "@/lib/types";
import { loadQuickLog, saveQuickLog } from "@/lib/storage";
import { formatInZone } from "@/lib/format";
import { useArmedAction } from "@/lib/use-armed-action";
import { useDismissible } from "@/lib/use-dismissible";
import { glassRowClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { TimezoneSelect } from "@/components/atoms/TimezoneSelect";
import { QuickLogButton } from "@/components/atoms/QuickLogButton";
import { Surface } from "@/components/atoms/Surface";
import { IconButton } from "@/components/atoms/IconButton";
import { RowActionTray } from "@/components/atoms/RowReveal";

/**
 * One logged time — idle = glass stamp only. Tap opens the Copy / Delete
 * tray; the stamp shrinks and the right-aligned time rides with it (no
 * spacer snap). See design system §5a.
 */
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
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const remove = useArmedAction(onDelete);
  const { date, time, ms } = formatInZone(at, tz);
  const stamp = `${date} · ${time}.${ms}`;
  const red = remove.armed || armedAll;

  const { disarm } = remove;
  const closeActions = useCallback(() => {
    setShowActions(false);
    disarm();
  }, [disarm]);

  const dismissRef = useDismissible<HTMLDivElement>({
    active: showActions,
    onDismiss: closeActions,
  });

  useEffect(() => {
    setShowActions(false);
    setCopied(false);
    disarm();
  }, [at, disarm]);

  async function copyTime(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(stamp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard denied */
    }
  }

  function handleRowClick(e: React.MouseEvent) {
    e.stopPropagation();
    setShowActions((v) => !v);
    disarm();
  }

  const body = (
    <div ref={dismissRef} className="flex min-h-11 w-full items-center">
      {/* Glass stamp only — actions are not part of this element. */}
      <button
        type="button"
        onClick={handleRowClick}
        aria-expanded={showActions}
        aria-label={
          showActions ? `Hide actions for log #${index}` : `Show actions for log #${index}`
        }
        className={cn(
          "flex min-h-11 min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-2xl px-4",
          "transition-[box-shadow,background-color,transform] duration-200 ease-out",
          "hover:bg-ink/[0.03] active:scale-[0.99]",
          glassRowClass(),
        )}
      >
        <span className="shrink-0 text-sm tabular-nums text-subtle">#{index}</span>
        <span
          className={cn(
            /* Right-aligned in the stamp — moves with the tray width animation. */
            "min-w-0 flex-1 overflow-hidden whitespace-nowrap text-right font-mono text-sm tabular-nums",
            red ? "text-danger-600" : "text-ink",
          )}
        >
          {date} · {time}
          <span className={red ? "text-danger-600/70" : "text-subtle"}>.{ms}</span>
        </span>
      </button>

      <RowActionTray open={showActions}>
        <div className="flex shrink-0 items-center gap-2">
          <IconButton
            icon={copied ? Check : Copy}
            label={copied ? "Time copied" : "Copy time"}
            glass
            onClick={copyTime}
            tone="accent"
            size="md"
            className={copied ? "text-saffron-700" : undefined}
          />
          <IconButton
            icon={Trash2}
            label={remove.armed ? `Confirm delete entry #${index}` : `Delete entry #${index}`}
            glass
            onClick={(e) => {
              e.stopPropagation();
              remove.trigger();
            }}
            tone="danger"
            size="md"
            className={
              remove.armed ? "text-danger-600 ring-2 ring-inset ring-danger-500" : undefined
            }
          />
        </div>
      </RowActionTray>
    </div>
  );

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
       Stops the page-wide tap-to-log layer; the row's real controls are buttons. */
    <div className="shrink-0 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
      {body}
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
    setTimeout(() => setFlash(false), 280);
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
      <Surface material="glass-panel" className="border-b border-white/40 px-3 py-2">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
           Stops the page-wide tap-to-log layer; Clear / timezone are real controls. */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <span className="shrink-0 pl-1 text-sm tabular-nums text-muted">
            {entries.length} logged
          </span>
          <TimezoneSelect value={tz} onChange={setTz} compact />
          <IconButton
            icon={RotateCcw}
            label={
              clearAll.armed ? "Confirm clear all logged times" : "Clear all logged times"
            }
            showLabel="Clear"
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
      </Surface>

      <div className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto px-4 py-3">
        {sorted.length === 0 ? (
          <Surface
            as="p"
            material="glass-panel"
            rim
            className="mx-auto rounded-2xl px-4 py-2 text-center text-sm text-muted"
          >
            Tap anywhere to log a time.
          </Surface>
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
