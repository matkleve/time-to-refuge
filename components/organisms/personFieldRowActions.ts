import { Phase } from "@/lib/types";
import { formatTimestamp } from "@/lib/format";
import type { PersonFieldRowProps } from "./PersonFieldRow";

export function createFieldRowClickHandler(
  filled: boolean,
  confirmSkip: boolean,
  skipsAhead: boolean,
  phase: Phase,
  onSelectPhase: PersonFieldRowProps["onSelectPhase"],
  setConfirmSkip: (value: boolean) => void,
  setShowActions: (value: boolean | ((v: boolean) => boolean)) => void,
  disarm: () => void,
) {
  return function handleRowClick() {
    if (!filled) {
      if (confirmSkip) {
        setConfirmSkip(false);
        return;
      }
      if (skipsAhead) {
        setConfirmSkip(true);
        return;
      }
      onSelectPhase?.(phase);
      return;
    }
    setShowActions((v) => !v);
    disarm();
  };
}

export async function copyFieldRowTime(value: number | null, setCopied: (v: boolean) => void) {
  try {
    await navigator.clipboard.writeText(formatTimestamp(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  } catch {
    // Clipboard denied — say nothing.
  }
}
