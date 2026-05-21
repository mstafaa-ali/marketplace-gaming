/**
 * Skeleton untuk `/products` — meniru tata letak `Category_Chooser`
 * (REQ-9.1).
 *
 * Sejak migrasi listing flat ke route turunan per kategori, halaman
 * `/products` berubah peran menjadi chooser 3 kategori (Akun · Top Up ·
 * Voucher). Skeleton ini mencerminkan layout final `ChooserView` di
 * `app/products/page.tsx` supaya transisi Loading → Loaded tidak
 * menggeser konten:
 *
 *   container-page → header (eyebrow + h1 + subtitle) → grid 3 kartu
 *
 * Grid mengikuti `<CategoryChooser />` persis: `grid-cols-1` di mobile
 * dan `sm:grid-cols-3` di ≥`sm`, dengan `gap-4` / `sm:gap-6` mengikuti
 * rhythm landing existing. Tiap kartu skeleton mencerminkan struktur
 * icon-led `Category_Chooser`: panel gradient `aspect-4/3` di atas
 * (tempat ikon Lucide pada UI final) lalu dua baris teks di body
 * (judul + deskripsi singkat).
 *
 * Pola `animate-pulse` + `bg-bg-overlay` konsisten dengan skeleton
 * route lain (`/products/account/loading.tsx`, `/products/voucher/loading.tsx`).
 *
 * Catatan: halaman ini juga melayani mode pencarian global (`?q=` di
 * URL — REQ-6.6 / REQ-12.2) dengan tata letak yang berbeda
 * (toolbar + grid produk). Karena `loading.tsx` di-share kedua mode,
 * skeleton ini akan tampak sedikit "off" pada loading mode pencarian.
 * Trade-off ini sengaja diterima — task 12.4 secara eksplisit meminta
 * skeleton chooser, dan mode chooser adalah varian default.
 *
 * Server Component murni (tanpa `"use client"`) — tidak ada state browser.
 */
export default function ProductsLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Header skeleton: eyebrow + h1 + subtitle (mirror `ChooserView`). */}
      <div className="mb-6 space-y-2 sm:mb-8">
        <div className="h-3 w-24 animate-pulse rounded bg-bg-overlay" />
        <div className="h-9 w-64 animate-pulse rounded-md bg-bg-overlay sm:h-10 sm:w-80" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Grid skeleton: 3 kartu, mengikuti class `Category_Chooser` persis. */}
      <ul
        role="list"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <li key={idx}>
            <CategoryCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Mirror struktur kartu `Category_Chooser`: panel `aspect-4/3` di atas
 * (placeholder gradient/ikon) + body 2 baris (judul + deskripsi). Border &
 * background card mengikuti `Category_Chooser` agar pergeseran konten
 * saat skeleton di-swap dengan kartu asli seminimal mungkin.
 */
function CategoryCardSkeleton() {
  return (
    <div className="block h-full overflow-hidden rounded-xl border border-border bg-bg-elevated">
      <div className="aspect-4/3 w-full animate-pulse bg-bg-overlay" />
      <div className="space-y-2 p-4 sm:p-5">
        <div className="h-5 w-2/5 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-bg-overlay" />
      </div>
    </div>
  );
}
