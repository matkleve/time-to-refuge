"use client";

import { useEffect, useState } from "react";
import { QuickLogEntry, createQuickLogEntry } from "@/lib/types";
import { loadQuickLog, saveQuickLog } from "@/lib/storage";
import { useArmedAction } from "@/lib/use-armed-action";
import { cn } from "@/lib/utils";
import { ClockStamp } from "@/components/atoms/ClockStamp";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { QuickLogEntryList } from "@/components/organisms/QuickLogEntryList";
import { QuickLogPageChrome } from "@/components/organisms/QuickLogPageChrome";
import {
  WORKSPACE_RAIL_WIDTH,
  WORKSPACE_SCROLL_COLUMN,
} from "@/lib/chrome";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Quick Log — page tools band → body inside ListPageFrame.
 * Desktop: record button left (session rail width), log list right.
 */
export function QuickLogView() {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<QuickLogEntry[]>([]);
  const [tz, setTz] = useState("UTC");
  const [flash, setFlash] = useState(false);
  const tapAnywhere = !useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setEntries(loadQuickLog());
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveQuickLog(entries);
  }, [entries, ready]);

  const clearAll = useArmedAction(() => setEntries([]));

  function handleLog() {
    setEntries((prev) => [...prev, createQuickLogEntry()]);
    setFlash(true);
    setTimeout(() => setFlash(false), 280);
    if (navigator.vibrate) navigator.vibrate(15);
  }

  if (!ready) return null;

  const bodyProps = {
    entries,
    tz,
    tapAnywhere,
    isDesktop: !tapAnywhere,
    flash,
    clearAll,
    onTzChange: setTz,
    onLog: handleLog,
    onDelete: (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)),
  };

  return (
    <ListPageFrame fill="workspace" navPage>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
         Phone: pointer-only convenience so any tap logs a time. */}
      <div
        className={cn(
          "no-select flex min-h-0 flex-1 flex-col",
          tapAnywhere && "cursor-pointer",
        )}
        onClick={tapAnywhere ? handleLog : undefined}
      >
        <QuickLogMobileBody {...bodyProps} />
        <QuickLogDesktopBody {...bodyProps} />
      </div>
    </ListPageFrame>
  );
}

type QuickLogBodyProps = {
  entries: QuickLogEntry[];
  tz: string;
  tapAnywhere: boolean;
  isDesktop: boolean;
  flash: boolean;
  clearAll: ReturnType<typeof useArmedAction>;
  onTzChange: (tz: string) => void;
  onLog: () => void;
  onDelete: (id: string) => void;
};

function QuickLogMobileBody({
  entries,
  tz,
  tapAnywhere,
  isDesktop,
  flash,
  clearAll,
  onTzChange,
  onLog,
  onDelete,
}: QuickLogBodyProps) {
  const pageChrome = (
    <QuickLogPageChrome
      entryCount={entries.length}
      tz={tz}
      onTzChange={onTzChange}
      clearAll={clearAll}
    />
  );

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col md:hidden",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
      )}
    >
      <div className="shrink-0 pb-2">{pageChrome}</div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
         List column — stop tap-anywhere propagation. */}
      <div
        className="focus-safe-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain"
        onClick={tapAnywhere ? (e) => e.stopPropagation() : undefined}
      >
        <QuickLogEntryList
          entries={entries}
          tz={tz}
          tapAnywhere={tapAnywhere}
          clearAllArmed={clearAll.armed}
          onDelete={onDelete}
        />
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
         Record button — stop tap-anywhere propagation. */}
      <div
        className="shrink-0 pt-2"
        onClick={tapAnywhere ? (e) => e.stopPropagation() : undefined}
      >
        <ClockStamp
          mode="quicklog"
          flash={flash}
          onLog={onLog}
          hint={isDesktop ? "Tap to log" : "Tap anywhere to log"}
        />
      </div>
    </div>
  );
}

function QuickLogDesktopBody({
  entries,
  tz,
  tapAnywhere,
  isDesktop,
  flash,
  clearAll,
  onTzChange,
  onLog,
  onDelete,
}: QuickLogBodyProps) {
  return (
    <div
      className={cn(
        "hidden min-h-0 flex-1 gap-3 py-3 sm:gap-4 sm:py-4 lg:gap-5 md:flex",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
      )}
    >
      <div className={cn(WORKSPACE_RAIL_WIDTH, "flex flex-col gap-3")}>
        <ClockStamp
          mode="quicklog"
          flash={flash}
          onLog={onLog}
          hint={isDesktop ? "Tap to log" : "Tap anywhere to log"}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="shrink-0">
          <QuickLogPageChrome
            entryCount={entries.length}
            tz={tz}
            onTzChange={onTzChange}
            clearAll={clearAll}
          />
        </div>
        <div className={cn(WORKSPACE_SCROLL_COLUMN, "min-h-0 flex-1")}>
          <QuickLogEntryList
            entries={entries}
            tz={tz}
            tapAnywhere={tapAnywhere}
            clearAllArmed={clearAll.armed}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
