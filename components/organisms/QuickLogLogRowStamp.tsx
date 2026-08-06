"use client";

import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export function QuickLogLogRowStamp({
  index,
  date,
  time,
  ms,
  red,
  showActions,
  onToggleActions,
}: {
  index: number;
  date: string;
  time: string;
  ms: string;
  red: boolean;
  showActions: boolean;
  onToggleActions: (e: React.MouseEvent) => void;
}) {
  return (
    <Button
      variant="row"
      rowFlush
      fullWidth
      onClick={onToggleActions}
      aria-expanded={showActions}
      aria-label={
        showActions ? `Hide actions for log #${index}` : `Show actions for log #${index}`
      }
      className="justify-between"
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
    </Button>
  );
}
