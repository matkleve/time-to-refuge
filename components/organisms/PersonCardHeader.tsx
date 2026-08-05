import { Person, FieldDef } from "@/lib/types";
import type { PersonCardMenuProps } from "./PersonCardMenu";
import { PersonCardNameRow } from "./PersonCardNameRow";

interface PersonCardHeaderProps {
  person: Person;
  fields: FieldDef[];
  retreatName: string;
  showRetreatCaption: boolean;
  editing: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onCommitName: () => void;
  onCancelEdit: () => void;
  onSelectPerson?: () => void;
  isCurrent: boolean;
  removeArmed: boolean;
  resetAllArmed: boolean;
  shareNote: string | null;
  menuProps: PersonCardMenuProps;
}

export function PersonCardHeader({
  person,
  fields,
  retreatName,
  showRetreatCaption,
  editing,
  draft,
  onDraftChange,
  onCommitName,
  onCancelEdit,
  onSelectPerson,
  isCurrent,
  removeArmed,
  resetAllArmed,
  shareNote,
  menuProps,
}: PersonCardHeaderProps) {
  return (
    <>
      {showRetreatCaption && (
        <p className="shrink-0 truncate px-4 pt-3 text-xs tracking-wide text-ink uppercase">
          {retreatName}
        </p>
      )}
      <div className="shrink-0">
        <PersonCardNameRow
          person={person}
          fields={fields}
          editing={editing}
          draft={draft}
          onDraftChange={onDraftChange}
          onCommitName={onCommitName}
          onCancelEdit={onCancelEdit}
          onSelectPerson={onSelectPerson}
          isCurrent={isCurrent}
          removeArmed={removeArmed}
          resetAllArmed={resetAllArmed}
          showRetreatCaption={showRetreatCaption}
          menuProps={menuProps}
        />
      </div>
      {shareNote && (
        <p className="no-select animate-fade-in-up shrink-0 px-4 pt-1 text-sm text-flagblue-600" role="status">
          {shareNote}
        </p>
      )}
    </>
  );
}
