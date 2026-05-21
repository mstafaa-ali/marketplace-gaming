import "server-only";
import { MOCK_PLATFORMS } from "@/lib/data/mock-platforms";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";
import type { Platform } from "@/lib/types/platform";
import type { Product } from "@/lib/types/product";
import { groupPlatformsForVouchers } from "@/lib/utils/categorization";

/**
 * Daftar `Platform` untuk `Category_Landing_Page` Voucher. Mengelompokkan
 * produk `category === "voucher"` per `platformSlug` dan meng-override
 * `productCount` dengan jumlah voucher aktual.
 *
 * Caching: tagged `platforms` agar bisa di-invalidate via
 * `revalidateTag('platforms')` saat katalog voucher berubah.
 *
 * Kontrak (REQ-5.2 / 5.4 / 9.4):
 * - Mendelegasikan validasi hard-rule ke `groupPlatformsForVouchers`, yang
 *   melempar `Error` deskriptif bila ada voucher tanpa `platformSlug`.
 *   Exception sengaja dibiarkan menjalar ke `error.tsx` segment terdekat.
 */
export async function getPlatforms(): Promise<Platform[]> {
  // "use cache"
  // cacheLife("hours")
  // cacheTag("platforms")
  // ^ Aktifkan setelah `cacheComponents: true` dipasang di next.config.ts.
  const catalog = new Map(MOCK_PLATFORMS.map((p) => [p.slug, p] as const));
  return groupPlatformsForVouchers(MOCK_PRODUCTS, catalog);
}

/**
 * Lookup satu `Platform` berdasarkan `slug`. Dipakai oleh
 * `Platform_Detail_Page` (`/products/voucher/[platformSlug]`) untuk
 * memutuskan `notFound()` saat slug tidak dikenal (REQ-3.5).
 *
 * Caching: di-tag `platforms` + `platform:{slug}` agar bisa diinvalidate
 * granular bersama `getPlatforms()`.
 */
export async function getPlatformBySlug(
  slug: string,
): Promise<Platform | null> {
  // "use cache"
  // cacheLife("hours")
  // cacheTag("platforms", `platform:${slug}`)
  // ^ Aktifkan setelah `cacheComponents: true` dipasang di next.config.ts.
  const platforms = await getPlatforms();
  return platforms.find((p) => p.slug === slug) ?? null;
}

/**
 * Daftar voucher untuk satu `Platform`. Dipakai oleh `Platform_Detail_Page`
 * untuk merender listing produk per platform.
 *
 * Caching: di-tag `voucher` + `voucher:{platformSlug}` agar bisa
 * diinvalidate per-platform saat stok voucher berubah.
 *
 * Kontrak hard-rule (REQ-5.2 / 9.4):
 * - Memeriksa **seluruh** snapshot voucher (bukan hanya yang query-nya
 *   match) dan **melempar `Error`** deskriptif bila ada satu pun voucher
 *   tanpa `platformSlug`. Konsisten dengan `groupPlatformsForVouchers` di
 *   `lib/utils/categorization.ts`; tidak ada periode tenggang migrasi.
 * - Exception dibiarkan menjalar ke `error.tsx` segment terdekat agar
 *   tidak ditelan secara silent.
 */
export async function getVouchersByPlatform(
  platformSlug: string,
): Promise<Product[]> {
  // "use cache"
  // cacheLife("hours")
  // cacheTag("voucher", `voucher:${platformSlug}`)
  // ^ Aktifkan setelah `cacheComponents: true` dipasang di next.config.ts.
  const vouchers = MOCK_PRODUCTS.filter((p) => p.category === "voucher");
  for (const voucher of vouchers) {
    if (!voucher.platformSlug) {
      throw new Error(
        `Voucher tanpa platformSlug terdeteksi (id="${voucher.id}", slug="${voucher.slug}"). ` +
          `Setiap Product dengan category="voucher" wajib memiliki platformSlug — ` +
          `lihat REQ-5.2 di .kiro/specs/product-categorization-update/requirements.md.`,
      );
    }
  }
  return vouchers.filter((v) => v.platformSlug === platformSlug);
}
