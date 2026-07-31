export type Phase = "buddha" | "dharma" | "sangha";

export const PHASES: Phase[] = ["buddha", "dharma", "sangha"];

export const PHASE_LABELS: Record<Phase, string> = {
  buddha: "Buddha",
  dharma: "Dharma",
  sangha: "Sangha",
};

export interface Person {
  id: string;
  name: string;
  createdAt: number;
  buddha: number | null;
  dharma: number | null;
  sangha: number | null;
}

export function createPerson(name: string): Person {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    createdAt: Date.now(),
    buddha: null,
    dharma: null,
    sangha: null,
  };
}

export function nextEmptyPhase(person: Person): Phase | null {
  for (const phase of PHASES) {
    if (person[phase] === null) return phase;
  }
  return null;
}

export function isComplete(person: Person): boolean {
  return nextEmptyPhase(person) === null;
}

export type LogAction =
  | "recorded"
  | "reset"
  | "undo-recorded"
  | "undo-reset"
  | "redo-recorded"
  | "redo-reset";

export interface LogEntry {
  id: string;
  at: number;
  personId: string;
  personName: string;
  phase: Phase;
  action: LogAction;
  value: number | null;
}

export interface QuickLogEntry {
  id: string;
  at: number;
}

export function createQuickLogEntry(): QuickLogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    at: Date.now(),
  };
}

export function createLogEntry(
  personId: string,
  personName: string,
  phase: Phase,
  action: LogAction,
  value: number | null
): LogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    at: Date.now(),
    personId,
    personName,
    phase,
    action,
    value,
  };
}
