import { cn } from "@/lib/utils";

/** Timekeeper mark — lens outline + clock hand (saffron on flag blue). */
function LogoMark({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M8 50 C24 26 76 26 92 50 C76 74 24 74 8 50 Z"
        fill="none"
        stroke="#2A4394"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="17" fill="#2A4394" />
      <path
        d="M50 50 V40 M50 50 L57 55"
        fill="none"
        stroke="#E8A13A"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Header brand: mark + Timekeeper wordmark.
 * No hover scale — that grew into the nav and read as shaky type.
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
  const mark = titleSize === "2xl" ? 32 : 28;

  const label = (
    <>
      <LogoMark size={mark} />
      <span
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
          className,
        )}
      >
        {label}
      </button>
    );
  }

  return <div className={cn("flex min-w-0 items-center gap-2", className)}>{label}</div>;
}
