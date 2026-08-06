"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
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
    <IconButton
      icon={RotateCcw}
      label={
        resetAll.armed
          ? "Confirm reset fields to Buddha, Dharma, Sangha"
          : "Reset fields to defaults"
      }
      showLabel="Reset"
      glass
      tone="danger"
      size="md"
      press="md"
      disabled={atDefault}
      armed={resetAll.armed}
      onClick={resetAll.trigger}
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
