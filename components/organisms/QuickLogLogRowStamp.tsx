"use client";

import { controlMinH } from "@/lib/control-size";
import { glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
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
    <button
      type="button"
      onClick={onToggleActions}
      aria-expanded={showActions}
      aria-label={
        showActions ? `Hide actions for log #${index}` : `Show actions for log #${index}`
      }
      className={cn(
        "flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden rounded-2xl px-4",
        controlMinH.md,
        userFeedbackClass({ press: "md" }),
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
  );
}
