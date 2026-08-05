import { useEffect, useState } from "react";
import { Person, FieldDef, getTime } from "@/lib/types";
import { sharePerson } from "@/lib/share";
import { useArmedAction } from "@/lib/use-armed-action";

interface UsePersonCardOptions {
  person: Person;
  fields: FieldDef[];
  onResetAll?: () => void;
  onDelete?: () => void;
  onRename?: (name: string) => void;
  retreatName: string;
}

export function usePersonCard({
  person,
  fields,
  onResetAll,
  onDelete,
  onRename,
  retreatName,
}: UsePersonCardOptions) {
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(person.name);

  const anyFilled = fields.some((field) => getTime(person, field.id) !== null);

  const resetAll = useArmedAction(() => onResetAll?.());
  const remove = useArmedAction(() => onDelete?.());

  const { disarm: disarmResetAll } = resetAll;
  const { disarm: disarmRemove } = remove;
  useEffect(() => {
    setEditing(false);
    disarmResetAll();
    disarmRemove();
  }, [person.id, disarmResetAll, disarmRemove]);

  function startEditing() {
    if (!onRename) return;
    setDraft(person.name);
    setEditing(true);
  }

  function commitName() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== person.name) onRename?.(trimmed);
    setEditing(false);
  }

  async function handleShare() {
    const result = await sharePerson(person, fields, retreatName);
    if (result === "downloaded" || result === "unavailable") {
      setShareNote(result === "downloaded" ? "Card image saved" : "Sharing unavailable");
      setTimeout(() => setShareNote(null), 1800);
    }
  }

  return {
    shareNote,
    editing,
    draft,
    anyFilled,
    resetAll,
    remove,
    startEditing,
    commitName,
    handleShare,
    setDraft,
    setEditing,
  };
}
