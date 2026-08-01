import { Person, LogEntry, QuickLogEntry, Phase } from "./types";

const STORAGE_KEY = "time-to-refuge:people";
const LOG_KEY = "time-to-refuge:log";
const QUICKLOG_KEY = "time-to-refuge:quicklog";
const RETREAT_NAME_KEY = "time-to-refuge:retreat-name";
const UNDO_KEY = "time-to-refuge:undo";
const REDO_KEY = "time-to-refuge:redo";

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

function isUndoEntry(value: unknown): value is UndoEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<UndoEntry>;
  return (
    typeof entry.logId === "string" &&
    typeof entry.personId === "string" &&
    (entry.phase === "buddha" || entry.phase === "dharma" || entry.phase === "sangha") &&
    (entry.kind === "recorded" || entry.kind === "reset") &&
    typeof entry.message === "string" &&
    (entry.prevValue === null || typeof entry.prevValue === "number") &&
    (entry.nextValue === null || typeof entry.nextValue === "number")
  );
}

function loadUndoLike(key: string): UndoEntry[] {
  return readJsonArray<unknown>(key).filter(isUndoEntry).slice(-UNDO_STACK_MAX);
}

export function loadPeople(): Person[] {
  return readJsonArray<Person>(STORAGE_KEY);
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
