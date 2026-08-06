"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";

const HeaderActionsContext = createContext<{
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
}>({
  actions: null,
  setActions: () => {},
});

export function HeaderActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ReactNode>(null);
  return (
    <HeaderActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </HeaderActionsContext.Provider>
  );
}

/** Register view-specific actions into the page-title row (desktop `NavPageTitle`, mobile `HeaderTitle`). */
export function useRegisterHeaderActions(actions: ReactNode) {
  const { setActions } = useContext(HeaderActionsContext);
  useEffect(() => {
    setActions(actions);
    return () => setActions(null);
  }, [actions, setActions]);
}

export function useHeaderActionsRegistered(): boolean {
  const { actions } = useContext(HeaderActionsContext);
  return actions != null;
}

export function HeaderActionsSlot({ className }: { className?: string }) {
  const { actions } = useContext(HeaderActionsContext);
  if (!actions) return null;
  return (
    <div
      className={cn("flex shrink-0 items-center", BUTTON_CLUSTER_GAP, className)}
    >
      {actions}
    </div>
  );
}
