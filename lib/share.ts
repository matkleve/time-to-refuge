import { Person, PHASES, PHASE_LABELS } from "./types";
import { formatTimestamp } from "./format";

export function buildShareText(person: Person): string {
  const lines = PHASES.map((phase) => `${PHASE_LABELS[phase]}: ${formatTimestamp(person[phase])}`);
  return `${person.name} took refuge in the Three Jewels\n\n${lines.join("\n")}`;
}

export type ShareResult = "shared" | "copied" | "cancelled" | "unavailable";

export async function sharePerson(person: Person): Promise<ShareResult> {
  const text = buildShareText(person);

  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: "Time to Refuge", text });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
      // fall through to clipboard fallback for any other failure
    }
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      return "unavailable";
    }
  }

  return "unavailable";
}
