import { RotateCcw, Trash2 } from "lucide-react";
import type { GlassMenuItem } from "@/components/atoms/GlassMenu";

interface PersonCardDangerMenuProps {
  anyFilled: boolean;
  onResetAll?: () => void;
  resetAllArmed: boolean;
  onResetAllTrigger: () => void;
  onDelete?: () => void;
  removeArmed: boolean;
  onRemoveTrigger: () => void;
}

export function buildPersonCardDangerMenuItems({
  anyFilled,
  onResetAll,
  resetAllArmed,
  onResetAllTrigger,
  onDelete,
  removeArmed,
  onRemoveTrigger,
}: PersonCardDangerMenuProps): GlassMenuItem[] {
  const items: GlassMenuItem[] = [];

  if (onResetAll) {
    items.push({
      id: "reset",
      label: resetAllArmed ? "Confirm reset all" : "Reset all",
      icon: RotateCcw,
      tone: "danger",
      selected: resetAllArmed,
      disabled: !anyFilled,
      keepOpen: !resetAllArmed,
      onSelect: () => onResetAllTrigger(),
    });
  }
  if (onDelete) {
    items.push({
      id: "delete",
      label: removeArmed ? "Confirm delete" : "Delete person",
      icon: Trash2,
      tone: "danger",
      selected: removeArmed,
      keepOpen: !removeArmed,
      onSelect: () => onRemoveTrigger(),
    });
  }

  return items;
}
