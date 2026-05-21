import "server-only";
import { MOCK_GAMES } from "@/lib/data/mock-games";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";
import type { Game } from "@/lib/types/game";
import { groupGamesByCategory } from "@/lib/utils/categorization";

export async function getPopularGames(): Promise<Game[]> {
  // "use cache"
  // cacheLife("days")
  // cacheTag("games")
  return MOCK_GAMES;
}

/**
 * Lookup `Game` berdasarkan `slug`. Dipakai oleh route dinamis seperti
 * `Game_Detail_Page` Akun (`/products/account/[gameSlug]`) untuk memetakan
 * parameter URL ke entitas `Game` (mengambil `name`, `accent`, dll.).
 *
 * Kontrak (REQ-2.5):
 * - Mengembalikan `null` saat slug tidak ditemukan di catalog. Caller
 *   bertanggung jawab memanggil `notFound()` agar halaman 404 standar
 *   Next.js tampil — bukan men-throw `Error`. Ini membedakan kondisi
 *   "tidak ada di catalog" (404) dari "fetch gagal" (`error.tsx`).
 *
 * Strategi cache (REQ-6.3): direktif `cacheTag("games", "game:${slug}")`
 * disiapkan agar revalidasi per-game dapat ditrigger; siap-aktif begitu
 * `cacheComponents: true` dipasang di `next.config.ts`.
 *
 * @param slug - Slug `Game` target (mis. `"mobile-legends"`).
 * @returns Entitas `Game` saat ditemukan, `null` saat tidak ada di catalog.
 */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  // "use cache"
  // cacheLife("hours")
  // cacheTag("games", `game:${slug}`)
  // ^ Siap-aktif setelah `cacheComponents: true` dipasang di next.config.ts.
  return MOCK_GAMES.find((g) => g.slug === slug) ?? null;
}

/**
 * Mengembalikan daftar `Game` yang memiliki minimal satu `Product` pada
 * kategori `"account"` atau `"topup"`. Dipakai oleh `Category_Landing_Page`
 * Akun (`/products/account`) dan Topup (`/products/topup`).
 *
 * Tipe parameter sengaja dipersempit ke `"account" | "topup"` (bukan
 * `ProductCategory`) karena kategori `voucher` tidak dikelompokkan per
 * `Game` melainkan per `Platform` (lihat `lib/data/platforms.ts` &
 * REQ-5.2). Memanggil dengan `"voucher"` adalah misuse; oleh karena itu
 * compiler menolaknya di compile-time.
 *
 * Strategi cache (REQ-6.3): cached pada granularitas
 * `cacheTag("games", "games:${category}")` agar landing page Akun & Topup
 * di-revalidate independen — direktif siap-aktif di komentar di bawah,
 * akan jalan otomatis begitu `cacheComponents: true` dipasang di
 * `next.config.ts`.
 *
 * Error handling (REQ-9.4): bungkus pemanggilan `groupGamesByCategory`
 * agar kegagalan apa pun (mis. data mock corrupt) muncul sebagai `Error`
 * deskriptif yang ditangkap oleh `error.tsx` segment terdekat.
 *
 * @param category - `"account"` untuk Akun, `"topup"` untuk Topup.
 * @returns `Game[]` unik per `slug`, sudah ter-sort sesuai REQ-1.6
 *   (productCount desc, tie-breaker name asc).
 */
export async function getGamesForCategory(
  category: "account" | "topup",
): Promise<Game[]> {
  // "use cache"
  // cacheLife("hours")
  // cacheTag("games", `games:${category}`)
  // ^ Siap-aktif setelah `cacheComponents: true` dipasang di next.config.ts.
  try {
    const catalog = new Map(MOCK_GAMES.map((g) => [g.slug, g] as const));
    return groupGamesByCategory(MOCK_PRODUCTS, category, catalog);
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(
      `getGamesForCategory("${category}") gagal mengelompokkan Game: ${cause}`,
    );
  }
}
