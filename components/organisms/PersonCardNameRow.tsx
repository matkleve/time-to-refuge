"use client";

import { MoreVertical } from "lucide-react";
import { Person, FieldDef } from "@/lib/types";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { PERSON_CARD_HEADER_INSET } from "@/lib/chrome";
import { cn } from "@/lib/utils";
import { GlassMenu } from "@/components/atoms/GlassMenu";
import type { PersonCardMenuProps } from "./PersonCardMenu";
import { buildPersonCardMenuItems } from "./PersonCardMenu";
import { PersonCardNameDisplay } from "./PersonCardNameDisplay";

interface PersonCardNameRowProps {
  person: Person;
  fields: FieldDef[];
  editing: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onCommitName: () => void;
  onCancelEdit: () => void;
  onSelectPerson?: () => void;
  isCurrent: boolean;
  removeArmed: boolean;
  resetAllArmed: boolean;
  showRetreatCaption: boolean;
  menuProps: PersonCardMenuProps;
}

export function PersonCardNameRow({
  person,
  fields,
  editing,
  draft,
  onDraftChange,
  onCommitName,
  onCancelEdit,
  onSelectPerson,
  isCurrent,
  removeArmed,
  resetAllArmed,
  showRetreatCaption,
  menuProps,
}: PersonCardNameRowProps) {
  const menuItems = buildPersonCardMenuItems(menuProps);
  const dangerTone = removeArmed || resetAllArmed;

  return (
    <div className={cn("flex items-center", PERSON_CARD_HEADER_INSET, BUTTON_CLUSTER_GAP, showRetreatCaption && "pt-1")}>
      {editing ? (
        <input
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- the field only
             appears on an explicit user action, so focusing it is expected. */
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          name="tk-person-name"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onBlur={onCommitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommitName();
            if (e.key === "Escape") onCancelEdit();
          }}
          aria-label="Person's name"
          className="box-border h-10 min-w-0 flex-1 rounded-xl border border-flagblue-500 bg-white px-2 font-display text-2xl font-semibold leading-none text-ink"
        />
      ) : (
        <>
          <PersonCardNameDisplay
            person={person}
            fields={fields}
            onSelectPerson={onSelectPerson}
            isCurrent={isCurrent}
            dangerTone={dangerTone}
          />

          {menuItems.length > 0 && (
            <GlassMenu
              label={`Actions for ${person.name}`}
              triggerIcon={MoreVertical}
              size="md"
              items={menuItems}
            />
          )}
        </>
      )}
    </div>
  );
}
