import "server-only";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";
import type {
  PaginatedResult,
  Product,
  ProductQuery,
} from "@/lib/types/product";

/**
 * Featured products for the landing page. Cached because the curated list
 * changes infrequently — invalidate via `revalidateTag('products:featured')`.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  // "use cache"
  // cacheLife("hours")
  // cacheTag("products", "products:featured")
  // ^ Aktifkan setelah `cacheComponents: true` dipasang di next.config.ts.
  return MOCK_PRODUCTS.filter((p) => p.price.discountPercent || p.rating).slice(
    0,
    6,
  );
}

/**
 * Real-time product detail. Intentionally NOT cached so stock status stays
 * fresh and prevents double-buy on accounts.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

/**
 * Related products by game slug. Cached, since recommendations are derived
 * data and tolerate brief staleness.
 */
export async function getRelatedProducts(
  gameSlug: string,
  excludeId: string,
  limit = 4,
): Promise<Product[]> {
  // "use cache"
  // cacheLife("hours")
  // cacheTag("products", `products:related:${gameSlug}`)
  return MOCK_PRODUCTS.filter(
    (p) => p.gameSlug === gameSlug && p.id !== excludeId,
  ).slice(0, limit);
}

/**
 * Listing search. Pure function over the in-memory mock dataset; once a real
 * backend lands, replace with a DB query.
 */
export async function searchProducts(
  query: ProductQuery,
): Promise<PaginatedResult<Product>> {
  let items = [...MOCK_PRODUCTS];

  if (query.q) {
    const needle = query.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.shortDescription.toLowerCase().includes(needle) ||
        p.gameName.toLowerCase().includes(needle),
    );
  }

  if (query.games.length > 0) {
    items = items.filter((p) => query.games.includes(p.gameSlug));
  }

  if (query.category) {
    items = items.filter((p) => p.category === query.category);
  }

  if (typeof query.min === "number") {
    items = items.filter((p) => p.price.amount >= (query.min as number));
  }
  if (typeof query.max === "number") {
    items = items.filter((p) => p.price.amount <= (query.max as number));
  }

  switch (query.sort) {
    case "price_asc":
      items.sort((a, b) => a.price.amount - b.price.amount);
      break;
    case "price_desc":
      items.sort((a, b) => b.price.amount - a.price.amount);
      break;
    case "newest":
    default:
      items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / query.perPage));
  const page = Math.min(Math.max(1, query.page), totalPages);
  const start = (page - 1) * query.perPage;
  const paged = items.slice(start, start + query.perPage);

  return {
    items: paged,
    total,
    page,
    perPage: query.perPage,
    totalPages,
  };
}
