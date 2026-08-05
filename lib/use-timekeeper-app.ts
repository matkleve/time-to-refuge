"use client";

import { useEffect, useState } from "react";
import {
  Person,
  Phase,
  FieldDef,
  LogEntry,
  createPerson,
  createLogEntry,
  getTime,
  withTime,
  syncPersonTimes,
  fieldLabel,
} from "@/lib/types";
import {
  loadPeople,
  savePeople,
  loadLog,
  saveLog,
  loadFields,
  saveFields,
  loadRetreatName,
  saveRetreatName,
  loadUndoStack,
  saveUndoStack,
  loadRedoStack,
  saveRedoStack,
  type UndoEntry,
} from "@/lib/storage";
import type { AppView } from "@/components/atoms/ViewMenu";

export function useTimekeeperApp() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<AppView>("home");
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);
  const [requestedPhase, setRequestedPhase] = useState<Phase | null>(null);
  const [retreatName, setRetreatName] = useState("");

  useEffect(() => {
    const loadedFields = loadFields();
    setFields(loadedFields);
    setPeople(loadPeople(loadedFields));
    setLog(loadLog());
    setRetreatName(loadRetreatName());
    setUndoStack(loadUndoStack());
    setRedoStack(loadRedoStack());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveFields(fields);
  }, [fields, ready]);

  useEffect(() => {
    if (ready) savePeople(people);
  }, [people, ready]);

  useEffect(() => {
    if (ready) saveLog(log);
  }, [log, ready]);

  useEffect(() => {
    if (ready) saveRetreatName(retreatName);
  }, [retreatName, ready]);

  useEffect(() => {
    if (ready) saveUndoStack(undoStack);
  }, [undoStack, ready]);

  useEffect(() => {
    if (ready) saveRedoStack(redoStack);
  }, [redoStack, ready]);

  useEffect(() => {
    if (index > people.length - 1) {
      setIndex(Math.max(0, people.length - 1));
    }
  }, [people, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (view !== "refuge") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") setIndex((i) => Math.min(people.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [people.length, view]);

  function pushUndo(entry: UndoEntry) {
    setUndoStack((prev) => [...prev, entry]);
    setRedoStack([]);
  }

  function handleFieldsChange(next: FieldDef[]) {
    setFields(next);
    setPeople((prev) => prev.map((p) => syncPersonTimes(p, next)));
    setRequestedPhase(null);
  }

  function handleCapture(personId: string, phase: Phase) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const value = Date.now();
    const entry = createLogEntry(personId, person.name, phase, "recorded", value);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? withTime(p, phase, value) : p)),
    );
    setLog((prev) => [...prev, entry]);
    const label = fieldLabel(fields, phase);
    pushUndo({
      logId: entry.id,
      personId,
      phase,
      prevValue: null,
      nextValue: value,
      kind: "recorded",
      message: `Recorded ${label} for ${person.name}`,
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
    const label = fieldLabel(fields, phase);
    pushUndo({
      logId: entry.id,
      personId,
      phase,
      prevValue,
      nextValue: null,
      kind: "reset",
      message: `Reset ${label} for ${person.name}`,
    });
  }

  function handleResetAll(personId: string) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    fields.forEach((field) => {
      if (getTime(person, field.id) !== null) handleClear(personId, field.id);
    });
  }

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

  function handleAddPerson(name: string) {
    const p = createPerson(name, fields);
    setPeople((prev) => {
      const next = [...prev, p];
      setIndex(next.length - 1);
      return next;
    });
  }

  function handleDeletePerson(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  function handleEditTime(personId: string, phase: Phase, at: number) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const prevValue = getTime(person, phase);
    const entry = createLogEntry(personId, person.name, phase, "recorded", at);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? withTime(p, phase, at) : p)),
    );
    setLog((prev) => [...prev, entry]);
    const label = fieldLabel(fields, phase);
    pushUndo({
      logId: entry.id,
      personId,
      phase,
      prevValue,
      nextValue: at,
      kind: "recorded",
      message: `Edited ${label} for ${person.name}`,
    });
  }

  function handleOpenPersonAt(id: string, phase: Phase | null) {
    handleSelectPerson(id);
    setRequestedPhase(phase);
    setView("refuge");
  }

  function handleRenamePerson(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)));
  }

  function handleSelectPerson(id: string) {
    const i = people.findIndex((p) => p.id === id);
    if (i >= 0) setIndex(i);
  }

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(people.length - 1, i)));
  }

  return {
    ready,
    view,
    setView,
    fields,
    people,
    log,
    index,
    undoStack,
    redoStack,
    requestedPhase,
    setRequestedPhase,
    retreatName,
    setRetreatName,
    handleFieldsChange,
    handleCapture,
    handleClear,
    handleResetAll,
    handleUndo,
    handleRedo,
    handleAddPerson,
    handleDeletePerson,
    handleEditTime,
    handleOpenPersonAt,
    handleRenamePerson,
    goTo,
  };
}
