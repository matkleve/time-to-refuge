import { cn } from "@/lib/utils";

/**
 * Header brand — wordmark only for now (mark asset TBD).
 * Hover / press: the type scales up slightly — no wash fill behind the chip.
 * Optional `onHome` returns to the Session page.
 */
export function BrandLockup({
  titleSize = "lg",
  onHome,
  className,
}: {
  /** `lg` mobile toolbar · `2xl` desktop toolbar. */
  titleSize?: "lg" | "2xl";
  /** Opens Session (home). */
  onHome?: () => void;
  className?: string;
}) {
  const title = (
    <span
      className={cn(
        "origin-left truncate font-display font-semibold leading-none text-ink",
        "transition-transform duration-200 ease-out",
        "group-hover:scale-[1.06] group-active:scale-[0.97]",
        titleSize === "2xl" ? "text-2xl" : "text-lg",
      )}
    >
      Timekeeper
    </span>
  );

  if (onHome) {
    return (
      <button
        type="button"
        onClick={onHome}
        aria-label="Timekeeper — open Session"
        className={cn(
          "group flex min-w-0 cursor-pointer items-center rounded-lg text-left",
          className,
        )}
      >
        {title}
      </button>
    );
  }

  return <div className={cn("flex min-w-0 items-center", className)}>{title}</div>;
}
