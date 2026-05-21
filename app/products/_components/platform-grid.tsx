import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlatformCard } from "./platform-card";
import type { Platform } from "@/lib/types/platform";

/**
 * Formatter angka Indonesia (mis. `1.234`) — dipakai sekali pada module scope
 * supaya `Intl.NumberFormat` tidak diinstansiasi ulang per render. Konsisten
 * dengan pola di `game-grid.tsx` dan `app/_components/popular-game-grid.tsx`.
 */
const NUMBER_FORMATTER = new Intl.NumberFormat("id-ID");

export interface PlatformGridProps {
  /** Daftar `Platform` unik (sudah ter-deduplikasi & ter-sort di data layer). */
  platforms: Platform[];
  /**
   * Teks empty state, mis. `"Belum ada voucher tersedia saat ini"`. Ditentukan
   * halaman induk supaya copy-nya bisa konteks-spesifik (REQ-1.5).
   */
  emptyText: string;
}

/**
 * Grid `Platform_Card` untuk `Category_Landing_Page` Voucher
 * (`/products/voucher`).
 *
 * Kontrak (REQ-1.3, REQ-1.5):
 * - **Server Component**: tanpa `"use client"`, tidak ada state lokal.
 * - **Tujuan navigasi** dihitung internal oleh `Platform_Card` ke
 *   `/products/voucher/{platformSlug}`, sehingga grid TIDAK perlu menerima
 *   atau meneruskan prop `href`.
 * - **`countLabel`** di-format di sini sebagai `"${count} voucher"` memakai
 *   `Intl.NumberFormat("id-ID")` agar pemisah ribuan mengikuti locale
 *   (mis. `1.234 voucher`). Pemformatan terpusat di grid menjaga
 *   `Platform_Card` tetap presentational dan tidak melakukan i18n ganda.
 * - **Empty state** muncul hanya saat `platforms.length === 0`; copy-nya
 *   datang dari prop `emptyText` agar halaman induk bisa menyesuaikan
 *   dengan konteks (REQ-1.5). CTA "Kembali ke beranda" konsisten dengan
 *   pola di `game-grid.tsx`.
 *
 * Layout: 2 kolom di mobile, 3 di tablet, 4 di desktop — identik dengan
 * `Game_Grid` agar UX antar `Category_Landing_Page` (Akun, Topup, Voucher)
 * konsisten.
 */
export function PlatformGrid({ platforms, emptyText }: PlatformGridProps) {
  if (platforms.length === 0) {
    return (
      <div
        role="status"
        className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-16 text-center"
      >
        <div className="mx-auto max-w-md space-y-4">
          <p className="text-sm text-fg-muted">{emptyText}</p>
          <Button asChild variant="outline" size="md">
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
    >
      {platforms.map((platform) => {
        const formattedCount = NUMBER_FORMATTER.format(platform.productCount);
        const countLabel = `${formattedCount} voucher`;

        return (
          <li key={platform.slug}>
            <PlatformCard platform={platform} countLabel={countLabel} />
          </li>
        );
      })}
    </ul>
  );
}
