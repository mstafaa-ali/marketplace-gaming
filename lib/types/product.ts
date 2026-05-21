export type ProductCategory = "account" | "topup" | "voucher";
export type StockStatus = "ready" | "sold_out";

export interface PriceInfo {
  currency: "IDR";
  amount: number;
  originalAmount?: number;
  discountPercent?: number;
}

export interface MediaItem {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: ProductCategory;
  /**
   * Slug `Game` pemilik produk (Mobile Legends, Valorant, dst.). Lihat
   * `lib/types/game.ts` dan `feature-guideline.md` §7.
   *
   * Kontrak hard-rule (REQ-5.2):
   * - WAJIB diisi saat `category === "account" | "topup"` (akun & topup
   *   dikelompokkan per `Game`).
   * - HARUS kosong (undefined) saat `category === "voucher"` — voucher
   *   dikelompokkan per `Platform`, bukan `Game`.
   * - Validasi diberlakukan di **runtime data layer**, bukan type system.
   *   `lib/utils/categorization.ts` `groupGamesByCategory` & helper
   *   `getAccountsByGame` / `getTopupsByGame` mengabaikan/melempar
   *   `Error` saat asumsi ini dilanggar.
   */
  gameSlug?: string;
  /**
   * Nama display `Game` pemilik produk. Mengikuti aturan keberadaan yang
   * sama dengan `gameSlug` (lihat di atas) — diisi untuk `account`/`topup`,
   * kosong untuk `voucher`.
   */
  gameName?: string;
  coverImage: MediaItem;
  media: MediaItem[];
  price: PriceInfo;
  stockStatus: StockStatus;
  highlights: string[];
  specs: Record<string, string>;
  rating?: { average: number; count: number };
  createdAt: string;
  /**
   * Tag filter spesifik game. Key = filter key (mis. `"rank"`, `"ar"`,
   * `"skin"`), value = array value yang cocok (mis. `["immortal"]`,
   * `["reaver", "glitchpop"]`). Dipakai untuk filtering di
   * `Game_Detail_Page` Akun berdasarkan definisi di `lib/data/game-filters.ts`.
   *
   * Hanya relevan untuk `category === "account"`. Produk topup/voucher
   * tidak memiliki field ini.
   */
  filterTags?: Record<string, string[]>;
  /**
   * Slug `Platform` tujuan voucher (Steam, Google Play, dst.). Lihat
   * `lib/types/platform.ts` dan `feature-guideline.md` §7.
   *
   * Kontrak hard-rule (REQ-5.2):
   * - WAJIB diisi saat `category === "voucher"`.
   * - HARUS kosong (undefined) saat `category === "account" | "topup"` —
   *   produk akun & topup dikelompokkan per `Game`, bukan `Platform`.
   * - Validasi diberlakukan di **runtime data layer**, bukan type system.
   *   `lib/utils/categorization.ts` `groupPlatformsForVouchers` dan
   *   `lib/data/platforms.ts` `getVouchersByPlatform` MELEMPAR `Error`
   *   deskriptif saat menemukan voucher tanpa `platformSlug`.
   * - **Tidak ada periode tenggang migrasi**: mock data voucher dimigrasi
   *   sekaligus pada Fase A (lihat `lib/data/mock-products.ts`).
   */
  platformSlug?: string;
}

export interface ProductQuery {
  q?: string;
  games: string[];
  category?: ProductCategory;
  sort: "price_asc" | "price_desc" | "newest";
  min?: number;
  max?: number;
  page: number;
  perPage: number;
  /**
   * Filter spesifik game. Key = filter key (mis. `"rank"`, `"ar"`),
   * value = array value yang dipilih user. Dipakai di `Game_Detail_Page`
   * Akun untuk memfilter produk berdasarkan `Product.filterTags`.
   */
  filterTags?: Record<string, string[]>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
