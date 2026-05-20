import {
  CATEGORY_VALUES,
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE,
  SORT_VALUES,
  type SortValue,
} from "@/lib/constants/products";
import type { ProductCategory, ProductQuery } from "@/lib/types/product";

/**
 * Raw shape of `searchParams` after `await`. Next.js 16 hands us a plain
 * object where each value is `string`, `string[]`, or `undefined` (e.g. when
 * the same key appears multiple times like `?game=valorant&game=ml`).
 */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function pickAll(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  if (Array.isArray(value)) return value.filter((v) => v.length > 0);
  return value.length > 0 ? [value] : [];
}

function toFiniteInt(
  value: string | undefined,
  { min, max }: { min?: number; max?: number } = {},
): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return undefined;
  if (typeof min === "number" && parsed < min) return undefined;
  if (typeof max === "number" && parsed > max) return undefined;
  return parsed;
}

function isCategory(value: string | undefined): value is ProductCategory {
  return (
    value !== undefined &&
    (CATEGORY_VALUES as readonly string[]).includes(value)
  );
}

function isSort(value: string | undefined): value is SortValue {
  return (
    value !== undefined && (SORT_VALUES as readonly string[]).includes(value)
  );
}

/**
 * Convert raw `searchParams` into a strict `ProductQuery`. Unknown values are
 * ignored so the UI cannot crash from a hand-edited URL.
 */
export function parseProductQuery(sp: RawSearchParams): ProductQuery {
  const q = pickFirst(sp.q)?.trim();
  const games = pickAll(sp.game);
  const categoryRaw = pickFirst(sp.category);
  const sortRaw = pickFirst(sp.sort);
  const min = toFiniteInt(pickFirst(sp.min), { min: 0 });
  const max = toFiniteInt(pickFirst(sp.max), { min: 0 });
  const page = toFiniteInt(pickFirst(sp.page), { min: 1 }) ?? 1;
  const perPage =
    toFiniteInt(pickFirst(sp.perPage), { min: 1, max: MAX_PER_PAGE }) ??
    DEFAULT_PER_PAGE;

  return {
    q: q && q.length > 0 ? q : undefined,
    games: Array.from(new Set(games)),
    category: isCategory(categoryRaw) ? categoryRaw : undefined,
    sort: isSort(sortRaw) ? sortRaw : "newest",
    min,
    max:
      typeof min === "number" && typeof max === "number" && max < min
        ? undefined
        : max,
    page,
    perPage,
  };
}

export type ProductQueryOverride = Partial<
  Omit<ProductQuery, "games"> & { games?: string[] | null }
> & {
  /** Set to `true` when changing filters so we always land on page 1. */
  resetPage?: boolean;
};

/**
 * Serialize a `ProductQuery` (with optional overrides) back into a query
 * string. Keys that hold default values are omitted to keep URLs short and
 * shareable. Pass `null` to drop a key explicitly.
 */
export function buildProductQueryString(
  base: ProductQuery,
  override: ProductQueryOverride = {},
): string {
  const next: ProductQuery = {
    ...base,
    ...override,
    games:
      override.games === null
        ? []
        : override.games !== undefined
          ? Array.from(new Set(override.games))
          : base.games,
    page: override.resetPage ? 1 : (override.page ?? base.page),
  };

  const params = new URLSearchParams();

  if (next.q) params.set("q", next.q);
  for (const game of next.games) params.append("game", game);
  if (next.category) params.set("category", next.category);
  if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
  if (typeof next.min === "number") params.set("min", String(next.min));
  if (typeof next.max === "number") params.set("max", String(next.max));
  if (next.page > 1) params.set("page", String(next.page));
  if (next.perPage !== DEFAULT_PER_PAGE)
    params.set("perPage", String(next.perPage));

  return params.toString();
}

/**
 * Convenience: full `/products` URL with merged overrides.
 */
export function buildProductsHref(
  base: ProductQuery,
  override: ProductQueryOverride = {},
): string {
  const qs = buildProductQueryString(base, override);
  return qs ? `/products?${qs}` : "/products";
}
