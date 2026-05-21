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
  return MOCK_PRODUCTS.filter(
    (p) =>
      (p.category === "account" || p.category === "voucher") &&
      (p.price.discountPercent || p.rating),
  ).slice(0, 6);
}

/**
 * Real-time product detail. Intentionally NOT cached so stock status stays
 * fresh and prevents double-buy on accounts.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

/**
 * Daftar `Akun` (Product `category === "account"`) untuk satu `Game`.
 * Dipakai oleh `Game_Detail_Page` Akun di `/products/account/[gameSlug]`.
 *
 * Sengaja **UNCACHED** (REQ-6.3): stok akun bersifat real-time agar
 * mencegah double-buy — sama dengan kebijakan `getProductBySlug`. Tidak
 * ada direktif `"use cache"` yang siap-aktif di sini.
 *
 * Error handling (REQ-9.4): kegagalan filter dilempar sebagai `Error`
 * deskriptif sehingga ditangkap `error.tsx` segment terdekat. Empty list
 * (`[]`) **bukan** error; UI yang mengurus empty state per REQ-2.6.
 *
 * @param gameSlug - Slug `Game` target. String kosong dianggap misuse dan
 *   dilempar sebagai `Error` agar route handler bisa mengubahnya menjadi
 *   `notFound()` di lapis atas.
 */
export async function getAccountsByGame(gameSlug: string): Promise<Product[]> {
  if (!gameSlug) {
    throw new Error(
      "getAccountsByGame: parameter `gameSlug` tidak boleh string kosong.",
    );
  }
  try {
    return MOCK_PRODUCTS.filter(
      (p) => p.category === "account" && p.gameSlug === gameSlug,
    );
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(
      `getAccountsByGame("${gameSlug}") gagal memfilter Akun: ${cause}`,
    );
  }
}

/**
 * Daftar `Topup_Denomination` (Product `category === "topup"`) untuk satu
 * `Game`. Dipakai oleh `Topup_Picker` di `Checkout_Page` saat
 * `?category=topup&game={slug}` aktif (REQ-4.2).
 *
 * Cached (REQ-6.3): denominasi topup relatif stabil — lebih jarang
 * berubah dibanding akun — sehingga aman di-cache dengan tag
 * `topup:${gameSlug}` agar revalidasi bisa di-trigger per game. Direktif
 * siap-aktif di komentar di bawah; jalan otomatis saat
 * `cacheComponents: true` dipasang di `next.config.ts`.
 *
 * Error handling (REQ-9.4): kegagalan filter dilempar sebagai `Error`
 * deskriptif sehingga ditangkap `error.tsx` segment terdekat. Empty list
 * (`[]`) **bukan** error; UI yang mengurus empty state per REQ-4.8.
 *
 * @param gameSlug - Slug `Game` target. String kosong ditolak dengan
 *   `Error` agar caller (route handler checkout) memilih jalur redirect
 *   ke `/products/topup` per REQ-4.7.
 */
export async function getTopupsByGame(gameSlug: string): Promise<Product[]> {
  // "use cache"
  // cacheLife("hours")
  // cacheTag("products", `topup:${gameSlug}`)
  // ^ Siap-aktif setelah `cacheComponents: true` dipasang di next.config.ts.
  if (!gameSlug) {
    throw new Error(
      "getTopupsByGame: parameter `gameSlug` tidak boleh string kosong.",
    );
  }
  try {
    return MOCK_PRODUCTS.filter(
      (p) => p.category === "topup" && p.gameSlug === gameSlug,
    );
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(
      `getTopupsByGame("${gameSlug}") gagal memfilter Topup: ${cause}`,
    );
  }
}

/**
 * Related products by game slug. Cached, since recommendations are derived
 * data and tolerate brief staleness.
 *
 * Catatan kontrak (REQ-5.2): hanya produk dengan `gameSlug` yang cocok yang
 * direlasikan. Voucher tidak punya `gameSlug` sehingga otomatis ter-skip oleh
 * predicate filter di bawah.
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
        // `gameName` opsional sejak Fase A task 3.3 (voucher tidak punya
        // game). Optional chaining memastikan voucher di-skip pada cabang
        // pencarian per game tanpa melempar error.
        (p.gameName?.toLowerCase().includes(needle) ?? false),
    );
  }

  if (query.games.length > 0) {
    // `query.games` hanya valid untuk produk berbasis `Game` (akun & topup).
    // Voucher tidak punya `gameSlug` sehingga otomatis tersaring keluar di
    // sini — konsisten dengan hard-rule kontrak di REQ-5.2.
    items = items.filter(
      (p) => p.gameSlug !== undefined && query.games.includes(p.gameSlug),
    );
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

  // Game-specific filter tags (mis. rank=immortal, skin=reaver).
  // Setiap key harus match minimal satu value yang dipilih user (OR dalam
  // satu key, AND antar key).
  if (query.filterTags) {
    const entries = Object.entries(query.filterTags).filter(
      ([, values]) => values.length > 0,
    );
    if (entries.length > 0) {
      items = items.filter((p) => {
        if (!p.filterTags) return false;
        return entries.every(([key, values]) => {
          const productValues = p.filterTags?.[key];
          if (!productValues) return false;
          // OR: produk cocok jika punya minimal satu value yang dipilih user
          return values.some((v) => productValues.includes(v));
        });
      });
    }
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
