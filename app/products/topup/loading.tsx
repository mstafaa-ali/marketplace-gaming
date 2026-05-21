/**
 * Skeleton untuk `Category_Landing_Page` Topup (`/products/topup`).
 *
 * Dirender otomatis oleh App Router selama transisi navigasi maupun saat
 * Server Component induk masih menunggu data (REQ-9.1). Struktur skeleton
 * ini meniru tata letak final `app/products/topup/page.tsx`:
 *
 *   container-page → breadcrumb → eyebrow + judul + deskripsi → grid 8 kartu
 *
 * Pola kartunya mengekor `Game_Card` (lihat
 * `app/products/_components/game-card.tsx`): panel `aspect-4/3` di atas
 * untuk gambar/ikon, lalu dua baris teks (nama + jumlah produk) di bawah.
 *
 * Layout grid identik dengan `<GameGrid />` (2 kolom di mobile, 3 di
 * tablet, 4 di desktop) supaya transisi skeleton → konten tidak menggeser
 * isi halaman. Pola yang sama dipakai oleh `/products/account/loading.tsx`.
 */
export default function TopupLandingLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Breadcrumb skeleton (Beranda / Top Up) */}
      <div className="mb-6 flex items-center gap-1.5">
        <div className="h-4 w-16 animate-pulse rounded bg-bg-overlay" />
        <div className="h-4 w-2 animate-pulse rounded bg-bg-overlay" />
        <div className="h-4 w-14 animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Header skeleton (eyebrow, h1, description) */}
      <div className="mb-6 space-y-3 sm:mb-8">
        <div className="h-3 w-24 animate-pulse rounded bg-bg-overlay" />
        <div className="h-9 w-72 animate-pulse rounded-md bg-bg-overlay sm:h-10" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Grid skeleton — 8 kartu, sejajar dengan layout `<GameGrid />`. */}
      <ul
        role="list"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <li key={idx}>
            <GameCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Versi skeleton dari `Game_Card`. Mempertahankan rasio `aspect-4/3` di atas
 * dan tinggi dua baris teks di bawah supaya pergeseran konten saat data
 * datang seminimal mungkin.
 */
function GameCardSkeleton() {
  return (
    <div className="block h-full overflow-hidden rounded-xl border border-border bg-bg-elevated">
      <div className="aspect-4/3 w-full animate-pulse bg-bg-overlay" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-bg-overlay" />
      </div>
    </div>
  );
}
