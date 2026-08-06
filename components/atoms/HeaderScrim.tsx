import {
  HEADER_SCRIM_EXTENDED_HEIGHT,
  HEADER_SCRIM_HEIGHT,
} from "@/lib/chrome";
import { cn } from "@/lib/utils";

/**
 * Single soften band under the brand toolbar. One blur + fade — not a
 * stack of progressive layers. Pointer-events none.
 *
 * `extended` grows the band through the desktop page-title row (nav pages).
 */
export function HeaderScrim({
  className,
  extended = false,
}: {
  className?: string;
  extended?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "header-scrim chrome-scrim",
        extended ? HEADER_SCRIM_EXTENDED_HEIGHT : HEADER_SCRIM_HEIGHT,
        className,
      )}
    />
  );
}
