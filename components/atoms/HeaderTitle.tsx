import { cn } from "@/lib/utils";

/** Centered in-app heading — mobile always; desktop for Home / Dana. */
export function HeaderTitle({
  title,
  subtitle,
  className,
  as: Tag = "h1",
}: {
  title: string;
  subtitle?: string;
  className?: string;
  as?: "h1" | "p";
}) {
  return (
    <div className={cn("min-w-0 max-w-full", className)}>
      <Tag
        className="w-full min-w-0 truncate text-center font-display text-lg leading-tight font-semibold text-ink"
      >
        {title}
      </Tag>
      {subtitle ? (
        <p className="mt-0.5 min-w-0 truncate text-center text-sm text-muted">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
