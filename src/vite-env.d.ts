/// <reference types="vite/client" />

import type { RockAppState } from "./types";

declare global {
  interface Window {
    rockDesktop?: {
      loadState: () => Promise<RockAppState>;
      updateState: (patch: Partial<RockAppState>) => Promise<RockAppState>;
      onState: (callback: (state: RockAppState) => void) => () => void;
      windowControl: (action: "minimize" | "close") => Promise<void>;
    };
  }
}

export {};
