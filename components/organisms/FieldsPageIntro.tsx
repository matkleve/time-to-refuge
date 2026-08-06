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
      armedLabel="Confirm reset fields to Buddha, Dharma, Sangha"
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

  return (
    <div className="space-y-1 pt-1">
      <p className="text-sm text-muted">
        Choose what you record — rename, reorder, or add your own.
      </p>
    </div>
  );
}
