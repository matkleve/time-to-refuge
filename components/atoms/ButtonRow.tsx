import type { ComponentProps } from "react";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";

/**
 * Owns horizontal gap between adjacent buttons/icons in a cluster.
 * Prefer this over repeating `BUTTON_CLUSTER_GAP` on one-off flex rows.
 */
export function ButtonRow({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center", BUTTON_CLUSTER_GAP, className)}
      {...props}
    />
  );
}
