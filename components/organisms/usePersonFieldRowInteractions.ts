import { nextEmptyPhase } from "@/lib/types";
import type { PersonFieldRowProps } from "./PersonFieldRow";
import { derivePersonFieldRowShell } from "./derivePersonFieldRowShell";
import { copyFieldRowTime, createFieldRowClickHandler } from "./personFieldRowActions";
import { usePersonFieldRowEditHandlers } from "./usePersonFieldRowHooks";
import type { usePersonFieldRowLocalState } from "./usePersonFieldRowLocalState";
import { usePersonFieldRowDismissBundle } from "./usePersonFieldRowDismissBundle";

type LocalState = ReturnType<typeof usePersonFieldRowLocalState>;

export function usePersonFieldRowInteractions(
  props: PersonFieldRowProps,
  value: number | null,
  filled: boolean,
  local: LocalState,
) {
  const { person, fields, phase, isTarget, onSelectPhase, onClear, onEditTime, armedAll = false } =
    props;

  const expected = nextEmptyPhase(person, fields);
  const skipsAhead = !filled && expected !== null && expected !== phase;

  const { dismiss, skip } = usePersonFieldRowDismissBundle(
    onClear,
    phase,
    local.showActions,
    local.setShowActions,
    armedAll,
    person.id,
    value,
    local.setEditing,
  );

  const { commitEdit, startEdit } = usePersonFieldRowEditHandlers(
    value,
    local.draft,
    phase,
    onEditTime,
    local.setDraft,
    local.setInvalid,
    local.setEditing,
    local.setShowActions,
  );

  const handleRowClick = createFieldRowClickHandler(
    filled,
    skip.confirmSkip,
    skipsAhead,
    phase,
    onSelectPhase,
    skip.setConfirmSkip,
    local.setShowActions,
    dismiss.armedReset.disarm,
  );

  return {
    confirmSkip: skip.confirmSkip,
    reset: dismiss.reset,
    armedReset: dismiss.armedReset,
    dismissRef: dismiss.dismissRef,
    confirmSkipRef: skip.confirmSkipRef,
    handleRowClick,
    copyTime: () => copyFieldRowTime(value, local.setCopied),
    commitEdit,
    startEdit,
    setConfirmSkip: skip.setConfirmSkip,
    shell: derivePersonFieldRowShell(isTarget, skip.confirmSkip),
  };
}
