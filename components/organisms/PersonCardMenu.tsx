import type { GlassMenuItem } from "@/components/atoms/GlassMenu";
import { buildPersonCardBaseMenuItems } from "./PersonCardBaseMenu";
import { buildPersonCardDangerMenuItems } from "./PersonCardDangerMenu";

export interface PersonCardMenuProps {
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

/** Builds ⋯ menu items for a person card. */
export function buildPersonCardMenuItems(props: PersonCardMenuProps): GlassMenuItem[] {
  return [
    ...buildPersonCardBaseMenuItems(props),
    ...buildPersonCardDangerMenuItems(props),
  ];
}
