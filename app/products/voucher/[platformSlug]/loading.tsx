import { DEFAULT_PER_PAGE } from "@/lib/constants/products";

/**
 * Skeleton untuk `Platform_Detail_Page` Voucher
 * (`/products/voucher/[platformSlug]`).
 *
 * Dirender otomatis oleh App Router selama transisi navigasi maupun saat
 * Server Component induk masih menunggu data (REQ-9.1). Strukturnya
 * mengekor layout final `app/products/voucher/[platformSlug]/page.tsx`:
 *
 *   container-page → breadcrumb 3 segmen → header eyebrow/h1/subtitle/total →
 *   toolbar (counter + sort) → grid 12 kartu produk
 *
 * Berbeda dengan `Game_Detail_Page` Akun, layout di sini **single-column**
 * tanpa sidebar filter — sesuai REQ-8.4 yang menghapus filter Game pada
 * route voucher (voucher tidak terikat ke `Game`). Toolbar juga lebih
 * tipis: hanya counter + dropdown sort, tanpa search/drawer filter.
 *
 * Grid mengikuti class `<ProductGrid />` persis
 * (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) supaya
 * transisi skeleton → konten tidak menggeser isi halaman. Pola
 * `animate-pulse` + `bg-bg-overlay` konsisten dengan
 * `/products/loading.tsx` & `/products/voucher/loading.tsx`.
 *
 * Server Component murni (tanpa `"use client"`) — tidak butuh state browser.
 */
export default function VoucherDetailLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Breadcrumb skeleton — "Beranda > Voucher > {Platform}" (3 segmen). */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5">
        <div className="h-4 w-16 animate-pulse rounded bg-bg-overlay" />
        <div className="h-4 w-2 animate-pulse rounded bg-bg-overlay" />
        <div className="h-4 w-16 animate-pulse rounded bg-bg-overlay" />
        <div className="h-4 w-2 animate-pulse rounded bg-bg-overlay" />
        <div className="h-4 w-24 animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Header skeleton: eyebrow + h1 + subtitle + total counter. */}
      <div className="mb-6 space-y-2 sm:mb-8">
        <div className="h-3 w-28 animate-pulse rounded bg-bg-overlay" />
        <div className="h-9 w-64 animate-pulse rounded-md bg-bg-overlay sm:h-10" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-40 animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Toolbar skeleton: counter + sort placeholder, single-row tipis. */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
        <div className="h-4 w-44 animate-pulse rounded bg-bg-overlay" />
        <div className="h-10 w-full animate-pulse rounded-md bg-bg-overlay sm:w-36" />
      </div>

      {/* Grid skeleton — 12 kartu produk, sejajar dengan `<ProductGrid />`. */}
      <ul
        role="list"
        className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6"
      >
        {Array.from({ length: DEFAULT_PER_PAGE }).map((_, idx) => (
          <li key={idx}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Mirror struktur `ProductCard`: panel `aspect-4/3` di atas + body
 * (judul, meta, badges, harga + action) supaya pergeseran konten saat
 * data datang seminimal mungkin.
 */
function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated">
      <div className="aspect-4/3 w-full animate-pulse bg-bg-overlay" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <div className="h-4 w-4/5 animate-pulse rounded bg-bg-overlay" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-bg-overlay" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-16 animate-pulse rounded-full bg-bg-overlay" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-bg-overlay" />
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="h-5 w-24 animate-pulse rounded bg-bg-overlay" />
          <div className="size-8 animate-pulse rounded-full bg-bg-overlay" />
        </div>
      </div>
    </div>
  );
}
