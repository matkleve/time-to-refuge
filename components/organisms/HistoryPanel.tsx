"use client";

import { X } from "lucide-react";
import { LogEntry, PHASE_LABELS } from "@/lib/types";
import { formatLogTime } from "@/lib/format";
import { BACKDROP_CLASS, backdropStyle } from "@/lib/backdrop";
import { glassClass } from "@/lib/surfaces";
import { IconButton } from "@/components/atoms/IconButton";
import { Surface } from "@/components/atoms/Surface";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  log: LogEntry[];
  onClose: () => void;
}

function actionLabel(entry: LogEntry): string {
  const phase = PHASE_LABELS[entry.phase];
  switch (entry.action) {
    case "recorded":
      return `Recorded ${phase}`;
    case "reset":
      return `Reset ${phase}`;
    case "undo-recorded":
      return `Undid ${phase}`;
    case "undo-reset":
      return `Restored ${phase}`;
    default:
      return phase;
  }
}

export function HistoryPanel({ log, onClose }: HistoryPanelProps) {
  const sorted = [...log].sort((a, b) => b.at - a.at);

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
       Pointer-only convenience: clicking outside the panel closes (desktop).
       The real, keyboard-reachable control is the Close button below. */
    <div
      className={cn(
        "absolute inset-0 z-30 flex flex-col animate-fade-in-up",
        BACKDROP_CLASS,
        "lg:items-center lg:justify-center lg:bg-black/25",
      )}
      style={backdropStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Surface
        material="glass-panel"
        rim
        className="flex h-full w-full flex-col lg:h-[36rem] lg:max-h-[80vh] lg:w-[28rem] lg:rounded-3xl lg:shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/40 px-5 py-3">
          <h2 className="font-display text-lg font-semibold text-ink">History</h2>
          <IconButton icon={X} label="Close history" onClick={onClose} />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {sorted.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-2 px-6 text-center">
              <p className="font-display text-lg font-medium text-ink">No moments yet</p>
              <p className="text-sm text-muted">
                Recorded, reset, and undone times will gather here as the ceremony goes.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {sorted.map((entry) => (
                <li
                  key={entry.id}
                  className={cn("rounded-2xl px-4 py-3", glassClass("card", { rim: true }))}
                >
                  <p className="font-display text-base font-semibold text-ink">
                    {entry.personName}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{actionLabel(entry)}</p>
                  <p className="mt-1 font-mono text-xs tabular-nums text-subtle">
                    {formatLogTime(entry.at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Surface>
    </div>
  );
}
