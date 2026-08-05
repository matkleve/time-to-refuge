import type { PersonCardMenuProps } from "./PersonCardMenu";

interface BuildPersonCardMenuPropsInput {
  anyFilled: boolean;
  onRename?: () => void;
  onExport?: () => void;
  onShare: () => void;
  onResetAll?: () => void;
  resetAllArmed: boolean;
  onResetAllTrigger: () => void;
  onDelete?: () => void;
  removeArmed: boolean;
  onRemoveTrigger: () => void;
}

export function buildPersonCardMenuProps(
  input: BuildPersonCardMenuPropsInput,
): PersonCardMenuProps {
  return {
    anyFilled: input.anyFilled,
    onRename: input.onRename,
    onExport: input.onExport,
    onShare: input.onShare,
    onResetAll: input.onResetAll,
    resetAllArmed: input.resetAllArmed,
    onResetAllTrigger: input.onResetAllTrigger,
    onDelete: input.onDelete,
    removeArmed: input.removeArmed,
    onRemoveTrigger: input.onRemoveTrigger,
  };
}
