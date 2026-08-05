import { Person, Phase, FieldDef } from "@/lib/types";
import { derivePersonCardPresentation } from "./derivePersonCardPresentation";
import type { PersonCardLayoutProps } from "./PersonCardLayout.types";
import type { usePersonCard } from "./usePersonCard";

type PersonCardState = ReturnType<typeof usePersonCard>;

interface PersonCardProps {
  person: Person;
  fields: FieldDef[];
  target?: Phase | null;
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  onEditTime?: (phase: Phase, at: number) => void;
  onResetAll?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  onOpenPerson?: () => void;
  onSelectPerson?: () => void;
  onRename?: (name: string) => void;
  isCurrent?: boolean;
  retreatName?: string;
  fillHeight?: boolean;
}

export function buildPersonCardLayoutProps(
  props: PersonCardProps,
  card: PersonCardState,
): PersonCardLayoutProps {
  const {
    person,
    fields,
    target = null,
    onSelectPhase,
    onClear,
    onEditTime,
    onResetAll,
    onDelete,
    onExport,
    onOpenPerson,
    onSelectPerson,
    onRename,
    isCurrent = false,
    retreatName = "",
    fillHeight = false,
  } = props;

  const { showRetreatCaption, menuProps } = derivePersonCardPresentation({
    onOpenPerson,
    onSelectPerson,
    retreatName,
    anyFilled: card.anyFilled,
    onRename: onRename ? card.startEditing : undefined,
    onExport,
    onShare: card.handleShare,
    onResetAll,
    resetAllArmed: card.resetAll.armed,
    onResetAllTrigger: card.resetAll.trigger,
    onDelete,
    removeArmed: card.remove.armed,
    onRemoveTrigger: card.remove.trigger,
  });

  return {
    person,
    fields,
    target,
    fillHeight,
    isCurrent,
    retreatName,
    showRetreatCaption,
    editing: card.editing,
    draft: card.draft,
    onDraftChange: card.setDraft,
    onCommitName: card.commitName,
    onCancelEdit: () => card.setEditing(false),
    onSelectPerson,
    removeArmed: card.remove.armed,
    resetAllArmed: card.resetAll.armed,
    shareNote: card.shareNote,
    menuProps,
    onSelectPhase,
    onClear,
    onEditTime,
    onOpenPerson,
  };
}
