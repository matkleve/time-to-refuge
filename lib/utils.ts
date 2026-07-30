import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely (clsx + tailwind-merge).
 *
 * No custom class groups are registered here on purpose: the design system
 * re-values Tailwind's own scales rather than inventing names like
 * `text-clock`, which tailwind-merge would mistake for a colour utility and
 * silently drop.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
