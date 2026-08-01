"use client";

import { useEffect } from "react";

/**
 * Registers `/sw.js` once on the client so a prior visit can reopen offline
 * (retreat wifi). No-op when service workers are unavailable.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration failed — app still works online */
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
