"use client";

import { LogEntry, FieldDef, fieldLabel } from "@/lib/types";
import { formatLogTime } from "@/lib/format";
import { glassClass } from "@/lib/surfaces";
import { Surface } from "@/components/atoms/Surface";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  log: LogEntry[];
  fields: FieldDef[];
}

function actionLabel(entry: LogEntry, fields: FieldDef[]): string {
  const phase = fieldLabel(fields, entry.phase);
  switch (entry.action) {
    case "recorded":
      return `Recorded ${phase}`;
    case "reset":
      return `Reset ${phase}`;
    case "undo-recorded":
      return `Undid ${phase}`;
    case "undo-reset":
      return `Restored ${phase}`;
    case "redo-recorded":
      return `Redid ${phase}`;
    case "redo-reset":
      return `Redid reset ${phase}`;
    default:
      return phase;
  }
}

/**
 * History page — same shell slot as Refuge / Quick Log / People, not a
 * modal or full-screen overlay.
 */
export function HistoryPanel({ log, fields }: HistoryPanelProps) {
  const sorted = [...log].sort((a, b) => b.at - a.at);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Surface material="glass-panel" className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center border-b border-white/40 px-5 py-3">
          <h2 className="font-display text-lg font-semibold text-ink">History</h2>
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
            <ul className="mx-auto w-full max-w-md space-y-2">
              {sorted.map((entry) => (
                <li
                  key={entry.id}
                  className={cn(
                    "rounded-2xl px-4 py-3 animate-fade-in-up",
                    glassClass("card", { rim: true }),
                  )}
                >
                  <p className="font-display text-base font-semibold text-ink">
                    {entry.personName}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{actionLabel(entry, fields)}</p>
                  <p className="mt-1 font-mono text-sm tabular-nums text-subtle">
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
