import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { searchProducts } from "@/lib/data/products";
import type { ProductQuery } from "@/lib/types/product";
import { parseProductQuery } from "@/lib/utils/product-query";
import { CategoryChooser } from "./_components/category-chooser";
import { ProductActiveFilters } from "./_components/product-active-filters";
import { ProductGrid } from "./_components/product-grid";
import { ProductListingToolbar } from "./_components/product-listing-toolbar";
import { ProductPagination } from "./_components/product-pagination";

/** Konvensi Next.js 16: `searchParams` dialirkan sebagai `Promise`. */
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface ProductsPageProps {
  searchParams: SearchParams;
}

/**
 * Ambil string `q` yang sudah ter-trim dari `searchParams`. Helper kecil
 * supaya logika "kapan masuk mode pencarian" tertulis sekali dan dipakai
 * konsisten oleh `generateMetadata` maupun komponen halaman.
 */
function pickSearchTerm(
  sp: Record<string, string | string[] | undefined>,
): string | undefined {
  const raw = sp.q;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Metadata `/products`.
 *
 * Dua varian sesuai REQ-6.1 (chooser) & REQ-6.6 / REQ-12.2 (`q` tetap
 * routable sebagai pencarian global, **tidak** di-redirect ke route
 * kategori):
 *
 * - **Mode pencarian** (`q` ada): title `Pencarian "{q}" — Produk` dan
 *   `robots: noindex` — hasil pencarian per query bersifat ephemeral &
 *   share-able tapi tidak SEO-relevan.
 * - **Mode chooser** (`q` kosong/absen): title "Kategori Produk",
 *   indexable — halaman ini adalah entry point kanonis ke alur browse
 *   per kategori (Akun · Topup · Voucher).
 */
export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const term = pickSearchTerm(sp);

  if (term) {
    return {
      title: `Pencarian "${term}" — Produk`,
      description: `Hasil pencarian global untuk "${term}" di seluruh kategori marketplace.`,
      robots: { index: false, follow: true },
    };
  }

  return {
    title: "Kategori Produk",
    description:
      "Pilih kategori untuk mulai menjelajah marketplace: akun premium, top up resmi, atau voucher digital.",
    robots: { index: true, follow: true },
  };
}

/**
 * Halaman `/products` — perannya **berubah** dari listing flat menjadi
 * dual-mode page (REQ-12.4 — diubah, bukan dihapus):
 *
 * 1. **Mode chooser** (default, `q` kosong/absen) — REQ-6.1:
 *    Render `<CategoryChooser />` dengan intro section. Tidak ada filter,
 *    sort, atau listing produk. Listing flat lama sudah dimigrasikan ke
 *    `Game_Detail_Page` Akun (`/products/account/[gameSlug]`) dan
 *    `Platform_Detail_Page` (`/products/voucher/[platformSlug]`); kedua
 *    route tersebut yang sekarang memakai `searchProducts` /
 *    `getVouchersByPlatform` untuk filter & pagination per entitas.
 *
 * 2. **Mode pencarian global** (`q` non-empty string) — REQ-6.6 / REQ-12.2:
 *    `/products?q=keyword` **tidak** di-redirect ke route kategori. Halaman
 *    me-render hasil pencarian lintas kategori dengan toolbar (search +
 *    sort), active filters (chip `q`), grid produk, dan pagination.
 *    Filter sidebar/drawer sengaja **tidak** dipakai — kategorisasi dan
 *    pemilihan game/platform sudah dipindahkan ke chooser + route turunan,
 *    bukan dimasukkan kembali sebagai sidebar di sini. `category` & `games`
 *    di-strip dari query supaya chip "Kategori" / "Game" tidak muncul
 *    sesuai instruksi task 12.3.
 *
 * Konvensi Next 16: `searchParams` adalah `Promise` yang harus di-`await`
 * sebelum dibaca (REQ-6.2).
 */
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const sp = await searchParams;
  const term = pickSearchTerm(sp);

  if (term) {
    return <SearchView searchParams={sp} term={term} />;
  }

  return <ChooserView />;
}

/**
 * Tampilan mode chooser. Server Component statis: hanya 1 header + 3 link
 * kategori. Tidak ada `searchParams`, tidak ada data fetching.
 */
function ChooserView() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Marketplace
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Kategori Produk
        </h1>
        <p className="max-w-2xl text-sm text-fg-muted sm:text-base">
          Pilih kategori untuk mulai menjelajah marketplace.
        </p>
      </header>

      <CategoryChooser />
    </div>
  );
}

interface SearchViewProps {
  searchParams: Record<string, string | string[] | undefined>;
  term: string;
}

/**
 * Tampilan mode pencarian global. Reuse `searchProducts` dari data layer
 * existing dengan `category` & `games` distrip — pencarian ini bersifat
 * lintas kategori (tidak terkurung sebuah route turunan).
 */
async function SearchView({ searchParams, term }: SearchViewProps) {
  const baseQuery = parseProductQuery(searchParams);
  // Strip kategorisasi: chooser & route turunan yang punya tanggung jawab
  // memfilter per kategori/entitas. Pencarian global hanya menerima `q`,
  // `sort`, `min/max`, dan pagination dari URL — sisanya dipaksa kosong
  // supaya chip "Kategori" / "Game" tidak muncul di toolbar (task 12.3).
  const query: ProductQuery = {
    ...baseQuery,
    games: [],
    category: undefined,
  };

  const result = await searchProducts(query);

  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Pencarian
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Hasil pencarian: &ldquo;{term}&rdquo;
        </h1>
        <p className="max-w-2xl text-sm text-fg-muted sm:text-base">
          Pencarian lintas kategori. Tidak menemukan yang dicari? Kosongkan
          kotak pencarian untuk kembali ke pemilihan kategori.
        </p>
      </header>

      <ProductListingToolbar query={query} total={result.total} />

      <ProductActiveFilters query={query} className="mt-4" />

      <section
        aria-label={`Hasil pencarian untuk "${term}"`}
        aria-busy={false}
        className="mt-6 sm:mt-8"
      >
        {result.items.length === 0 ? (
          <SearchEmptyState term={term} />
        ) : (
          <>
            <ProductGrid items={result.items} />
            <ProductPagination
              query={query}
              page={result.page}
              totalPages={result.totalPages}
              className="mt-8 sm:mt-10"
            />
          </>
        )}
      </section>
    </div>
  );
}

/**
 * Empty state khusus mode pencarian: copy yang spesifik query, dengan dua
 * CTA — kembali ke chooser kategori, atau coba kata kunci lain (cukup
 * arahkan user ke chooser; search input sudah memberi affordance untuk
 * mengetik ulang).
 */
function SearchEmptyState({ term }: { term: string }) {
  return (
    <div
      role="status"
      className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-16 text-center"
    >
      <div className="mx-auto max-w-md space-y-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
          Tidak ada produk yang cocok untuk &ldquo;{term}&rdquo;
        </h2>
        <p className="text-sm text-fg-muted">
          Coba kata kunci yang lebih umum, atau jelajahi langsung lewat
          kategori.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button asChild variant="primary" size="md">
            <Link href="/products">Lihat semua kategori</Link>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
