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
      return `Recorded ${phase} for ${entry.personName}`;
    case "reset":
      return `Reset ${phase} for ${entry.personName}`;
    case "undo-recorded":
      return `Undid ${phase} for ${entry.personName}`;
    case "undo-reset":
      return `Restored ${phase} for ${entry.personName}`;
    default:
      return `${phase} for ${entry.personName}`;
  }
}

export function HistoryPanel({ log, onClose }: HistoryPanelProps) {
  const sorted = [...log].sort((a, b) => b.at - a.at);

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
       Pointer-only convenience: clicking the dimmed backdrop closes the dialog
       (desktop only — on mobile it's edge-to-edge, so there's no backdrop to
       click). The real, keyboard-reachable control is the Close button below. */
    <div
      className="absolute inset-0 z-30 flex flex-col bg-white animate-fade-in-up lg:items-center lg:justify-center lg:bg-black/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Filled, not glass — this sits directly over the live Refuge view
          (the card, the record button), not the plain backdrop photo.
          `backdrop-filter` blurs whatever is actually behind it, so a glass
          dialog here shows a distracting ghost of that live UI through
          itself, not the photo — see design system §3a. */}
      <div className="flex h-full w-full flex-col bg-white lg:h-[36rem] lg:max-h-[80vh] lg:w-[28rem] lg:rounded-3xl lg:shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">History</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line px-3 py-1.5 text-sm text-ink transition-colors duration-200 hover:bg-card active:scale-95"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {sorted.length === 0 ? (
            <p className="mt-10 text-center text-sm text-subtle">
              Nothing recorded yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {sorted.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-2xl bg-card px-4 py-2.5"
                >
                  <p className="text-base text-ink">{describe(entry)}</p>
                  <p className="mt-0.5 font-mono text-xs tabular-nums text-subtle">
                    {formatLogTime(entry.at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
