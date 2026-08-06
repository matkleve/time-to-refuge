import { interactiveFeedbackClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";

/**
 * Header home control — clock emoji with optional "Timekeeper" wordmark.
 * Mobile: icon only (`showWordmark={false}`) + centered `HeaderTitle`.
 * Desktop toolbar: full lockup on the left.
 */
export function Brand({
  showWordmark = true,
  onHome,
  size = "lg",
  className,
}: {
  showWordmark?: boolean;
  /** Opens Home (landing). */
  onHome?: () => void;
  /** `lg` mobile toolbar · `2xl` desktop toolbar. */
  size?: "lg" | "2xl";
  className?: string;
}) {
  const emoji = (
    <span
      className={cn(
        "shrink-0 leading-none",
        size === "2xl" ? "text-2xl" : "text-lg",
      )}
      aria-hidden
    >
      ⏱️
    </span>
  );

  const wordmark = showWordmark ? (
    <span
      className={cn(
        "shrink-0 whitespace-nowrap font-display font-bold leading-none text-ink",
        size === "2xl" ? "text-lg xl:text-2xl" : "text-lg",
      )}
    >
      Timekeeper
    </span>
  ) : null;

  const layoutClass = showWordmark ? "gap-2" : undefined;

  if (onHome) {
    return (
      <button
        type="button"
        onClick={onHome}
        aria-label="Timekeeper — open Home"
        className={cn(
          "flex w-max cursor-pointer items-center rounded-lg text-left",
          layoutClass,
          interactiveFeedbackClass({ press: "sm" }),
          className,
        )}
      >
        {emoji}
        {wordmark}
      </button>
    );
  }

  return (
    <div className={cn("flex w-max items-center", layoutClass, className)}>
      {emoji}
      {wordmark}
    </div>
  );
}
