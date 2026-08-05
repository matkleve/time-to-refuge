"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, RotateCcw, Trash2 } from "lucide-react";
import { QuickLogEntry, createQuickLogEntry } from "@/lib/types";
import { loadQuickLog, saveQuickLog } from "@/lib/storage";
import { formatInZone } from "@/lib/format";
import { useArmedAction } from "@/lib/use-armed-action";
import { useDismissible } from "@/lib/use-dismissible";
import { controlMinH } from "@/lib/control-size";
import { glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import { TimezoneSelect } from "@/components/atoms/TimezoneSelect";
import { QuickLogButton } from "@/components/atoms/QuickLogButton";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { PageTitle } from "@/components/atoms/PageTitle";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import { IconButton } from "@/components/atoms/IconButton";
import { RowActionTray } from "@/components/atoms/RowReveal";
import { useMediaQuery } from "@/lib/use-media-query";

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
    <div ref={dismissRef} className={cn("flex w-full items-center", controlMinH.md)}>
      {/* Glass stamp only — actions are not part of this element. */}
      <button
        type="button"
        onClick={handleRowClick}
        aria-expanded={showActions}
        aria-label={
          showActions ? `Hide actions for log #${index}` : `Show actions for log #${index}`
        }
        className={cn(
          "flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden rounded-2xl px-4",
          controlMinH.md,
          userFeedbackClass({ press: "md" }),
          /* Card glass (fill + blur) — rows sit on the photo like Refuge, not
             nested on a parent card where glassRowClass omits the blur. */
          glassClass("card", { rim: true }),
        )}
      >
        <span className="shrink-0 text-sm tabular-nums text-subtle">#{index}</span>
        <span
          className={cn(
            "shrink-0 whitespace-nowrap font-mono text-sm tabular-nums",
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
            armed={remove.armed}
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
  /** Desktop / tablet: only the hero button logs — no page-wide capture. */
  const tapAnywhere = !useMediaQuery("(min-width: 768px)");

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
  /* Layout classes must be pure CSS (`md:`), not `useMediaQuery` — that
     hook defaults false until mount, so a wide viewport briefly (or stuck)
     gets flex-row stamp-on-left with phone `pt-2` and the saffron clock
     sits under the brand/nav. Hint copy can still follow the hook. */
  const isDesktop = !tapAnywhere;

  const chrome = (
    <div className="flex flex-col gap-2">
      <PageTitle
        title="Quick Log"
        trailing={
          <IconButton
            icon={RotateCcw}
            label={
              clearAll.armed
                ? "Confirm clear all logged times"
                : "Clear all logged times"
            }
            showLabel="Clear"
            glass
            tone="danger"
            size="md"
            disabled={entries.length === 0}
            armed={clearAll.armed}
            onClick={(e) => {
              e.stopPropagation();
              clearAll.trigger();
            }}
          />
        }
      />
      <p className="text-base tabular-nums text-muted">{entries.length} logged</p>
      <TimezoneSelect value={tz} onChange={setTz} chip />
    </div>
  );

  const logList = (
    <div className="mx-auto flex w-full max-w-xl flex-col-reverse gap-2 px-1 py-3 md:mx-0 md:max-w-none md:px-0">
      {sorted.length === 0 ? (
        <GlassEmptyNote className="mx-auto md:mx-0">
          {tapAnywhere
            ? "Tap anywhere to log a time."
            : "Tap the button to log a time."}
        </GlassEmptyNote>
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
  );

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
       Phone: pointer-only convenience so any tap logs a time. Desktop/tablet
       omit onClick — only QuickLogButton stamps. Keyboard uses that button. */
    <div
      className={cn(
        "no-select flex h-full min-h-0 w-full flex-1 flex-col md:flex-row md:gap-5 lg:gap-6",
        tapAnywhere && "cursor-pointer",
      )}
      onClick={tapAnywhere ? handleLog : undefined}
    >
      {/* Logs (+ chrome). Phone: top scroll. Desktop: right column. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
         Stops the page-wide tap-to-log layer; Clear / rows are real controls. */}
      <div
        className="focus-safe-scroll order-1 min-h-0 flex-1 overflow-y-auto overscroll-contain md:order-2"
        onClick={tapAnywhere ? (e) => e.stopPropagation() : undefined}
      >
        <StickyPageChrome>{chrome}</StickyPageChrome>
        {logList}
      </div>

      {/*
        Stamp. Phone: bottom bar. Desktop: left column under header clearance.
        Width / justify / padding are `md:` utilities — never JS-gated — so the
        clock cannot paint into the brand/nav band (see DESIGN-SYSTEM §4c).
      */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
         Record control owns the stamp; don’t double-fire from the pad. */}
      <div
        className={cn(
          "order-2 mx-auto w-full max-w-xl shrink-0 px-1 pt-2",
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
          "md:order-1 md:mx-0 md:flex md:w-64 md:max-w-none md:flex-col md:justify-center md:self-stretch md:px-0 md:pb-4 lg:w-80",
          "md:pt-[var(--app-header-clearance)]",
        )}
        onClick={tapAnywhere ? (e) => e.stopPropagation() : undefined}
      >
        <QuickLogButton
          flash={flash}
          onLog={handleLog}
          hint={isDesktop ? "Tap to log" : "Tap anywhere to log"}
        />
      </div>
    </div>
  );
}
