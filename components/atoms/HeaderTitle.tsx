import { cn } from "@/lib/utils";

/** Centered in-app heading — mobile always; desktop for Home / Dana. */
export function HeaderTitle({
  title,
  className,
  as: Tag = "h1",
}: {
  title: string;
  className?: string;
  as?: "h1" | "p";
}) {
  return (
    <Tag
      className={cn(
        "w-full min-w-0 truncate text-center font-display text-lg leading-tight font-semibold text-ink",
        className,
      )}
    >
      {title}
    </Tag>
  );
}
