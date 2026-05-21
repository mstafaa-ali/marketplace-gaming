"use client";

import { useEffect, useState } from "react";

/**
 * Debounce a fast-changing value (e.g. search input) before propagating it
 * downstream. Returns a stable value that only updates after `delayMs` of
 * inactivity.
 *
 * Safe under React 19's `react-hooks/set-state-in-effect` rule because the
 * effect schedules a `setTimeout`, not a synchronous setState.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
