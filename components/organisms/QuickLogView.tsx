"use client";

import { useEffect, useState } from "react";
import { QuickLogEntry, createQuickLogEntry } from "@/lib/types";
import { loadQuickLog, saveQuickLog } from "@/lib/storage";
import { useArmedAction } from "@/lib/use-armed-action";
import { cn } from "@/lib/utils";
import { QuickLogButton } from "@/components/atoms/QuickLogButton";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import { QuickLogEntryList } from "@/components/organisms/QuickLogEntryList";
import { QuickLogPageChrome } from "@/components/organisms/QuickLogPageChrome";
import { PAGE_INLINE_GUTTER, QUICKLOG_BODY_GRID } from "@/lib/chrome";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Quick Log — sticky title band → body grid.
 * Desktop: list left (1.6fr), record button right (1fr).
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

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  if (!ready) return null;

  const isDesktop = !tapAnywhere;

  const pageChrome = (
    <QuickLogPageChrome
      entryCount={entries.length}
      tz={tz}
      onTzChange={setTz}
      clearAll={clearAll}
    />
  );

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
       Phone: pointer-only convenience so any tap logs a time. */
    <div
      className={cn(
        "no-select flex h-full min-h-0 w-full flex-1 flex-col",
        tapAnywhere && "cursor-pointer",
      )}
      onClick={tapAnywhere ? handleLog : undefined}
    >
      <StickyPageChrome className="md:hidden">{pageChrome}</StickyPageChrome>

      <div
        className={cn(
          "min-h-0 flex-1",
          QUICKLOG_BODY_GRID,
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
           List column — chrome + scroll; clipped so glass rows never bleed into the button column. */}
        <div
          className="isolate flex min-h-0 min-w-0 flex-col contain-paint"
          onClick={tapAnywhere ? (e) => e.stopPropagation() : undefined}
        >
          <StickyPageChrome className="hidden md:block">{pageChrome}</StickyPageChrome>

          <div
            className="focus-safe-scroll min-h-0 flex-1 overflow-y-auto overflow-x-clip overscroll-contain px-0"
          >
            <QuickLogEntryList
              entries={entries}
              tz={tz}
              tapAnywhere={tapAnywhere}
              clearAllArmed={clearAll.armed}
              onDelete={deleteEntry}
            />
          </div>
        </div>

        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
           Record column — isolated stack; no list backdrop bleeds through glass. */}
        <div
          className={cn(
            "isolate min-h-0 min-w-0 overflow-hidden contain-paint pt-2",
            PAGE_INLINE_GUTTER,
            "md:flex md:flex-col md:justify-center md:px-0 md:pt-0 md:pb-4",
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
    </div>
  );
}
