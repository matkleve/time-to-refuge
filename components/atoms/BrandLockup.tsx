import { cn } from "@/lib/utils";

/** Triple-jewel mark — Buddha (saffron) · Dharma / Sangha (flag blue). */
function LogoMark({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className="shrink-0"
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" fill="#fff" />
      <path d="M32 4A28 28 0 0 1 56.25 46L32 32Z" fill="#F5A623" />
      <path d="M56.25 46A28 28 0 0 1 7.75 46L32 32Z" fill="#2456C9" />
      <path d="M7.75 46A28 28 0 0 1 32 4L32 32Z" fill="#1A41A3" />
      <circle cx="32" cy="32" r="5.5" fill="#fff" />
      <path
        d="M32 32L32 4M32 32L56.25 46M32 32L7.75 46"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Header brand: triple-jewel mark + Timekeeper name.
 * Title is one step above the prior header size on the type scale.
 */
export function BrandLockup({
  titleSize = "2xl",
  className,
}: {
  /** Mobile 2xl (was lg); desktop 4xl (was 2xl). */
  titleSize?: "2xl" | "4xl";
  className?: string;
}) {
  const mark = titleSize === "4xl" ? 40 : 32;

  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <LogoMark size={mark} />
      <p
        className={cn(
          "truncate font-display font-semibold text-ink",
          titleSize === "4xl" ? "text-4xl" : "text-2xl",
        )}
      >
        Timekeeper
      </p>
    </div>
  );
}
