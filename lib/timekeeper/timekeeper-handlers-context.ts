import type { Person, Phase, FieldDef, LogEntry } from "@/lib/types";
import type { UndoEntry } from "@/lib/storage";
import type { AppView } from "@/components/atoms/ViewMenu";
import type { Dispatch, SetStateAction } from "react";

export type TimekeeperHandlersContext = {
  fields: FieldDef[];
  setFields: Dispatch<SetStateAction<FieldDef[]>>;
  people: Person[];
  setPeople: Dispatch<SetStateAction<Person[]>>;
  log: LogEntry[];
  setLog: Dispatch<SetStateAction<LogEntry[]>>;
  undoStack: UndoEntry[];
  setUndoStack: Dispatch<SetStateAction<UndoEntry[]>>;
  redoStack: UndoEntry[];
  setRedoStack: Dispatch<SetStateAction<UndoEntry[]>>;
  setIndex: Dispatch<SetStateAction<number>>;
  setRequestedPhase: Dispatch<SetStateAction<Phase | null>>;
  setView: Dispatch<SetStateAction<AppView>>;
};
