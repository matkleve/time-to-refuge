import { UiInput } from "@/components/ui";
import { controlMinH } from "@/lib/control-size";
import { cn } from "@/lib/utils";
import { PersonFieldRowLabel } from "./PersonFieldRowLabel";

const ROW_HEIGHT = controlMinH.md;

interface PersonFieldRowEditingProps {
  phaseLabel: string;
  draft: string;
  invalid: boolean;
  onDraftChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}

export function PersonFieldRowEditing({
  phaseLabel,
  draft,
  invalid,
  onDraftChange,
  onCommit,
  onCancel,
}: PersonFieldRowEditingProps) {
  return (
    <div className={cn("flex w-full items-center gap-2 px-4 animate-fade-in-up", ROW_HEIGHT)}>
      <PersonFieldRowLabel
        phaseLabel={phaseLabel}
        resetArmed={false}
        filled={false}
        isTarget={false}
      />
      <UiInput
        /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by an
           explicit user action, so focusing it is the expected behaviour. */
        autoFocus
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit();
          if (e.key === "Escape") onCancel();
        }}
        onBlur={onCommit}
        aria-label={`${phaseLabel} time`}
        aria-invalid={invalid}
        className={cn(
          "ml-auto box-border h-9 w-40 rounded-xl border bg-white px-2 text-right font-mono text-lg tabular-nums leading-none",
          invalid ? "border-danger-500 text-danger-600" : "border-flagblue-500 text-ink",
        )}
      />
    </div>
  );
}
