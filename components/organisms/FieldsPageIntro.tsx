"use client";

import { useMemo } from "react";
import { ArmedActionButton } from "@/components/atoms/ArmedActionButton";
import type { useArmedAction } from "@/lib/use-armed-action";
import { useRegisterHeaderActions } from "@/components/timekeeper/header-actions-context";

function FieldsResetButton({
  atDefault,
  armed,
  onTrigger,
}: {
  atDefault: boolean;
  armed: boolean;
  onTrigger: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <ArmedActionButton
      armed={armed}
      disabled={atDefault}
      idleLabel="Reset fields to defaults"
      armedLabel="Confirm reset fields to defaults"
      showLabel="Reset"
      onTrigger={onTrigger}
    />
  );
}

export function FieldsPageIntro({
  atDefault,
  resetAll,
}: {
  atDefault: boolean;
  resetAll: ReturnType<typeof useArmedAction>;
}) {
  const { armed, trigger } = resetAll;

  const headerActions = useMemo(
    () => (
      <FieldsResetButton atDefault={atDefault} armed={armed} onTrigger={trigger} />
    ),
    [armed, atDefault, trigger],
  );

  useRegisterHeaderActions(headerActions);

  return null;
}
