"use client";

import type { ReactNode } from "react";
import {
  DialogTrigger,
  Popover as RacPopover,
  type PopoverProps as RacPopoverProps,
} from "react-aria-components";
import { Surface } from "@/components/atoms/Surface";
import { cn } from "@/lib/utils";

export { DialogTrigger };

type GlassPopoverProps = Omit<RacPopoverProps, "className" | "children"> & {
  children: ReactNode;
  /** Glass panel className on the inner Surface. */
  panelClassName?: string;
  className?: RacPopoverProps["className"];
  /** Skip inner Surface — for custom panel chrome (e.g. location check). */
  bare?: boolean;
};

/**
 * Portaled floating panel — positioning, dismiss, and escape via React Aria.
 * Glass skin from `Surface` unless `bare`.
 */
export function GlassPopover({
  children,
  className,
  panelClassName,
  bare = false,
  offset = 6,
  ...props
}: GlassPopoverProps) {
  return (
    <RacPopover
      {...props}
      offset={offset}
      className={(render) =>
        cn(
          "z-50 outline-none",
          typeof className === "function" ? className(render) : className,
          render.isEntering && "animate-scale-in",
        )
      }
    >
      {bare ? (
        children
      ) : (
        <Surface
          material="glass-panel"
          rim
          className={cn(
            "overflow-hidden rounded-2xl p-1.5 shadow-lg",
            panelClassName,
          )}
        >
          {children}
        </Surface>
      )}
    </RacPopover>
  );
}
