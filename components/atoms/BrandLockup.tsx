import { cn } from "@/lib/utils";
import { interactiveFeedbackClass } from "@/lib/interactive-glass";

/**
 * Header brand: time emoji + Timekeeper wordmark.
 * Optional `onHome` returns to the Home landing page.
 */
export function BrandLockup({
  titleSize = "lg",
  onHome,
  className,
}: {
  /** `lg` mobile toolbar · `2xl` desktop toolbar. */
  titleSize?: "lg" | "2xl";
  /** Opens Home (landing). */
  onHome?: () => void;
  className?: string;
}) {
  const label = (
    <>
      <span
        className={cn(
          "shrink-0 leading-none",
          titleSize === "2xl" ? "text-2xl" : "text-lg",
        )}
        aria-hidden
      >
        ⏱️
      </span>      <span
        className={cn(
          "truncate font-display font-bold leading-none text-ink",
          titleSize === "2xl" ? "text-lg xl:text-2xl" : "text-lg",
        )}
      >
        Timekeeper
      </span>
    </>
  );

  if (onHome) {
    return (
      <button
        type="button"
        onClick={onHome}
        aria-label="Timekeeper — open Home"
        className={cn(
          "flex min-w-0 cursor-pointer items-center gap-2 rounded-lg text-left",
          interactiveFeedbackClass({ press: "sm" }),
          className,
        )}
      >
        {label}
      </button>
    );
  }

  return <div className={cn("flex min-w-0 items-center gap-2", className)}>{label}</div>;
}
