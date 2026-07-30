import { Person } from "./types";
import { formatDateForFile } from "./format";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function peopleToCsv(people: Person[]): string {
  const header = ["Name", "Buddha", "Dharma", "Sangha"];
  const rows = people.map((p) => [
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

export function downloadCsv(people: Person[], nameBase = "time-to-refuge"): void {
  const csv = peopleToCsv(people);
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

export function downloadPersonCsv(person: Person): void {
  downloadCsv([person], `refuge-${slugify(person.name)}`);
}
