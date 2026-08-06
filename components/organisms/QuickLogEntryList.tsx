"use client";

import { QuickLogEntry } from "@/lib/types";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { QuickLogLogRow } from "@/components/organisms/QuickLogLogRow";
import { cn } from "@/lib/utils";

export function QuickLogEntryList({
  entries,
  tz,
  tapAnywhere,
  clearAllArmed,
  onDelete,
}: {
  entries: QuickLogEntry[];
  tz: string;
  tapAnywhere: boolean;
  clearAllArmed: boolean;
  onDelete: (id: string) => void;
}) {
  const sorted = [...entries].sort((a, b) => b.at - a.at);

  return (
    <div className={cn("flex w-full flex-col gap-2 py-3")}>
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
            armedAll={clearAllArmed}
            onDelete={() => onDelete(entry.id)}
          />
        ))
      )}
    </div>
  );
}
