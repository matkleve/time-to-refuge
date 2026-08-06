"use client";

import { useEffect } from "react";
import type { AppView } from "@/components/atoms/ViewMenu";
import { getDocumentTitle } from "@/lib/view-titles";

/** Keep the browser tab title in sync with the active in-app view. */
export function useDocumentTitle(view: AppView) {
  useEffect(() => {
    document.title = getDocumentTitle(view);
  }, [view]);
}
