import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getGameBySlug } from "@/lib/data/games";
import { getGameFilters } from "@/lib/data/game-filters";
import { searchProducts } from "@/lib/data/products";
import { parseProductQuery } from "@/lib/utils/product-query";
import { ProductActiveFilters } from "../../_components/product-active-filters";
import { ProductFilterDrawer } from "../../_components/product-filter-drawer";
import { ProductFilterSidebar } from "../../_components/product-filter-sidebar";
import { ProductGrid } from "../../_components/product-grid";
import { ProductListingToolbar } from "../../_components/product-listing-toolbar";
import { ProductPagination } from "../../_components/product-pagination";
import { AccountListHeader } from "./_components/account-list-header";

/** Konvensi Next.js 16: `params` dan `searchParams` adalah `Promise`. */
type Params = Promise<{ gameSlug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface AccountDetailPageProps {
  params: Params;
  searchParams: SearchParams;
}

/**
 * Metadata `Game_Detail_Page` Akun.
 *
 * - Async karena `params` Next 16 berbentuk `Promise` dan harus di-`await`
 *   sebelum dipakai (REQ-6.2).
 * - Title mengikuti tabel metadata di `design.md`: `${Game.name} — Akun`
 *   (REQ-6.4).
 * - **Indexable** secara default — listing per-game punya nilai SEO yang
 *   jelas (mis. "akun mobile legends").
 * - Saat `gameSlug` tidak ada di catalog, kembalikan metadata fallback yang
 *   tidak ter-index supaya halaman 404 (yang dipicu oleh `notFound()` di
 *   page) tidak diberi sinyal indexing positif.
 */
export async function generateMetadata({
  params,
}: AccountDetailPageProps): Promise<Metadata> {
  const { gameSlug } = await params;
  const game = await getGameBySlug(gameSlug);

  if (!game) {
    return {
      title: "Akun Tidak Ditemukan",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${game.name} — Akun`,
    description: `Akun ${game.name} terverifikasi dengan garansi anti-minus dan serah terima cepat.`,
    robots: { index: true, follow: true },
  };
}

/**
 * `Game_Detail_Page` Akun (`/products/account/[gameSlug]`).
 *
 * Server Component yang menampilkan daftar `Akun` (Product `category ===
 * "account"`) untuk satu `Game` yang dipatok oleh URL segment `gameSlug`.
 *
 * Strategi:
 * - **`notFound()` saat game tidak ada di catalog** (REQ-2.5). Membedakan
 *   kondisi "tidak ada di catalog" (404) dari "fetch gagal" (`Error` yang
 *   ditangkap `error.tsx`).
 * - **Uncached** — stok akun bersifat real-time supaya tidak terjadi
 *   double-buy (REQ-6.3). `searchProducts` & `getAccountsByGame` keduanya
 *   tidak memasang direktif `"use cache"`.
 * - **Sort/filter/pagination** memakai `searchProducts` yang sudah
 *   menangani urutan, rentang harga, dan paginasi dari `searchParams`
 *   (REQ-2.7). `gameSlug` di-force ke `query.games` agar listing tetap
 *   terkunci ke game ini bahkan jika user mengetik manual `?game=…` lain.
 * - **Filter form scope-aware** (REQ-2.7, REQ-8.5): `ProductFilterSidebar`
 *   dan `ProductFilterDrawer` di-passing `scope="game-detail"` dan
 *   `basePath="/products/account/{gameSlug}"`, sehingga multi-select Game
 *   disembunyikan dan Apply/Reset tetap di halaman ini. `basePath` yang
 *   sama juga dialirkan ke `ProductListingToolbar` (search + sort) dan
 *   `ProductActiveFilters` (chip + Reset semua) supaya semua navigasi
 *   listing tidak lompat balik ke `/products` global.
 * - **Empty state** (REQ-2.6): saat game valid namun 0 akun, tampilkan
 *   pesan "Belum ada akun untuk {Game.name}" dengan tombol kembali ke
 *   `/products/account`.
 *
 * Header (breadcrumb + judul + total) dipisah ke komponen
 * `account-list-header.tsx` (REQ-2.3).
 */
export default async function AccountDetailPage({
  params,
  searchParams,
}: AccountDetailPageProps) {
  const [{ gameSlug }, sp] = await Promise.all([params, searchParams]);

  const game = await getGameBySlug(gameSlug);
  if (!game) notFound();

  // Ambil definisi filter spesifik game (mis. rank, skin, character).
  const gameFilters = getGameFilters(gameSlug);

  // Parse query dari URL. Untuk fetching, `games` di-force ke `[gameSlug]`
  // & `category` ke `"account"` supaya listing terkunci ke game ini meski
  // user memanipulasi URL manual. `q`, `sort`, `min`, `max`, `page` tetap
  // dihormati.
  const baseQuery = parseProductQuery(sp);
  const searchQuery = {
    ...baseQuery,
    games: [gameSlug],
    category: "account" as const,
    filterTags: baseQuery.filterTags,
  };

  // Query untuk komponen UI (sidebar, drawer, active-filters, pagination,
  // toolbar). `games` & `category` sengaja tidak diset karena keduanya
  // adalah konteks URL segment, **bukan** filter yang dapat dihapus user
  // (REQ-8.5). Dengan begini, `ProductActiveFilters` hanya menampilkan
  // chip untuk filter yang benar-benar di-apply (`q`, `min`, `max`),
  // dan sidebar form (`scope="game-detail"`) hanya merender kontrol
  // rentang harga + kategori-radio (yang otomatis netral).
  const displayQuery = { ...baseQuery, games: [] as string[] };

  const result = await searchProducts(searchQuery);

  const basePath = `/products/account/${gameSlug}`;

  return (
    <div className="container-page py-8 sm:py-10">
      <AccountListHeader game={game} total={result.total} />

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        {/* Sidebar filter: scope `game-detail` menyembunyikan multi-select
            Game dan Kategori (URL sudah memfix `gameSlug` & `account`),
            menampilkan filter spesifik game + rentang harga. */}
        <ProductFilterSidebar
          query={displayQuery}
          games={[]}
          scope="game-detail"
          basePath={basePath}
          gameFilters={gameFilters}
        />

        <div className="min-w-0">
          <ProductListingToolbar
            query={displayQuery}
            total={result.total}
            basePath={basePath}
            leadingSlot={
              <ProductFilterDrawer
                query={displayQuery}
                games={[]}
                scope="game-detail"
                basePath={basePath}
                gameFilters={gameFilters}
              />
            }
          />

          <ProductActiveFilters
            query={displayQuery}
            basePath={basePath}
            className="mt-4"
          />

          <section
            aria-label={`Daftar akun ${game.name}`}
            aria-busy={false}
            className="mt-6 sm:mt-8"
          >
            {result.items.length === 0 ? (
              <AccountEmptyState gameName={game.name} />
            ) : (
              <>
                <ProductGrid items={result.items} />
                <ProductPagination
                  query={displayQuery}
                  page={result.page}
                  totalPages={result.totalPages}
                  basePath={basePath}
                  className="mt-8 sm:mt-10"
                />
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state khusus `Game_Detail_Page` Akun (REQ-2.6).
 *
 * Memakai layout panel dashed yang sama dengan
 * `app/products/_components/product-listing-empty.tsx` untuk konsistensi
 * visual, dengan copy + CTA yang spesifik kategori (kembali ke daftar Game
 * Akun, bukan ke beranda).
 */
function AccountEmptyState({ gameName }: { gameName: string }) {
  return (
    <div
      role="status"
      className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-16 text-center"
    >
      <div className="mx-auto max-w-md space-y-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
          Belum ada akun untuk {gameName}
        </h2>
        <p className="text-sm text-fg-muted">
          Stok akun untuk game ini sedang kosong. Coba lagi sebentar atau pilih
          game lain dari daftar.
        </p>
        <Button asChild variant="primary" size="md">
          <Link href="/products/account">Kembali ke daftar Game</Link>
        </Button>
      </div>
    </div>
  );
}
