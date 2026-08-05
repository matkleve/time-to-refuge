import { useCallback, useState } from "react";
import { Phase } from "@/lib/types";
import { fromTimeInput, toTimeInput } from "@/lib/format";
import { useArmedAction } from "@/lib/use-armed-action";
import { useDismissible } from "@/lib/use-dismissible";
import type { PersonFieldRowProps } from "./PersonFieldRow";

export function usePersonFieldRowDismiss(
  onClear: PersonFieldRowProps["onClear"],
  phase: Phase,
  showActions: boolean,
  setShowActions: (value: boolean) => void,
  armedAll: boolean,
) {
  const armedReset = useArmedAction(() => {
    onClear?.(phase);
    setShowActions(false);
  });
  const reset = { ...armedReset, armed: armedReset.armed || armedAll };
  const { disarm } = armedReset;

  const closeActions = useCallback(() => {
    setShowActions(false);
    disarm();
  }, [disarm, setShowActions]);

  const dismissRef = useDismissible<HTMLDivElement>({
    active: showActions,
    onDismiss: closeActions,
  });

  return { armedReset, reset, dismissRef, disarm };
}

export function usePersonFieldRowConfirmSkip() {
  const [confirmSkip, setConfirmSkip] = useState(false);
  const closeConfirmSkip = useCallback(() => setConfirmSkip(false), []);
  const confirmSkipRef = useDismissible<HTMLDivElement>({
    active: confirmSkip,
    onDismiss: closeConfirmSkip,
    timeoutMs: 5000,
  });

  return { confirmSkip, setConfirmSkip, confirmSkipRef };
}

export function usePersonFieldRowEditHandlers(
  value: number | null,
  draft: string,
  phase: Phase,
  onEditTime: PersonFieldRowProps["onEditTime"],
  setDraft: (value: string) => void,
  setInvalid: (value: boolean) => void,
  setEditing: (value: boolean) => void,
  setShowActions: (value: boolean) => void,
) {
  function commitEdit() {
    if (value === null) return;
    const next = fromTimeInput(draft, value);
    if (next === null) {
      setInvalid(true);
      return;
    }
    onEditTime?.(phase, next);
    setEditing(false);
    setShowActions(false);
  }

  function startEdit() {
    setDraft(toTimeInput(value as number));
    setInvalid(false);
    setEditing(true);
  }

  return { commitEdit, startEdit };
}
