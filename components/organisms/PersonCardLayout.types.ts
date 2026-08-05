import { Person, Phase, FieldDef } from "@/lib/types";
import type { PersonCardMenuProps } from "./PersonCardMenu";

export interface PersonCardLayoutProps {
  person: Person;
  fields: FieldDef[];
  target: Phase | null;
  fillHeight: boolean;
  isCurrent: boolean;
  retreatName: string;
  showRetreatCaption: boolean;
  editing: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onCommitName: () => void;
  onCancelEdit: () => void;
  onSelectPerson?: () => void;
  removeArmed: boolean;
  resetAllArmed: boolean;
  shareNote: string | null;
  menuProps: PersonCardMenuProps;
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  onEditTime?: (phase: Phase, at: number) => void;
  onOpenPerson?: () => void;
}
