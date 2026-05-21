import type { Metadata } from "next";
import Link from "next/link";
import { SearchablePlatformGrid } from "../_components/searchable-platform-grid";
import { getPlatforms } from "@/lib/data/platforms";

/**
 * Metadata SEO untuk `Category_Landing_Page` Voucher (REQ-6.1, REQ-6.4).
 *
 * - `title` ringkas — `app/layout.tsx` (template) yang menambahkan suffix brand.
 * - `description` menyebut platform-platform utama agar relevan untuk query
 *   pencarian generik (mis. "voucher steam"); pengiriman instan ditegaskan
 *   sebagai value-prop sesuai `guideline/project-description.md`.
 * - `robots.index = true` karena halaman ini stabil & share-able (bukan
 *   listing flat dengan permutasi filter), sesuai tabel metadata
 *   `design.md` § Metadata per Route.
 */
export const metadata: Metadata = {
  title: "Voucher Digital",
  description:
    "Voucher Steam, Google Play, PlayStation Store, App Store, Xbox. Pengiriman instan via email.",
  robots: { index: true, follow: true },
};

/**
 * `Category_Landing_Page` Voucher — entry point step-1 untuk alur browse
 * voucher (REQ-1.3). Pengguna memilih `Platform` (mis. Steam, Google Play)
 * lebih dulu, baru di-route ke `Platform_Detail_Page`
 * (`/products/voucher/{platformSlug}`) untuk daftar voucher konkret.
 *
 * Server Component murni:
 * - Fetch dilakukan via `getPlatforms()` yang ter-tag `platforms` (siap-aktif
 *   `"use cache"` di `lib/data/platforms.ts`) — caching mengikuti tabel
 *   "Strategi Rendering" di `feature-guideline.md`.
 * - `getPlatforms()` mendelegasikan validasi hard-rule REQ-5.2 ke
 *   `groupPlatformsForVouchers`; bila ada voucher tanpa `platformSlug`,
 *   exception dibiarkan menjalar ke `error.tsx` segment terdekat
 *   (REQ-9.4) — TIDAK ditelan secara silent di sini.
 * - Empty state didelegasikan ke `<PlatformGrid />` dengan copy
 *   konteks-spesifik (REQ-1.5).
 *
 * Layout konsisten dengan `Category_Landing_Page` Akun & Topup
 * (`container-page`, breadcrumb di atas, header + subtitle, lalu grid).
 */
export default async function VoucherLandingPage() {
  const platforms = await getPlatforms();

  return (
    <div className="container-page py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fg-muted">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-fg focus-visible:text-fg"
            >
              Beranda
            </Link>
          </li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li>
            <span className="font-medium text-fg" aria-current="page">
              Voucher
            </span>
          </li>
        </ol>
      </nav>

      <header className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Marketplace
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Voucher Digital
        </h1>
        <p className="max-w-2xl text-sm text-fg-muted sm:text-base">
          Pilih platform tujuan voucher — Steam, Google Play, PlayStation Store,
          App Store, atau Xbox. Pengiriman instan via email setelah pembayaran
          terkonfirmasi.
        </p>
      </header>

      <SearchablePlatformGrid
        platforms={platforms}
        emptyText="Belum ada voucher tersedia saat ini"
      />
    </div>
  );
}
