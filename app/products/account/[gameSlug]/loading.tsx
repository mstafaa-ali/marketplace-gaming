import { DEFAULT_PER_PAGE } from "@/lib/constants/products";

/**
 * Skeleton untuk `Game_Detail_Page` Akun (`/products/account/[gameSlug]`).
 *
 * Dirender otomatis oleh App Router selama transisi navigasi maupun saat
 * Server Component induk masih menunggu `getGameBySlug` + `searchProducts`
 * (REQ-9.1). Struktur skeleton mengekor layout final
 * `app/products/account/[gameSlug]/page.tsx` supaya transisi
 * Loading → Loaded tidak menggeser konten:
 *
 *   container-page → breadcrumb 3-segmen → header (eyebrow + h1 + subtitle +
 *   total) → grid 2-kolom (sidebar filter + main: toolbar + grid produk).
 *
 * Sidebar skeleton mengekor `ProductFilterSidebar` (panel rounded di
 * dalam aside `lg:block`) dengan rangkaian fieldset:
 * - title section,
 * - kategori (5 baris radio: "Semua" + 4 kategori, walau praktiknya 3),
 * - rentang harga (2 input min/max),
 * - tombol Apply + Reset.
 *
 * Main column skeleton mengekor `ProductListingToolbar` lalu
 * `ProductGrid` (12 kartu — selaras dengan `DEFAULT_PER_PAGE` dan
 * breakpoint terbesar 4 kolom × 3 baris).
 *
 * Pola `animate-pulse` + `bg-bg-overlay` konsisten dengan
 * `app/products/loading.tsx` dan loading skeleton lain di route ini.
 *
 * Server Component murni (tanpa `"use client"`) — tidak butuh state browser.
 */
export default function AccountDetailLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Breadcrumb skeleton — "Beranda > Akun > {Game.name}" (3 segmen). */}
      <div className="mb-6 flex items-center gap-1.5">
        <div className="h-3.5 w-14 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-2 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-12 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-2 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-32 animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Header skeleton: eyebrow + h1 + subtitle + total ditemukan. */}
      <div className="mb-6 space-y-2 sm:mb-8">
        <div className="h-3 w-32 animate-pulse rounded bg-bg-overlay" />
        <div className="h-9 w-64 animate-pulse rounded-md bg-bg-overlay sm:h-10" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-bg-overlay" />
        <div className="h-4 w-40 animate-pulse rounded bg-bg-overlay" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <FilterSidebarSkeleton />

        <div className="min-w-0">
          {/* Toolbar skeleton: search + result count + sort. */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
            <div className="h-10 w-full animate-pulse rounded-md bg-bg-overlay sm:max-w-md sm:flex-1" />
            <div className="flex items-center justify-between gap-3 sm:ml-auto">
              <div className="h-4 w-28 animate-pulse rounded bg-bg-overlay" />
              <div className="h-10 w-36 animate-pulse rounded-md bg-bg-overlay" />
            </div>
          </div>

          {/* Grid skeleton: 12 kartu — sejajar dengan ProductGrid. */}
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
      </div>
    </div>
  );
}

/**
 * Skeleton sidebar filter desktop. Mengekor pola `ProductFilterSidebar`
 * (`hidden lg:block` + panel rounded) dengan rangkaian fieldset yang
 * sama dipakai `ProductFilterForm` saat `scope="game-detail"`: judul
 * Filter, fieldset Kategori (radio), Rentang Harga (2 input), dan
 * tombol Apply/Reset.
 */
function FilterSidebarSkeleton() {
  return (
    <aside
      aria-hidden
      className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
    >
      <div className="space-y-6 rounded-xl border border-border bg-bg-elevated p-5">
        {/* Title section: heading + subtitle. */}
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-bg-overlay" />
          <div className="h-3 w-40 animate-pulse rounded bg-bg-overlay" />
        </div>

        {/* Fieldset kategori. */}
        <div className="space-y-3">
          <div className="h-3 w-20 animate-pulse rounded bg-bg-overlay" />
          <div className="space-y-1.5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-9 w-full animate-pulse rounded-md bg-bg-overlay"
              />
            ))}
          </div>
        </div>

        {/* Fieldset rentang harga. */}
        <div className="space-y-3">
          <div className="h-3 w-28 animate-pulse rounded bg-bg-overlay" />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="h-3 w-20 animate-pulse rounded bg-bg-overlay" />
              <div className="h-10 w-full animate-pulse rounded-md bg-bg-overlay" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-24 animate-pulse rounded bg-bg-overlay" />
              <div className="h-10 w-full animate-pulse rounded-md bg-bg-overlay" />
            </div>
          </div>
        </div>

        {/* Tombol Apply + Reset. */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="h-10 flex-1 animate-pulse rounded-md bg-bg-overlay" />
          <div className="h-10 w-20 animate-pulse rounded-md bg-bg-overlay" />
        </div>
      </div>
    </aside>
  );
}

/**
 * Skeleton produk card. Identik dengan pola di
 * `app/products/loading.tsx` agar swap ke `<ProductGrid />` tidak
 * menggeser layout: `aspect-4/3` placeholder + body 4 baris (judul,
 * subtitle, dua chip tag, harga + bookmark).
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
