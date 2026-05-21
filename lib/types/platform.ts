/**
 * Entitas `Platform` — kanal distribusi voucher digital (Steam, Google Play,
 * PlayStation Store, dst.). Digunakan sebagai entitas first-class pada alur
 * two-step browse kategori `voucher` (lihat `feature-guideline.md` §5D).
 *
 * Hubungan dengan `Product`:
 * - `Product.platformSlug` WAJIB diisi saat `Product.category === "voucher"`.
 * - `Platform` TIDAK dipakai oleh kategori `account` / `topup` (gunakan `Game`).
 * - Validasi hard-rule diberlakukan di runtime data layer (REQ-5.2); lihat
 *   `lib/utils/categorization.ts` `groupPlatformsForVouchers` dan
 *   `lib/data/platforms.ts` `getVouchersByPlatform`.
 */
export interface Platform {
  /** Slug stabil (kebab-case), contoh: `"steam"`, `"google-play"`. */
  slug: string;
  /** Nama display, contoh: `"Steam"`, `"Google Play"`. */
  name: string;
  /**
   * Nama ikon Lucide React (PascalCase), contoh: `"Gamepad2"`, `"Smartphone"`.
   * Map ke ikon konkret di `Platform_Card`. Disimpan sebagai string (bukan
   * komponen) agar tipe ini aman untuk Server Component & data layer.
   */
  icon: string;
  /**
   * Tailwind class gradient untuk accent kartu, contoh:
   * `"from-violet-500 to-accent-pink"`. Dipakai langsung oleh `Platform_Card`
   * tanpa transformasi tambahan.
   */
  accent: string;
  /** Optional logo/cover image path (relative to /public). Shown instead of icon when provided. */
  image?: string;
  /**
   * Jumlah voucher tersedia untuk platform ini. **Computed** di data access
   * layer (`getPlatforms()`), bukan field DB / mock statis.
   */
  productCount: number;
}

/**
 * Alias untuk slug Platform — dipakai pada parameter route segment
 * (`[platformSlug]`) dan field `Product.platformSlug` agar konsisten.
 */
export type PlatformSlug = Platform["slug"];
