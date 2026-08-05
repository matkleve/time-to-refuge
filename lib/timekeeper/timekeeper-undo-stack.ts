import type { UndoEntry } from "@/lib/storage";
import type { TimekeeperHandlersContext } from "@/lib/timekeeper/timekeeper-handlers-context";

export function createUndoStackHelpers(ctx: TimekeeperHandlersContext) {
  const { setUndoStack, setRedoStack } = ctx;

  function pushUndo(entry: UndoEntry) {
    setUndoStack((prev) => [...prev, entry]);
    setRedoStack([]);
  }

  return { pushUndo };
}
