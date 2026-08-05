import { RotateCcw } from "lucide-react";
import { PageTitle } from "@/components/atoms/PageTitle";
import { IconButton } from "@/components/atoms/IconButton";
import type { useArmedAction } from "@/lib/use-armed-action";

export function FieldsPagePin({
  atDefault,
  resetAll,
}: {
  atDefault: boolean;
  resetAll: ReturnType<typeof useArmedAction>;
}) {
  return (
    <div className="space-y-1">
      <PageTitle
        title="Fields"
        trailing={
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
        }
      />
      <p className="text-sm text-muted">
        Choose what you record — rename, reorder, or add your own.
      </p>
    </div>
  );
}
