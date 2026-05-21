import type { Game } from "@/lib/types/game";
import type { Platform } from "@/lib/types/platform";
import type { Product, ProductCategory } from "@/lib/types/product";

/**
 * Pembanding standar untuk hasil agregasi entitas pada `Category_Landing_Page`
 * (Akun, Topup, Voucher) — dipakai oleh kedua helper di file ini.
 *
 * Aturan urut (REQ-1.6):
 * 1. `productCount` **descending** — entitas dengan produk terbanyak naik
 *    duluan agar landing page menyorot stok aktif.
 * 2. Tie-breaker: `name` **ascending case-insensitive** menggunakan
 *    `localeCompare("id", { sensitivity: "base" })` supaya urutan abjad
 *    Bahasa Indonesia (mis. huruf beraksen) konsisten lintas runtime.
 *
 * Pure & deterministic: hanya membaca dua field dari argumen.
 */
function compareByCountThenName<
  T extends { productCount: number; name: string },
>(a: T, b: T): number {
  if (b.productCount !== a.productCount) {
    return b.productCount - a.productCount;
  }
  return a.name.localeCompare(b.name, "id", { sensitivity: "base" });
}

/**
 * Mengelompokkan `Product` menjadi daftar `Game` unik untuk satu kategori
 * (`"account"` atau `"topup"`). Dipakai oleh `getGamesForCategory` di
 * `lib/data/games.ts` untuk mengisi `Category_Landing_Page` Akun/Topup.
 *
 * Kontrak (lihat `design.md` § Pure Helpers, REQ-1.6 / 5.4 / 11.1 / 11.2):
 * - **Filter input**: hanya produk yang `category` sama persis dengan
 *   parameter DAN punya `gameSlug` truthy yang ikut diagregasi. Produk di
 *   kategori lain atau tanpa `gameSlug` (mis. voucher migrasi yang
 *   menghapus `gameSlug`, atau bug data) di-skip — bukan error.
 * - **Resolusi catalog**: tiap `gameSlug` di-resolve via
 *   `gameCatalog.get(slug)`. Bila slug punya produk tapi tidak terdaftar
 *   di katalog, entitasnya juga di-skip agar fungsi tetap pure & toleran;
 *   downstream UI yang mengurus pesan "katalog kosong".
 * - **Override `productCount`**: nilai pada `Game` katalog diganti dengan
 *   jumlah produk aktual untuk kategori tsb (bukan total produk game).
 * - **Output**: `Game[]` unik per `slug`, sudah ter-sort sesuai
 *   `compareByCountThenName`.
 * - **Pure & deterministic**: tanpa I/O, tanpa `Date.now`, tanpa `Math.random`.
 *
 * @param products - Snapshot daftar produk lengkap.
 * @param category - Kategori target (`"account"` atau `"topup"`).
 * @param gameCatalog - Lookup `Game` berdasarkan `slug`.
 */
export function groupGamesByCategory(
  products: Product[],
  category: ProductCategory,
  gameCatalog: ReadonlyMap<string, Game>,
): Game[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    if (product.category !== category) continue;
    // Defensive: `gameSlug` saat ini wajib di tipe, tapi migrasi voucher
    // (Fase A task 3.3) bisa membuatnya kosong/undefined. Truthy guard
    // menutup ketiga state (`undefined`, `null`, `""`).
    const slug = product.gameSlug;
    if (!slug) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  const games: Game[] = [];
  for (const [slug, count] of counts) {
    const game = gameCatalog.get(slug);
    if (!game) continue;
    games.push({ ...game, productCount: count });
  }

  return games.sort(compareByCountThenName);
}

/**
 * Mengelompokkan `Product` voucher menjadi daftar `Platform` unik. Dipakai
 * oleh `getPlatforms` di `lib/data/platforms.ts` untuk mengisi
 * `Category_Landing_Page` Voucher.
 *
 * Kontrak (REQ-5.2 / 5.4 / 11.1 / 11.2):
 * - **Filter input**: hanya produk dengan `category === "voucher"` yang
 *   diperiksa.
 * - **Hard rule** (REQ-5.2): bila ada voucher tanpa `platformSlug`
 *   (`undefined`, `null`, atau string kosong), fungsi **melempar `Error`**
 *   deskriptif memuat `id` & `slug` produk pelanggar — tidak ada periode
 *   tenggang migrasi. Validasi sengaja di-runtime karena type system tidak
 *   memodelkan diskriminasi `voucher` vs non-voucher pada `Product`.
 * - **Resolusi catalog**: tiap `platformSlug` di-resolve via
 *   `platformCatalog.get(slug)`. Slug yang punya produk namun tidak ada di
 *   katalog di-skip (konsisten dengan `groupGamesByCategory`).
 * - **Override `productCount`**: nilai pada `Platform` katalog diganti
 *   dengan jumlah voucher aktual.
 * - **Output**: `Platform[]` unik per `slug`, ter-sort sesuai
 *   `compareByCountThenName`.
 * - **Pure & deterministic** (kecuali pada jalur throw, yang tetap
 *   deterministic terhadap input).
 *
 * @param products - Snapshot daftar produk lengkap.
 * @param platformCatalog - Lookup `Platform` berdasarkan `slug`.
 * @throws {Error} Bila ditemukan voucher tanpa `platformSlug`.
 */
export function groupPlatformsForVouchers(
  products: Product[],
  platformCatalog: ReadonlyMap<string, Platform>,
): Platform[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    if (product.category !== "voucher") continue;
    const slug = product.platformSlug;
    if (!slug) {
      throw new Error(
        `Voucher tanpa platformSlug terdeteksi (id="${product.id}", slug="${product.slug}"). ` +
          `Setiap Product dengan category="voucher" wajib memiliki platformSlug — ` +
          `lihat REQ-5.2 di .kiro/specs/product-categorization-update/requirements.md.`,
      );
    }
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  const platforms: Platform[] = [];
  for (const [slug, count] of counts) {
    const platform = platformCatalog.get(slug);
    if (!platform) continue;
    platforms.push({ ...platform, productCount: count });
  }

  return platforms.sort(compareByCountThenName);
}
