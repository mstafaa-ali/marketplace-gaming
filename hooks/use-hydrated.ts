"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `true` only after hydration. Useful for rendering UI that depends on
 * client-only state (e.g. localStorage-backed Zustand store, theme) without
 * triggering hydration mismatches. Implemented via `useSyncExternalStore` so
 * it's compatible with the React 19 lint rule against `setState`-in-effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
