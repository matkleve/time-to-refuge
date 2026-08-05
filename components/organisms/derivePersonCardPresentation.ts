import type { PersonCardMenuProps } from "./PersonCardMenu";
import { buildPersonCardMenuProps } from "./buildPersonCardMenuProps";

interface PersonCardPresentationInput {
  onOpenPerson?: () => void;
  onSelectPerson?: () => void;
  retreatName: string;
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

export function derivePersonCardPresentation(input: PersonCardPresentationInput) {
  const showRetreatCaption =
    !input.onOpenPerson && !input.onSelectPerson && input.retreatName.trim().length > 0;

  const menuProps: PersonCardMenuProps = buildPersonCardMenuProps({
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
  });

  return { showRetreatCaption, menuProps };
}
