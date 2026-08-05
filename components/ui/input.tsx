"use client";

import { Input as RacInput, type InputProps } from "react-aria-components";
import { suppressInputOutline } from "@/lib/focus-cues";
import { cn } from "@/lib/utils";

/**
 * Text input primitive — glass/product styling via className.
 * Replaces raw `<input>` outside this module.
 */
export function UiInput({ className, ...props }: InputProps) {
  return (
    <RacInput
      {...props}
      className={(render) =>
        cn(
          suppressInputOutline,
          "outline-none",
          typeof className === "function" ? className(render) : className,
        )
      }
    />
  );
}
