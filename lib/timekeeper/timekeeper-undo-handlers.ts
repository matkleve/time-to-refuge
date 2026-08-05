import { createLogEntry, withTime } from "@/lib/types";
import type { TimekeeperHandlersContext } from "@/lib/timekeeper/timekeeper-handlers-context";

export function createUndoRedoHandlers(ctx: TimekeeperHandlersContext) {
  const {
    people,
    setPeople,
    setLog,
    undoStack,
    setUndoStack,
    redoStack,
    setRedoStack,
  } = ctx;

  function handleUndo() {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    const person = people.find((p) => p.id === last.personId);
    if (person) {
      setPeople((prev) =>
        prev.map((p) =>
          p.id === last.personId ? withTime(p, last.phase, last.prevValue) : p,
        ),
      );
      const entry = createLogEntry(
        last.personId,
        person.name,
        last.phase,
        last.kind === "recorded" ? "undo-recorded" : "undo-reset",
        last.prevValue,
      );
      setLog((prev) => [...prev, entry]);
    }
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    const person = people.find((p) => p.id === last.personId);
    if (person) {
      setPeople((prev) =>
        prev.map((p) =>
          p.id === last.personId ? withTime(p, last.phase, last.nextValue) : p,
        ),
      );
      const entry = createLogEntry(
        last.personId,
        person.name,
        last.phase,
        last.kind === "recorded" ? "redo-recorded" : "redo-reset",
        last.nextValue,
      );
      setLog((prev) => [...prev, entry]);
    }
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, last]);
  }

  return { handleUndo, handleRedo };
}
