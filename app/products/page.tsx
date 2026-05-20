import type { Metadata } from "next";
import { CATEGORY_LABELS } from "@/lib/constants/products";
import { getPopularGames } from "@/lib/data/games";
import { searchProducts } from "@/lib/data/products";
import { parseProductQuery } from "@/lib/utils/product-query";
import { ProductActiveFilters } from "./_components/product-active-filters";
import { ProductFilterDrawer } from "./_components/product-filter-drawer";
import { ProductFilterSidebar } from "./_components/product-filter-sidebar";
import { ProductGrid } from "./_components/product-grid";
import { ProductListingEmpty } from "./_components/product-listing-empty";
import { ProductListingToolbar } from "./_components/product-listing-toolbar";
import { ProductPagination } from "./_components/product-pagination";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface ProductListingPageProps {
  searchParams: SearchParams;
}

export async function generateMetadata({
  searchParams,
}: ProductListingPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const query = parseProductQuery(sp);

  const parts: string[] = [];
  if (query.q) parts.push(`"${query.q}"`);
  if (query.category) parts.push(CATEGORY_LABELS[query.category]);

  const title =
    parts.length > 0 ? `${parts.join(" · ")} — Produk` : "Semua Produk";

  // Listing kombinasi filter sengaja tidak diindeks: terlalu banyak permutasi
  // dan halaman utama listing sudah cukup sebagai canonical.
  const shouldIndex =
    !query.q &&
    query.games.length === 0 &&
    !query.category &&
    query.min === undefined &&
    query.max === undefined &&
    query.page === 1;

  return {
    title,
    description:
      "Temukan akun game premium, top up resmi, dan voucher digital dengan garansi anti-minus.",
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function ProductListingPage({
  searchParams,
}: ProductListingPageProps) {
  const sp = await searchParams;
  const query = parseProductQuery(sp);

  // Fetch listing + games in parallel — both are independent server reads.
  const [result, games] = await Promise.all([
    searchProducts(query),
    getPopularGames(),
  ]);

  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Marketplace
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Semua Produk
        </h1>
        <p className="max-w-2xl text-sm text-fg-muted sm:text-base">
          Akun premium, top up resmi, dan voucher digital. Filter berdasarkan
          game, kategori, atau urutkan sesuai harga untuk menemukan yang pas.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <ProductFilterSidebar query={query} games={games} />

        <div className="min-w-0">
          <ProductListingToolbar
            query={query}
            total={result.total}
            leadingSlot={<ProductFilterDrawer query={query} games={games} />}
          />

          <ProductActiveFilters query={query} className="mt-4" />

          <section
            aria-label="Daftar produk"
            aria-busy={false}
            className="mt-6 sm:mt-8"
          >
            {result.items.length === 0 ? (
              <ProductListingEmpty query={query} />
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
      </div>
    </div>
  );
}
