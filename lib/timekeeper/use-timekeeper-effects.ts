"use client";

import { useEffect } from "react";
import type { FieldDef, LogEntry, Person } from "@/lib/types";
import {
  loadPeople,
  loadLog,
  loadFields,
  saveFields,
  savePeople,
  saveLog,
  loadRetreatName,
  saveRetreatName,
  loadUndoStack,
  saveUndoStack,
  loadRedoStack,
  saveRedoStack,
  type UndoEntry,
} from "@/lib/storage";

export function useTimekeeperLoadEffects({
  setFields,
  setPeople,
  setLog,
  setRetreatName,
  setUndoStack,
  setRedoStack,
  setReady,
}: {
  setFields: (v: FieldDef[]) => void;
  setPeople: (v: Person[]) => void;
  setLog: (v: LogEntry[]) => void;
  setRetreatName: (v: string) => void;
  setUndoStack: (v: UndoEntry[]) => void;
  setRedoStack: (v: UndoEntry[]) => void;
  setReady: (v: boolean) => void;
}) {
  useEffect(() => {
    const loadedFields = loadFields();
    setFields(loadedFields);
    setPeople(loadPeople(loadedFields));
    setLog(loadLog());
    setRetreatName(loadRetreatName());
    setUndoStack(loadUndoStack());
    setRedoStack(loadRedoStack());
    setReady(true);
  }, [setFields, setPeople, setLog, setRetreatName, setUndoStack, setRedoStack, setReady]);
}

export function useTimekeeperPersistEffects({
  ready,
  fields,
  people,
  log,
  retreatName,
  undoStack,
  redoStack,
}: {
  ready: boolean;
  fields: FieldDef[];
  people: Person[];
  log: LogEntry[];
  retreatName: string;
  undoStack: UndoEntry[];
  redoStack: UndoEntry[];
}) {
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
}

export function useRefugeKeyboardNav(
  view: string,
  peopleCount: number,
  setIndex: (fn: (i: number) => number) => void,
) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (view !== "refuge") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") setIndex((i) => Math.min(peopleCount - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [peopleCount, view, setIndex]);
}

export function useClampPersonIndex(
  peopleCount: number,
  index: number,
  setIndex: (v: number) => void,
) {
  useEffect(() => {
    if (index > peopleCount - 1) {
      setIndex(Math.max(0, peopleCount - 1));
    }
  }, [peopleCount, index, setIndex]);
}
