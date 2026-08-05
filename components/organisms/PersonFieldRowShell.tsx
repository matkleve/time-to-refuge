import { cn } from "@/lib/utils";

interface PersonFieldRowShellProps {
  editing: boolean;
  filled: boolean;
  onClear?: unknown;
  shellClassName: string;
  children: React.ReactNode;
}

export function PersonFieldRowShell({
  editing,
  filled,
  onClear,
  shellClassName,
  children,
}: PersonFieldRowShellProps) {
  if (editing) {
    return <div className={cn("rounded-2xl", shellClassName)}>{children}</div>;
  }

  if (!filled) {
    return <div className="rounded-2xl">{children}</div>;
  }

  if (!onClear) {
    return <div className={cn("rounded-2xl", shellClassName)}>{children}</div>;
  }

  return <div className="rounded-2xl">{children}</div>;
}
