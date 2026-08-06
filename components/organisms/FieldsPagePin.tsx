"use client";

import { useMemo } from "react";
import { ArmedActionButton } from "@/components/atoms/ArmedActionButton";
import type { useArmedAction } from "@/lib/use-armed-action";
import { useRegisterHeaderActions } from "@/components/timekeeper/header-actions-context";
import { useMediaQuery } from "@/lib/use-media-query";

function FieldsResetButton({
  atDefault,
  resetAll,
}: {
  atDefault: boolean;
  resetAll: ReturnType<typeof useArmedAction>;
}) {
  return (
    <ArmedActionButton
      armed={resetAll.armed}
      disabled={atDefault}
      idleLabel="Reset fields to defaults"
      armedLabel="Confirm reset fields to Buddha, Dharma, Sangha"
      showLabel="Reset"
      press="md"
      onTrigger={resetAll.trigger}
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const headerActions = useMemo(
    () => <FieldsResetButton atDefault={atDefault} resetAll={resetAll} />,
    [atDefault, resetAll],
  );

  useRegisterHeaderActions(isDesktop ? headerActions : null);

  return (
    <div className="space-y-1 pt-1">
      {!isDesktop ? (
        <div className="flex justify-end">
          <FieldsResetButton atDefault={atDefault} resetAll={resetAll} />
        </div>
      ) : null}
      <p className="text-sm text-muted">
        Choose what you record — rename, reorder, or add your own.
      </p>
    </div>
  );
}
