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

  // Parse game-specific filter tags. Convention: URL params prefixed with
  // `ft_` (e.g. `?ft_rank=immortal&ft_skin=reaver&ft_skin=glitchpop`).
  const filterTags: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(sp)) {
    if (key.startsWith("ft_") && value !== undefined) {
      const filterKey = key.slice(3); // strip "ft_"
      if (filterKey.length > 0) {
        const values = pickAll(value);
        if (values.length > 0) {
          filterTags[filterKey] = values;
        }
      }
    }
  }

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
    filterTags: Object.keys(filterTags).length > 0 ? filterTags : undefined,
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

  // Serialize game-specific filter tags with `ft_` prefix.
  if (next.filterTags) {
    for (const [key, values] of Object.entries(next.filterTags)) {
      for (const value of values) {
        params.append(`ft_${key}`, value);
      }
    }
  }

  return params.toString();
}

/**
 * Convenience: full URL with merged overrides. Defaults ke `/products` agar
 * semua call site existing tetap kompatibel; route turunan
 * (`Game_Detail_Page` Akun di `/products/account/{gameSlug}`,
 * `Platform_Detail_Page` di `/products/voucher/{platformSlug}`) bisa
 * mengirim `basePath`-nya sendiri supaya kontrol sort/pagination tetap
 * berada di route yang sama tanpa lompat balik ke `/products`.
 */
export function buildProductsHref(
  base: ProductQuery,
  override: ProductQueryOverride = {},
  basePath: string = "/products",
): string {
  const qs = buildProductQueryString(base, override);
  return qs ? `${basePath}?${qs}` : basePath;
}
