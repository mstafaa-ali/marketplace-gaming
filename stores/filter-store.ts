"use client";

import { create } from "zustand";
import type { ProductCategory, ProductQuery } from "@/lib/types/product";

/**
 * Draft shape for the filter form. Mirrors `ProductQuery` but allows a few
 * intermediate states the URL never holds (e.g. partially-typed price input
 * stored as a string for free-form editing).
 */
export interface FilterDraft {
  games: string[];
  category: ProductCategory | undefined;
  /** Raw input strings so the user can clear or partially type a number. */
  minInput: string;
  maxInput: string;
}

interface FilterDraftState extends FilterDraft {
  /** Replace the whole draft (used to sync from the URL on mount). */
  hydrateFrom: (query: ProductQuery) => void;
  toggleGame: (slug: string) => void;
  clearGames: () => void;
  setCategory: (category: ProductCategory | undefined) => void;
  setMinInput: (value: string) => void;
  setMaxInput: (value: string) => void;
  reset: () => void;
}

const EMPTY_DRAFT: FilterDraft = {
  games: [],
  category: undefined,
  minInput: "",
  maxInput: "",
};

function draftFromQuery(query: ProductQuery): FilterDraft {
  return {
    games: [...query.games],
    category: query.category,
    minInput: typeof query.min === "number" ? String(query.min) : "",
    maxInput: typeof query.max === "number" ? String(query.max) : "",
  };
}

/**
 * Ephemeral, **client-only** store. Not persisted — closing the tab or
 * navigating away should reset the draft. The URL is the source of truth
 * for *applied* filters.
 */
export const useFilterDraftStore = create<FilterDraftState>((set) => ({
  ...EMPTY_DRAFT,
  hydrateFrom: (query) => set(draftFromQuery(query)),
  toggleGame: (slug) =>
    set((state) => ({
      games: state.games.includes(slug)
        ? state.games.filter((g) => g !== slug)
        : [...state.games, slug],
    })),
  clearGames: () => set({ games: [] }),
  setCategory: (category) => set({ category }),
  setMinInput: (value) => set({ minInput: value }),
  setMaxInput: (value) => set({ maxInput: value }),
  reset: () => set(EMPTY_DRAFT),
}));

/**
 * Convert a draft back into the override payload for `buildProductsHref`.
 * Centralised so the desktop sidebar and mobile drawer stay in sync.
 */
export function draftToOverride(draft: FilterDraft): {
  games: string[] | null;
  category: ProductCategory | undefined;
  min: number | undefined;
  max: number | undefined;
  resetPage: true;
} {
  const minRaw = draft.minInput.trim();
  const maxRaw = draft.maxInput.trim();
  const min = minRaw === "" ? undefined : Number.parseInt(minRaw, 10);
  const max = maxRaw === "" ? undefined : Number.parseInt(maxRaw, 10);

  return {
    games: draft.games.length > 0 ? draft.games : null,
    category: draft.category,
    min: Number.isFinite(min) ? (min as number) : undefined,
    max: Number.isFinite(max) ? (max as number) : undefined,
    resetPage: true,
  };
}
