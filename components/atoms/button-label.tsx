import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LabelCollapse, ButtonVariant } from "./button-classes";
import { labelCollapseClasses } from "./button-build";

export function resolveButtonLabelContent({
  variant,
  labelCollapse,
  chipVisible,
  children,
}: {
  variant: ButtonVariant;
  labelCollapse?: LabelCollapse;
  chipVisible: string | null;
  children: ReactNode;
}) {
  const collapseLabel = labelCollapseClasses(labelCollapse);

  if (variant === "quiet" && labelCollapse) {
    return <span className={collapseLabel.label}>{children}</span>;
  }
  if (variant === "primary" || (variant === "glass" && chipVisible)) {
    if (!children) return null;
    return (
      <span
        className={cn(
          variant === "glass" && "max-w-28 truncate text-sm font-medium whitespace-nowrap",
        )}
      >
        {children}
      </span>
    );
  }
  return children;
}
