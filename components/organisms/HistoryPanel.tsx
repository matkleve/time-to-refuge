"use client";

import { History } from "lucide-react";
import { LogEntry, FieldDef, fieldLabel } from "@/lib/types";
import { formatLogTime } from "@/lib/format";
import { glassClass } from "@/lib/surfaces";
import { PageTitle } from "@/components/atoms/PageTitle";
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
 * History — open backdrop like Refuge / People / Quick Log.
 * Milky glass lives on the rows (and empty note), not a full-page sheet.
 */
export function HistoryPanel({ log, fields }: HistoryPanelProps) {
  const sorted = [...log].sort((a, b) => b.at - a.at);

  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pt-2 sm:px-5 sm:pt-3"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <PageTitle icon={History} title="History" className="shrink-0" />

      <div className="mt-3 flex-1">
        {sorted.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 px-6 text-center">
            <Surface
              material="glass-panel"
              rim
              className="rounded-2xl px-5 py-4"
            >
              <p className="font-display text-lg font-medium text-ink">No moments yet</p>
              <p className="mt-1 text-sm text-muted">
                Recorded, reset, and undone times will gather here as the ceremony goes.
              </p>
            </Surface>
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
    </div>
  );
}
