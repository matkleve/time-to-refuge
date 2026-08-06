import type { LucideIcon } from "lucide-react";
import type { ButtonSize } from "@/components/atoms/button-classes";

export type GlassMenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  /** Danger copy / armed destructive. */
  tone?: "neutral" | "danger";
  disabled?: boolean;
  /** Light glass wash — current page, or an armed destructive row. */
  selected?: boolean;
  /** Keep the menu open after this item (e.g. first arm tap). */
  keepOpen?: boolean;
};

export type GlassMenuSection = {
  /** Small tracked caption above the group (e.g. Pages, Actions). */
  title: string;
  items: GlassMenuItem[];
};

/** Icon-only strip at the bottom of a sectioned menu (Undo / Redo). */
export type GlassMenuIconAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  disabled?: boolean;
  /** Keep the menu open (multi-step undo/redo). */
  keepOpen?: boolean;
};

/** Full-width primary CTA in a sectioned menu (e.g. Dana). */
export type GlassMenuPrimaryAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  selected?: boolean;
} & (
  | { href: string; onSelect?: never }
  | { href?: never; onSelect: () => void }
);

export interface GlassMenuProps {
  label: string;
  /** Flat list — person-card ⋯ and other single-group menus. */
  items?: GlassMenuItem[];
  /** Titled groups with a hairline between them (app hamburger). */
  sections?: GlassMenuSection[];
  /** Primary filled button under sections (before icon footer). */
  primaryAction?: GlassMenuPrimaryAction;
  /** Icon-only row under sections, after a hairline. */
  iconActions?: GlassMenuIconAction[];
  /** Trigger icon — hamburger or ⋯. */
  triggerIcon?: LucideIcon;
  /** Trigger chip size — default `md` (same as row actions). */
  size?: ButtonSize;
  align?: "left" | "right";
  className?: string;
}

export type MenuBox = { top: number; left: number; minWidth: number };
