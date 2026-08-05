"use client";

import { RotateCcw } from "lucide-react";
import { TimezoneSelect } from "@/components/atoms/TimezoneSelect";
import { PageTitle } from "@/components/atoms/PageTitle";
import { IconButton } from "@/components/atoms/IconButton";
import type { useArmedAction } from "@/lib/use-armed-action";

export function QuickLogPageChrome({
  entryCount,
  tz,
  onTzChange,
  clearAll,
}: {
  entryCount: number;
  tz: string;
  onTzChange: (tz: string) => void;
  clearAll: ReturnType<typeof useArmedAction>;
}) {
  return (
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
            disabled={entryCount === 0}
            armed={clearAll.armed}
            onClick={(e) => {
              e.stopPropagation();
              clearAll.trigger();
            }}
          />
        }
      />
      <p className="text-base tabular-nums text-muted">{entryCount} logged</p>
      <TimezoneSelect value={tz} onChange={onTzChange} chip />
    </div>
  );
}
