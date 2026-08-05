import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  FILLED,
  filledCardClass,
  glassClass,
} from "@/lib/surfaces";

type GlassMaterial = "glass-panel" | "glass-card" | "glass-card-current";
type FilledMaterial = "filled-card" | "filled-card-current" | "filled-sheet";
export type SurfaceMaterial = GlassMaterial | FilledMaterial;

type SurfaceOwnProps<T extends ElementType> = {
  as?: T;
  /**
   * Material from the design system. Prefer glass over the backdrop photo
   * (shells paint that photo via lib/backdrop.ts). See DESIGN-SYSTEM.md §3.
   */
  material: SurfaceMaterial;
  /** Soft white rim — for floating cloudy panels, not for edge-to-edge bars. */
  rim?: boolean;
  /** No soft-lift shadow — use on cards/rows in scrollports at the gutter edge. */
  flush?: boolean;
  className?: string;
  children?: ReactNode;
};

type SurfaceProps<T extends ElementType> = SurfaceOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof SurfaceOwnProps<T>>;

function materialClass(
  material: SurfaceMaterial,
  rim: boolean,
  flush: boolean,
): string {
  const lift = !flush;
  switch (material) {
    case "glass-panel":
      return glassClass("panel", { rim, lift });
    case "glass-card":
      return glassClass("card", { rim, lift });
    case "glass-card-current":
      return glassClass("cardCurrent", { rim, lift });
    case "filled-card":
      return filledCardClass(false);
    case "filled-card-current":
      return filledCardClass(true);
    case "filled-sheet":
      return FILLED.sheet;
  }
}

/**
 * One element, one material. Prefer this over hand-rolling
 * `bg-white/NN backdrop-blur-…` so opacity and the cloudy recipe stay in
 * `lib/surfaces.ts`.
 */
export function Surface<T extends ElementType = "div">({
  as,
  material,
  rim = false,
  flush = false,
  className,
  children,
  ...rest
}: SurfaceProps<T>) {
  const Comp = as ?? "div";
  return (
    <Comp className={cn(materialClass(material, rim, flush), className)} {...rest}>
      {children}
    </Comp>
  );
}
