"use client";

import {
  Menu as RacMenu,
  MenuItem as RacMenuItem,
  MenuSection as RacMenuSection,
  MenuTrigger,
  Header,
  type MenuItemProps,
  type MenuProps,
  type MenuSectionProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { uiCollectionItemClass } from "./styles";

export { MenuTrigger };

export function UiMenu<T extends object>({
  className,
  ...props
}: MenuProps<T>) {
  return (
    <RacMenu
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

export function UiMenuSection<T extends object>({
  className,
  ...props
}: MenuSectionProps<T>) {
  return (
    <RacMenuSection
      {...props}
      className={cn("outline-none", className)}
    />
  );
}

export function UiMenuSectionHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Header
      className={cn(
        "px-3 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </Header>
  );
}

export type UiMenuItemProps = MenuItemProps & {
  danger?: boolean;
  armed?: boolean;
  withIcon?: boolean;
};

export function UiMenuItem({
  className,
  danger = false,
  armed = false,
  withIcon = true,
  ...props
}: UiMenuItemProps) {
  return (
    <RacMenuItem
      {...props}
      className={(render) =>
        cn(
          uiCollectionItemClass({
            selected: render.isSelected,
            danger,
            armed,
            disabled: render.isDisabled,
            withIcon,
          }),
          typeof className === "function" ? className(render) : className,
        )
      }
    />
  );
}
