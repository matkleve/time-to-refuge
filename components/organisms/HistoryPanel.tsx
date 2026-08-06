"use client";

import { LogEntry, FieldDef, fieldLabel } from "@/lib/types";
import { formatLogTime } from "@/lib/format";
import { staticGlassFlushClass } from "@/lib/interactive-glass";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
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
    <ListPageFrame>
      <div className="mt-3">
        {sorted.length === 0 ? (
          <GlassEmptyNote title="No moments yet" className="mt-16 px-6">
            Recorded, reset, and undone times will gather here as the ceremony goes.
          </GlassEmptyNote>
        ) : (
          <ul className="space-y-2 pb-2">
            {sorted.map((entry) => (
              <li
                key={entry.id}
                className={cn(
                  "rounded-2xl px-4 py-3 animate-fade-in-up",
                  staticGlassFlushClass(),
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
    </ListPageFrame>
  );
}
