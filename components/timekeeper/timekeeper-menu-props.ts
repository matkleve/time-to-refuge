import type { UndoEntry } from "@/lib/storage";

export function undoRedoMenuProps(
  undoStack: UndoEntry[],
  redoStack: UndoEntry[],
) {
  const lastUndo = undoStack[undoStack.length - 1];
  const lastRedo = redoStack[redoStack.length - 1];
  return {
    undoDisabled: undoStack.length === 0,
    undoLabel: lastUndo ? `Undo: ${lastUndo.message}` : "Undo",
    redoDisabled: redoStack.length === 0,
    redoLabel: lastRedo ? `Redo: ${lastRedo.message}` : "Redo",
  };
}
