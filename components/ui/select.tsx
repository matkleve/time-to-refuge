"use client";

import {
  Select as RacSelect,
  SelectValue,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  type SelectProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { uiCollectionItemClass } from "./styles";

export { RacSelect as UiSelect, SelectValue, ListBox };

export type UiListBoxItemProps = ListBoxItemProps & {
  withIcon?: boolean;
};

export function UiListBoxItem({
  className,
  withIcon = false,
  ...props
}: UiListBoxItemProps) {
  return (
    <ListBoxItem
      {...props}
      className={(render) =>
        cn(
          uiCollectionItemClass({
            selected: render.isSelected,
            disabled: render.isDisabled,
            withIcon,
          }),
          typeof className === "function" ? className(render) : className,
        )
      }
    />
  );
}

export type { SelectProps as UiSelectProps };
