"use client";

import { Label, Text, type LabelProps, type TextProps } from "react-aria-components";
import { cn } from "@/lib/utils";

export function UiFieldLabel({ className, ...props }: LabelProps) {
  return (
    <Label
      {...props}
      className={cn("pl-1 text-sm font-medium text-muted", className)}
    />
  );
}

export function UiFieldDescription({ className, ...props }: TextProps) {
  return (
    <Text {...props} slot="description" className={cn("text-sm text-muted", className)} />
  );
}
