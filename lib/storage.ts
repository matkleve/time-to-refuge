import { Person, LogEntry, QuickLogEntry } from "./types";

const STORAGE_KEY = "time-to-refuge:people";
const LOG_KEY = "time-to-refuge:log";
const QUICKLOG_KEY = "time-to-refuge:quicklog";

export function loadPeople(): Person[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Person[];
  } catch {
    return [];
  }
}

export function savePeople(people: Person[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}

export function loadLog(): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LogEntry[];
  } catch {
    return [];
  }
}

export function saveLog(log: LogEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOG_KEY, JSON.stringify(log));
}

export function loadQuickLog(): QuickLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUICKLOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as QuickLogEntry[];
  } catch {
    return [];
  }
}

export function saveQuickLog(log: QuickLogEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUICKLOG_KEY, JSON.stringify(log));
}
