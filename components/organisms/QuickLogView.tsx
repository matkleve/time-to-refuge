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
import { PAGE_INLINE_GUTTER } from "@/lib/chrome";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Quick Log — same page skeleton as People / Fields:
 * sticky title band → scroll body. Desktop: list left, record button right
 * (Session rail proportions: w-64 / lg:w-80).
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
      <StickyPageChrome>
        <QuickLogPageChrome
          entryCount={entries.length}
          tz={tz}
          onTzChange={setTz}
          clearAll={clearAll}
        />
      </StickyPageChrome>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col md:flex-row md:gap-5 lg:gap-6",
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
           List column — left on desktop; stops tap-to-log on controls. */}
        <div
          className="focus-safe-scroll order-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-0 md:order-1"
          onClick={tapAnywhere ? (e) => e.stopPropagation() : undefined}
        >
          <QuickLogEntryList
            entries={entries}
            tz={tz}
            tapAnywhere={tapAnywhere}
            clearAllArmed={clearAll.armed}
            onDelete={deleteEntry}
          />
        </div>

        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
           Record control — right on desktop; not in the title band. */}
        <div
          className={cn(
            "order-2 shrink-0 pt-2",
            PAGE_INLINE_GUTTER,
            "md:order-2 md:flex md:w-64 md:flex-col md:justify-center md:self-stretch md:px-0 md:pt-0 md:pb-4 lg:w-80",
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
