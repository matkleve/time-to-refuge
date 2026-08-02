import {
  Person,
  LogEntry,
  QuickLogEntry,
  Phase,
  FieldDef,
  DEFAULT_FIELDS,
  syncPersonTimes,
} from "./types";

const STORAGE_KEY = "timekeeper:people";
const LOG_KEY = "timekeeper:log";
const QUICKLOG_KEY = "timekeeper:quicklog";
const RETREAT_NAME_KEY = "timekeeper:retreat-name";
const FIELDS_KEY = "timekeeper:fields";
const UNDO_KEY = "timekeeper:undo";
const REDO_KEY = "timekeeper:redo";

/** Cap so a long ceremony can't blow past private-mode quotas. */
const UNDO_STACK_MAX = 80;

export interface UndoEntry {
  logId: string;
  personId: string;
  phase: Phase;
  /** Field value before the action (what undo restores). */
  prevValue: number | null;
  /** Field value after the action (what redo restores). */
  nextValue: number | null;
  kind: "recorded" | "reset";
  message: string;
}

function readJsonArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as T[];
  } catch {
    return [];
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — keep the in-memory session alive */
  }
}

function isFieldDef(value: unknown): value is FieldDef {
  if (!value || typeof value !== "object") return false;
  const field = value as Partial<FieldDef>;
  return typeof field.id === "string" && field.id.length > 0 && typeof field.label === "string";
}

function isUndoEntry(value: unknown): value is UndoEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<UndoEntry>;
  return (
    typeof entry.logId === "string" &&
    typeof entry.personId === "string" &&
    typeof entry.phase === "string" &&
    (entry.kind === "recorded" || entry.kind === "reset") &&
    typeof entry.message === "string" &&
    (entry.prevValue === null || typeof entry.prevValue === "number") &&
    (entry.nextValue === null || typeof entry.nextValue === "number")
  );
}

function loadUndoLike(key: string): UndoEntry[] {
  return readJsonArray<unknown>(key).filter(isUndoEntry).slice(-UNDO_STACK_MAX);
}

/** Legacy people had top-level buddha/dharma/sangha instead of `times`. */
function migratePerson(raw: unknown, fields: FieldDef[]): Person | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.name !== "string") return null;

  let times: Record<string, number | null> = {};
  if (row.times && typeof row.times === "object" && !Array.isArray(row.times)) {
    for (const [key, value] of Object.entries(row.times as Record<string, unknown>)) {
      times[key] = typeof value === "number" ? value : value === null ? null : null;
    }
  } else {
    for (const legacy of ["buddha", "dharma", "sangha"] as const) {
      const value = row[legacy];
      times[legacy] = typeof value === "number" ? value : null;
    }
  }

  const person: Person = {
    id: row.id,
    name: row.name,
    createdAt: typeof row.createdAt === "number" ? row.createdAt : Date.now(),
    times,
  };
  return syncPersonTimes(person, fields);
}

export function loadFields(): FieldDef[] {
  const loaded = readJsonArray<unknown>(FIELDS_KEY).filter(isFieldDef);
  if (loaded.length === 0) return DEFAULT_FIELDS.map((f) => ({ ...f }));
  return loaded.map((f) => ({ id: f.id, label: f.label.trim() || "Field" }));
}

export function saveFields(fields: FieldDef[]): void {
  writeJson(FIELDS_KEY, fields);
}

export function loadPeople(fields: FieldDef[] = DEFAULT_FIELDS): Person[] {
  return readJsonArray<unknown>(STORAGE_KEY)
    .map((row) => migratePerson(row, fields))
    .filter((p): p is Person => p !== null);
}

export function savePeople(people: Person[]): void {
  writeJson(STORAGE_KEY, people);
}

export function loadLog(): LogEntry[] {
  return readJsonArray<LogEntry>(LOG_KEY);
}

export function saveLog(log: LogEntry[]): void {
  writeJson(LOG_KEY, log);
}

export function loadQuickLog(): QuickLogEntry[] {
  return readJsonArray<QuickLogEntry>(QUICKLOG_KEY);
}

export function saveQuickLog(log: QuickLogEntry[]): void {
  writeJson(QUICKLOG_KEY, log);
}

/** One name for the whole session — which retreat this is — not per-person. */
export function loadRetreatName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(RETREAT_NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveRetreatName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RETREAT_NAME_KEY, name);
  } catch {
    /* ignore quota */
  }
}

export function loadUndoStack(): UndoEntry[] {
  return loadUndoLike(UNDO_KEY);
}

export function saveUndoStack(stack: UndoEntry[]): void {
  writeJson(UNDO_KEY, stack.slice(-UNDO_STACK_MAX));
}

export function loadRedoStack(): UndoEntry[] {
  return loadUndoLike(REDO_KEY);
}

export function saveRedoStack(stack: UndoEntry[]): void {
  writeJson(REDO_KEY, stack.slice(-UNDO_STACK_MAX));
}
