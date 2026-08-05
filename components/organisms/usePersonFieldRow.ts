import { getTime } from "@/lib/types";
import type { PersonFieldRowProps } from "./PersonFieldRow";
import { derivePersonFieldRowShell } from "./derivePersonFieldRowShell";
import { usePersonFieldRowInteractions } from "./usePersonFieldRowInteractions";
import { usePersonFieldRowLocalState } from "./usePersonFieldRowLocalState";

export function usePersonFieldRowState(props: PersonFieldRowProps) {
  const value = getTime(props.person, props.phase);
  const filled = value !== null;
  const local = usePersonFieldRowLocalState();
  const interactions = usePersonFieldRowInteractions(props, value, filled, local);

  return {
    value,
    filled,
    showActions: local.showActions,
    editing: local.editing,
    draft: local.draft,
    invalid: local.invalid,
    copied: local.copied,
    confirmSkip: interactions.confirmSkip,
    reset: interactions.reset,
    armedReset: interactions.armedReset,
    dismissRef: interactions.dismissRef,
    confirmSkipRef: interactions.confirmSkipRef,
    handleRowClick: interactions.handleRowClick,
    copyTime: interactions.copyTime,
    commitEdit: interactions.commitEdit,
    startEdit: interactions.startEdit,
    active: interactions.shell.active,
    targetClass: interactions.shell.targetClass,
    shellClassName: interactions.shell.shellClassName,
    setDraft: local.setDraft,
    setInvalid: local.setInvalid,
    setEditing: local.setEditing,
    setConfirmSkip: interactions.setConfirmSkip,
  };
}
