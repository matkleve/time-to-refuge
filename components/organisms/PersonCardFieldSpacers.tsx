import type { FieldDef } from "@/lib/types";
import { PERSON_CARD_FIELD_GAP } from "@/lib/chrome";
import { controlMinH } from "@/lib/control-size";
import { cn } from "@/lib/utils";

/** Invisible field rows — keeps Add-person shell the same height as PersonCard. */
export function PersonCardFieldSpacers({ fields }: { fields: FieldDef[] }) {
  return (
    <div className={cn("flex flex-col", PERSON_CARD_FIELD_GAP)} aria-hidden>
      {fields.map((field) => (
        <div key={field.id} className={controlMinH.md} />
      ))}
    </div>
  );
}
