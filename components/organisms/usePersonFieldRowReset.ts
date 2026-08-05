import { useEffect } from "react";

export function usePersonFieldRowReset(
  personId: string,
  value: number | null,
  disarm: () => void,
  setShowActions: (value: boolean) => void,
  setEditing: (value: boolean) => void,
  setConfirmSkip: (value: boolean) => void,
) {
  useEffect(() => {
    setShowActions(false);
    setEditing(false);
    setConfirmSkip(false);
    disarm();
  }, [personId, value, disarm, setShowActions, setEditing, setConfirmSkip]);
}
