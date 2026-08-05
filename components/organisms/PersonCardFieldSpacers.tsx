import type { FieldDef } from "@/lib/types";
import { controlMinH } from "@/lib/control-size";

/** Invisible field rows — keeps Add-person shell the same height as PersonCard. */
export function PersonCardFieldSpacers({ fields }: { fields: FieldDef[] }) {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {fields.map((field) => (
        <div key={field.id} className={controlMinH.md} />
      ))}
    </div>
  );
}
