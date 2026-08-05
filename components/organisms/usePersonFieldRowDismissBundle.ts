import { Phase } from "@/lib/types";
import {
  usePersonFieldRowConfirmSkip,
  usePersonFieldRowDismiss,
} from "./usePersonFieldRowHooks";
import { usePersonFieldRowReset } from "./usePersonFieldRowReset";

export function usePersonFieldRowDismissBundle(
  onClear: ((phase: Phase) => void) | undefined,
  phase: Phase,
  showActions: boolean,
  setShowActions: (value: boolean) => void,
  armedAll: boolean,
  personId: string,
  value: number | null,
  setEditing: (value: boolean) => void,
) {
  const dismiss = usePersonFieldRowDismiss(
    onClear,
    phase,
    showActions,
    setShowActions,
    armedAll,
  );
  const skip = usePersonFieldRowConfirmSkip();

  usePersonFieldRowReset(
    personId,
    value,
    dismiss.armedReset.disarm,
    setShowActions,
    setEditing,
    skip.setConfirmSkip,
  );

  return { dismiss, skip };
}
