/** Stable id for a recordable field (was fixed buddha/dharma/sangha). */
export type FieldId = string;

/** @deprecated Use FieldId — kept as alias for call-site readability. */
export type Phase = FieldId;

export interface FieldDef {
  id: FieldId;
  label: string;
}

/** Ceremony default — also the migration target for legacy people rows. */
export const DEFAULT_FIELDS: FieldDef[] = [
  { id: "buddha", label: "Buddha" },
  { id: "dharma", label: "Dharma" },
  { id: "sangha", label: "Sangha" },
];

export const MAX_FIELDS = 8;

export interface Person {
  id: string;
  name: string;
  createdAt: number;
  /** Timestamp per field id, or null if empty. */
  times: Record<FieldId, number | null>;
}

export function emptyTimes(fields: FieldDef[]): Record<FieldId, number | null> {
  const times: Record<FieldId, number | null> = {};
  for (const field of fields) times[field.id] = null;
  return times;
}

export function createPerson(name: string, fields: FieldDef[]): Person {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    createdAt: Date.now(),
    times: emptyTimes(fields),
  };
}

export function fieldLabel(fields: FieldDef[], id: FieldId): string {
  return fields.find((f) => f.id === id)?.label ?? id;
}

export function getTime(person: Person, fieldId: FieldId): number | null {
  return person.times[fieldId] ?? null;
}

export function withTime(
  person: Person,
  fieldId: FieldId,
  value: number | null,
): Person {
  return { ...person, times: { ...person.times, [fieldId]: value } };
}

/** Align a person's times map to the current field list (add nulls, drop orphans). */
export function syncPersonTimes(person: Person, fields: FieldDef[]): Person {
  const times: Record<FieldId, number | null> = {};
  for (const field of fields) {
    times[field.id] = person.times[field.id] ?? null;
  }
  return { ...person, times };
}

export function nextEmptyPhase(person: Person, fields: FieldDef[]): Phase | null {
  for (const field of fields) {
    if (getTime(person, field.id) === null) return field.id;
  }
  return null;
}

export function isComplete(person: Person, fields: FieldDef[]): boolean {
  return nextEmptyPhase(person, fields) === null;
}

export function createFieldId(): FieldId {
  return `field-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
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
  value: number | null,
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
