import type { PersonCardLayoutProps } from "./PersonCardLayout.types";
import { PersonCardFieldsSection } from "./PersonCardFieldsSection";
import { PersonCardHeader } from "./PersonCardHeader";

export function PersonCardLayoutContent(props: PersonCardLayoutProps) {
  return (
    <>
      <PersonCardHeader
        person={props.person}
        fields={props.fields}
        retreatName={props.retreatName}
        showRetreatCaption={props.showRetreatCaption}
        editing={props.editing}
        draft={props.draft}
        onDraftChange={props.onDraftChange}
        onCommitName={props.onCommitName}
        onCancelEdit={props.onCancelEdit}
        onSelectPerson={props.onSelectPerson}
        isCurrent={props.isCurrent}
        removeArmed={props.removeArmed}
        resetAllArmed={props.resetAllArmed}
        shareNote={props.shareNote}
        menuProps={props.menuProps}
      />
      <PersonCardFieldsSection
        person={props.person}
        fields={props.fields}
        target={props.target}
        fillHeight={props.fillHeight}
        onSelectPhase={props.onSelectPhase}
        onClear={props.onClear}
        onEditTime={props.onEditTime}
        onOpenPerson={props.onOpenPerson}
        armedAll={props.resetAllArmed}
      />
    </>
  );
}
