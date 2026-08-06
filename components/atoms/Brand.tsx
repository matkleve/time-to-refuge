import { interactiveFeedbackClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";

/** Header home — ⏱️ with optional "Timekeeper" wordmark (desktop toolbar). */
export function Brand({
  onHome,
  wordmark = false,
  className,
}: {
  onHome?: () => void;
  wordmark?: boolean;
  className?: string;
}) {
  const classes = cn(
    "flex w-max items-center gap-2 rounded-lg",
    onHome && "cursor-pointer text-left",
    onHome && interactiveFeedbackClass({ press: "sm" }),
    className,
  );

  const content = (
    <>
      <span
        className={cn("shrink-0 leading-none", wordmark ? "text-2xl" : "text-lg")}
        aria-hidden
      >
        ⏱️
      </span>
      {wordmark ? (
        <span className="shrink-0 whitespace-nowrap font-display text-lg font-bold leading-none text-ink xl:text-2xl">
          Timekeeper
        </span>
      ) : null}
    </>
  );

  if (onHome) {
    return (
      <button type="button" onClick={onHome} aria-label="Timekeeper — open Home" className={classes}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
