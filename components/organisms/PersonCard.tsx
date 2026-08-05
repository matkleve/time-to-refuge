"use client";

import { Person, Phase, FieldDef } from "@/lib/types";
import { buildPersonCardLayoutProps } from "./buildPersonCardLayoutProps";
import { PersonCardLayout } from "./PersonCardLayout";
import { usePersonCard } from "./usePersonCard";

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

/** One person card for Refuge and the People list. See design system §3 / §5a / §6. */
export function PersonCard(props: PersonCardProps) {
  const card = usePersonCard({
    person: props.person,
    fields: props.fields,
    onResetAll: props.onResetAll,
    onDelete: props.onDelete,
    onRename: props.onRename,
    retreatName: props.retreatName ?? "",
  });

  return <PersonCardLayout {...buildPersonCardLayoutProps(props, card)} />;
}
