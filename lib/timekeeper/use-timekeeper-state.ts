"use client";

import { useState } from "react";
import type { Person, Phase, FieldDef, LogEntry } from "@/lib/types";
import type { UndoEntry } from "@/lib/storage";
import type { AppView } from "@/components/atoms/ViewMenu";
import {
  useClampPersonIndex,
  useRefugeKeyboardNav,
  useTimekeeperLoadEffects,
  useTimekeeperPersistEffects,
} from "@/lib/timekeeper/use-timekeeper-effects";

export function useTimekeeperState(initialView: AppView = "home") {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<AppView>(initialView);
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);
  const [requestedPhase, setRequestedPhase] = useState<Phase | null>(null);
  const [retreatName, setRetreatName] = useState("");

  useTimekeeperLoadEffects({
    setFields,
    setPeople,
    setLog,
    setRetreatName,
    setUndoStack,
    setRedoStack,
    setReady,
  });

  useTimekeeperPersistEffects({
    ready,
    fields,
    people,
    log,
    retreatName,
    undoStack,
    redoStack,
  });

  useClampPersonIndex(people.length, index, setIndex);
  useRefugeKeyboardNav(view, people.length, setIndex);

  return {
    ready,
    view,
    setView,
    fields,
    setFields,
    people,
    setPeople,
    log,
    setLog,
    index,
    setIndex,
    undoStack,
    setUndoStack,
    redoStack,
    setRedoStack,
    requestedPhase,
    setRequestedPhase,
    retreatName,
    setRetreatName,
  };
}

export type TimekeeperState = ReturnType<typeof useTimekeeperState>;
