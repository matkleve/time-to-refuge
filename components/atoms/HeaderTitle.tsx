import { cn } from "@/lib/utils";

/** Centered in-app heading — mobile always; desktop for Home / Dana. */
export function HeaderTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "min-w-0 truncate text-center font-display text-base font-semibold text-ink",
        className,
      )}
    >
      {title}
    </h1>
  );
}
