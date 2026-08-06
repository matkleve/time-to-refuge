import {
  createPerson,
  DEFAULT_FIELDS,
  withTime,
  type FieldDef,
  type Person,
} from "@/lib/types";

export const DEMO_FIELDS: FieldDef[] = DEFAULT_FIELDS;

export const DEMO_FIELDS_EIGHT: FieldDef[] = [
  ...DEFAULT_FIELDS,
  { id: "field-4", label: "Field 4" },
  { id: "field-5", label: "Field 5" },
  { id: "field-6", label: "Field 6" },
  { id: "field-7", label: "Field 7" },
  { id: "field-8", label: "Field 8" },
];

const base = createPerson("Alex", DEMO_FIELDS);
const t = Date.UTC(2026, 7, 5, 14, 30, 0);

export const DEMO_PERSON_EMPTY: Person = base;

export const DEMO_PERSON_PARTIAL: Person = withTime(
  withTime(base, "buddha", t),
  "dharma",
  t + 3600000,
);

export const DEMO_PERSON_DONE: Person = withTime(
  withTime(withTime(base, "buddha", t), "dharma", t + 3600000), "sangha", t + 7200000,
);
