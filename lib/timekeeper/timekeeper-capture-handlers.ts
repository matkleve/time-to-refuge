import { Phase, createLogEntry, getTime, withTime, fieldLabel } from "@/lib/types";
import type { TimekeeperHandlersContext } from "@/lib/timekeeper/timekeeper-handlers-context";
import { createUndoStackHelpers } from "@/lib/timekeeper/timekeeper-undo-stack";

export function createCaptureHandlers(ctx: TimekeeperHandlersContext) {
  const { fields, people, setPeople, setLog } = ctx;
  const { pushUndo } = createUndoStackHelpers(ctx);

  function handleCapture(personId: string, phase: Phase) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const value = Date.now();
    const entry = createLogEntry(personId, person.name, phase, "recorded", value);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? withTime(p, phase, value) : p)),
    );
    setLog((prev) => [...prev, entry]);
    pushUndo({
      logId: entry.id,
      personId,
      phase,
      prevValue: null,
      nextValue: value,
      kind: "recorded",
      message: `Recorded ${fieldLabel(fields, phase)} for ${person.name}`,
    });
  }

  function handleClear(personId: string, phase: Phase) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const prevValue = getTime(person, phase);
    const entry = createLogEntry(personId, person.name, phase, "reset", prevValue);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? withTime(p, phase, null) : p)),
    );
    setLog((prev) => [...prev, entry]);
    pushUndo({
      logId: entry.id,
      personId,
      phase,
      prevValue,
      nextValue: null,
      kind: "reset",
      message: `Reset ${fieldLabel(fields, phase)} for ${person.name}`,
    });
  }

  function handleResetAll(personId: string) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    fields.forEach((field) => {
      if (getTime(person, field.id) !== null) handleClear(personId, field.id);
    });
  }

  return { handleCapture, handleClear, handleResetAll };
}

export function createEditTimeHandler(ctx: TimekeeperHandlersContext) {
  const { fields, people, setPeople, setLog } = ctx;
  const { pushUndo } = createUndoStackHelpers(ctx);

  return function handleEditTime(personId: string, phase: Phase, at: number) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const prevValue = getTime(person, phase);
    const entry = createLogEntry(personId, person.name, phase, "recorded", at);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? withTime(p, phase, at) : p)),
    );
    setLog((prev) => [...prev, entry]);
    pushUndo({
      logId: entry.id,
      personId,
      phase,
      prevValue,
      nextValue: at,
      kind: "recorded",
      message: `Edited ${fieldLabel(fields, phase)} for ${person.name}`,
    });
  };
}
