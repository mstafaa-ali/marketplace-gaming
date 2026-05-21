import Link from "next/link";
import type { Platform } from "@/lib/types/platform";

/**
 * Formatter angka untuk lokal `id-ID` — dipakai pada total `Voucher`
 * agar konsisten dengan formatting count di komponen listing lain
 * (mis. `ProductListingToolbar`).
 */
const RESULT_FORMATTER = new Intl.NumberFormat("id-ID");

/**
 * Props untuk `PlatformListHeader`.
 *
 * - `platform` — entitas `Platform` yang sedang dilihat (mensuplai `name`
 *   untuk breadcrumb, h1, dan teks subtitle).
 * - `total` — jumlah `Voucher` yang tersedia untuk `Platform` ini. Nilai
 *   ini di-format dengan `Intl.NumberFormat("id-ID")` agar konsisten
 *   dengan tampilan count di tempat lain.
 */
interface PlatformListHeaderProps {
  platform: Platform;
  total: number;
}

/**
 * `PlatformListHeader` — header presentasional untuk `Platform_Detail_Page`
 * (`/products/voucher/[platformSlug]`).
 *
 * Server Component (tidak memerlukan `"use client"`) yang merender:
 * 1. Breadcrumb "Beranda > Voucher > {Platform.name}" (REQ-3.3).
 * 2. Eyebrow "Voucher Digital", h1 berisi `Platform.name`, subtitle
 *    deskriptif, serta total jumlah `Voucher` yang tersedia.
 *
 * Komponen ini sengaja **tidak** mengetahui tentang sort/filter/pagination
 * — pemisahan tanggung jawab agar markup header bisa dipakai ulang di
 * `loading.tsx`/`error.tsx` segment bila dibutuhkan, dan agar `page.tsx`
 * tetap fokus pada orkestrasi data.
 */
export function PlatformListHeader({
  platform,
  total,
}: PlatformListHeaderProps) {
  return (
    <>
      {/* Breadcrumb "Beranda > Voucher > {Platform.name}" (REQ-3.3). */}
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
            <Link
              href="/products/voucher"
              className="transition-colors hover:text-fg focus-visible:text-fg"
            >
              Voucher
            </Link>
          </li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li>
            <span className="font-medium text-fg" aria-current="page">
              {platform.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Header: eyebrow + h1 + subtitle + total count (REQ-3.3). */}
      <header className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Voucher Digital
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {platform.name}
        </h1>
        <p className="max-w-2xl text-sm text-fg-muted sm:text-base">
          Voucher digital untuk {platform.name}. Pengiriman instan via email
          setelah pembayaran terkonfirmasi.
        </p>
        <p className="text-xs text-fg-muted sm:text-sm" aria-live="polite">
          <span className="font-semibold tabular-nums text-fg">
            {RESULT_FORMATTER.format(total)}
          </span>{" "}
          voucher tersedia
        </p>
      </header>
    </>
  );
}
