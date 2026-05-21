/**
 * Skeleton untuk `Category_Landing_Page` Akun (`/products/account`).
 *
 * Mengekor layout final `app/products/account/page.tsx` (breadcrumb →
 * header eyebrow/h1/subtitle → grid `Game_Card`) supaya transisi
 * Loading → Loaded tidak menggeser konten (REQ-9.1).
 *
 * Grid skeleton mengikuti `GameGrid` persis: `grid-cols-2` di mobile,
 * `sm:grid-cols-3`, `lg:grid-cols-4`. Render 8 kartu — cukup untuk
 * memenuhi area di breakpoint terbesar (4 kolom × 2 baris) tanpa
 * menambah biaya render yang signifikan.
 *
 * Setiap kartu mencerminkan struktur `GameCard`:
 * - panel `aspect-4/3` (placeholder gradient/ikon),
 * - body 2 baris (nama game + count label).
 *
 * Memakai pola `animate-pulse` + `bg-bg-overlay` yang sama dengan
 * `app/products/loading.tsx` dan `app/products/[slug]/loading.tsx`.
 */
export default function AccountLandingLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Breadcrumb skeleton — "Beranda > Akun" (2 segmen). */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3.5 w-14 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-3 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-12 animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Header skeleton: eyebrow + h1 + subtitle. */}
      <div className="mb-6 space-y-2 sm:mb-8">
        <div className="h-3 w-24 animate-pulse rounded bg-bg-overlay" />
        <div className="h-9 w-64 animate-pulse rounded-md bg-bg-overlay sm:h-10" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Grid skeleton: mengikuti class GameGrid persis. */}
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
 * Mirror struktur `GameCard`: panel `aspect-4/3` di atas + 2 baris body
 * (judul + count label) dengan border & background card yang sama.
 */
function GameCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated">
      <div className="aspect-4/3 w-full animate-pulse bg-bg-overlay" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-bg-overlay" />
      </div>
    </div>
  );
}
