import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_STATE, normalizeState } from "../domain/rockSimulator";
import type { RockAppState } from "../types";

const STORAGE_KEY = "rock-simulator-state";

function loadBrowserState(): RockAppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normalizeState(raw ? (JSON.parse(raw) as Partial<RockAppState>) : DEFAULT_STATE);
  } catch {
    return DEFAULT_STATE;
  }
}

export function useRockState() {
  const [state, setState] = useState<RockAppState>(() => normalizeState(DEFAULT_STATE));
  const isDesktop = typeof window !== "undefined" && Boolean(window.rockDesktop);

  useEffect(() => {
    let disposed = false;
    if (window.rockDesktop) {
      void window.rockDesktop.loadState().then((loaded) => {
        if (!disposed) setState(normalizeState(loaded));
      });
      const cleanup = window.rockDesktop.onState((next) => {
        setState(normalizeState(next));
      });
      return () => {
        disposed = true;
        cleanup();
      };
    }
    setState(loadBrowserState());
    return () => {
      disposed = true;
    };
  }, []);

  const patchState = useCallback((patch: Partial<RockAppState>) => {
    setState((current) => {
      const next = normalizeState({ ...current, ...patch });
      if (window.rockDesktop) {
        void window.rockDesktop.updateState(patch);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  return useMemo(() => ({ state, patchState, isDesktop }), [isDesktop, patchState, state]);
}
