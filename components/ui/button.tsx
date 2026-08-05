"use client";

import { Button as RacButton, type ButtonProps } from "react-aria-components";
import { cn } from "@/lib/utils";

/**
 * Engine button for triggers (menu, select, dialog). Product chips use IconButton.
 */
export function UiButton({ className, ...props }: ButtonProps) {
  return (
    <RacButton
      {...props}
      className={(render) =>
        cn(
          "outline-none",
          typeof className === "function" ? className(render) : className,
        )
      }
    />
  );
}
