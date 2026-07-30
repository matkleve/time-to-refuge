"use client";

import { LogEntry, PHASE_LABELS } from "@/lib/types";
import { formatLogTime, formatTimestamp } from "@/lib/format";

interface HistoryPanelProps {
  log: LogEntry[];
  onClose: () => void;
}

function describe(entry: LogEntry): string {
  const phase = PHASE_LABELS[entry.phase];
  switch (entry.action) {
    case "recorded":
      return `Recorded ${phase} for ${entry.personName} at ${formatTimestamp(entry.value)}`;
    case "reset":
      return `Reset ${phase} for ${entry.personName} (was ${formatTimestamp(entry.value)})`;
    case "undo-recorded":
      return `Undid ${phase} for ${entry.personName}`;
    case "undo-reset":
      return `Restored ${phase} for ${entry.personName} to ${formatTimestamp(entry.value)}`;
    default:
      return `${phase} for ${entry.personName}`;
  }
}

export function HistoryPanel({ log, onClose }: HistoryPanelProps) {
  const sorted = [...log].sort((a, b) => b.at - a.at);

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-lg font-semibold text-ink">History</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink hover:bg-card active:scale-95"
        >
          Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {sorted.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">
            Nothing recorded yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {sorted.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-line bg-card px-4 py-3"
              >
                <p className="text-sm text-ink">{describe(entry)}</p>
                <p className="mt-0.5 text-xs text-muted/70">{formatLogTime(entry.at)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
