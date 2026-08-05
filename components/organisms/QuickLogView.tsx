"use client";

import { useEffect, useState } from "react";
import { QuickLogEntry, createQuickLogEntry } from "@/lib/types";
import { loadQuickLog, saveQuickLog } from "@/lib/storage";
import { useArmedAction } from "@/lib/use-armed-action";
import { cn } from "@/lib/utils";
import { QuickLogButton } from "@/components/atoms/QuickLogButton";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import { QuickLogLogRow } from "@/components/organisms/QuickLogLogRow";
import { QuickLogPageChrome } from "@/components/organisms/QuickLogPageChrome";
import { PAGE_INLINE_GUTTER } from "@/lib/chrome";
import { useMediaQuery } from "@/lib/use-media-query";

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

  const sorted = [...entries].sort((a, b) => b.at - a.at);
  const isDesktop = !tapAnywhere;

  const logList = (
    <div className={cn("flex w-full flex-col-reverse gap-2 py-3", PAGE_INLINE_GUTTER)}>
      {sorted.length === 0 ? (
        <GlassEmptyNote>
          {tapAnywhere ? "Tap anywhere to log a time." : "Tap the button to log a time."}
        </GlassEmptyNote>
      ) : (
        sorted.map((entry, i) => (
          <QuickLogLogRow
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
       Phone: pointer-only convenience so any tap logs a time. */
    <div
      className={cn(
        "no-select flex h-full min-h-0 w-full flex-1 flex-col md:flex-row md:gap-5 lg:gap-6",
        tapAnywhere && "cursor-pointer",
      )}
      onClick={tapAnywhere ? handleLog : undefined}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
         Stops the page-wide tap-to-log layer; Clear / rows are real controls. */}
      <div
        className="focus-safe-scroll order-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-0 md:order-2"
        onClick={tapAnywhere ? (e) => e.stopPropagation() : undefined}
      >
        <StickyPageChrome>
          <QuickLogPageChrome
            entryCount={entries.length}
            tz={tz}
            onTzChange={setTz}
            clearAll={clearAll}
          />
        </StickyPageChrome>
        {logList}
      </div>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
         Record control owns the stamp; don’t double-fire from the pad. */}
      <div
        className={cn(
          "order-2 w-full shrink-0 pt-2",
          PAGE_INLINE_GUTTER,
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
          "md:order-1 md:flex md:w-64 md:flex-col md:justify-center md:self-stretch md:px-0 md:pb-4 lg:w-80",
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
