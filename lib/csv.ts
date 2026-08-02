import { Person, FieldDef, getTime } from "./types";
import { formatDateForFile } from "./format";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * The retreat name is a column, not a leading metadata line — repeated on
 * every row rather than written once above the header. Field columns follow
 * the current field list (Buddha/Dharma/Sangha by default).
 */
export function peopleToCsv(
  people: Person[],
  fields: FieldDef[],
  retreatName = "",
): string {
  const withRetreat = retreatName.trim().length > 0;
  const header = [
    ...(withRetreat ? ["Retreat"] : []),
    "Name",
    ...fields.map((f) => f.label),
  ];
  const rows = people.map((p) => [
    ...(withRetreat ? [csvEscape(retreatName)] : []),
    csvEscape(p.name),
    ...fields.map((f) => formatDateForFile(getTime(p, f.id))),
  ]);
  return [header, ...rows].map((row) => row.join(",")).join("\n");
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "person"
  );
}

export function downloadCsv(
  people: Person[],
  fields: FieldDef[],
  retreatName = "",
  nameBase = "timekeeper",
): void {
  const csv = peopleToCsv(people, fields, retreatName);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  a.href = url;
  a.download = `${nameBase}-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPersonCsv(
  person: Person,
  fields: FieldDef[],
  retreatName = "",
): void {
  downloadCsv([person], fields, retreatName, `timekeeper-${slugify(person.name)}`);
}
