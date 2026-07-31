import { Person } from "./types";
import { formatDateForFile } from "./format";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * The retreat name is a column, not a leading metadata line — repeated on
 * every row rather than written once above the header. Some tools tolerate
 * a comment row before the real header; plenty don't, and a uniform column
 * count is the one CSV shape every spreadsheet app agrees on. Omitted
 * entirely (not even an empty column) when there's no retreat name to give,
 * so exports before this feature and exports with nothing entered look the
 * same rather than gaining a permanently-blank column.
 */
export function peopleToCsv(people: Person[], retreatName = ""): string {
  const withRetreat = retreatName.trim().length > 0;
  const header = [
    ...(withRetreat ? ["Retreat"] : []),
    "Name",
    "Buddha",
    "Dharma",
    "Sangha",
  ];
  const rows = people.map((p) => [
    ...(withRetreat ? [csvEscape(retreatName)] : []),
    csvEscape(p.name),
    formatDateForFile(p.buddha),
    formatDateForFile(p.dharma),
    formatDateForFile(p.sangha),
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

export function downloadCsv(people: Person[], retreatName = "", nameBase = "time-to-refuge"): void {
  const csv = peopleToCsv(people, retreatName);
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

export function downloadPersonCsv(person: Person, retreatName = ""): void {
  downloadCsv([person], retreatName, `refuge-${slugify(person.name)}`);
}
