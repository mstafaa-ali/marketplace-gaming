/**
 * Skeleton untuk `Category_Landing_Page` Voucher (`/products/voucher`).
 *
 * Dirender otomatis oleh App Router selama transisi navigasi maupun saat
 * Server Component induk masih menunggu data (REQ-9.1). Struktur skeleton
 * ini meniru tata letak final `app/products/voucher/page.tsx`:
 *
 *   container-page → breadcrumb → eyebrow + judul + deskripsi → grid 8 kartu
 *
 * Pola kartunya mengekor `Platform_Card`
 * (`app/products/_components/platform-card.tsx`) — bukan `Game_Card` —
 * karena landing voucher bersifat icon-led: panel `aspect-square` di atas
 * (tempat ikon Lucide pada UI final) lalu dua baris teks (nama platform +
 * label jumlah voucher) di bawahnya.
 *
 * Layout grid identik dengan `<PlatformGrid />` (2 kolom di mobile,
 * 3 di tablet, 4 di desktop) supaya transisi skeleton → konten tidak
 * menggeser isi halaman. Pola `animate-pulse` + `bg-bg-overlay` konsisten
 * dengan `/products/account/loading.tsx` dan `/products/topup/loading.tsx`.
 *
 * Server Component murni (tanpa `"use client"`) — tidak butuh state browser.
 */
export default function VoucherLandingLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Breadcrumb skeleton — "Beranda > Voucher" (2 segmen). */}
      <div className="mb-6 flex items-center gap-1.5">
        <div className="h-4 w-16 animate-pulse rounded bg-bg-overlay" />
        <div className="h-4 w-2 animate-pulse rounded bg-bg-overlay" />
        <div className="h-4 w-16 animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Header skeleton: eyebrow + h1 + subtitle. */}
      <div className="mb-6 space-y-3 sm:mb-8">
        <div className="h-3 w-24 animate-pulse rounded bg-bg-overlay" />
        <div className="h-9 w-72 animate-pulse rounded-md bg-bg-overlay sm:h-10" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Grid skeleton — 8 kartu, sejajar dengan layout `<PlatformGrid />`. */}
      <ul
        role="list"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <li key={idx}>
            <PlatformCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Versi skeleton dari `Platform_Card`. Mirror struktur icon-led:
 * panel `aspect-square` di atas (tempat ikon Lucide pada UI final) lalu
 * dua baris teks di body (nama platform + label jumlah voucher). Border &
 * background card mengikuti `Platform_Card` agar pergeseran konten saat
 * data datang seminimal mungkin.
 */
function PlatformCardSkeleton() {
  return (
    <div className="block h-full overflow-hidden rounded-xl border border-border bg-bg-elevated">
      <div className="aspect-square w-full animate-pulse bg-bg-overlay" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-bg-overlay" />
      </div>
    </div>
  );
}
