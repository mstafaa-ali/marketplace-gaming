import type { ProductCategory } from "@/lib/types/product";

/**
 * Default page size for the `/products` listing. Kept as a single source of
 * truth so URL builders, parsers, and the data layer stay in sync.
 */
export const DEFAULT_PER_PAGE = 12;

/** Hard upper bound for `perPage` so a malicious URL cannot dump the catalog. */
export const MAX_PER_PAGE = 48;

export const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const SORT_VALUES: readonly SortValue[] = SORT_OPTIONS.map(
  (option) => option.value,
);

export const CATEGORY_VALUES: readonly ProductCategory[] = [
  "account",
  "topup",
  "voucher",
];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  account: "Akun",
  topup: "Top Up",
  voucher: "Voucher",
};
