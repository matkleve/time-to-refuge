import { useState } from "react";

export function usePersonFieldRowLocalState() {
  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState(false);

  return {
    showActions,
    setShowActions,
    editing,
    setEditing,
    draft,
    setDraft,
    invalid,
    setInvalid,
    copied,
    setCopied,
  };
}
