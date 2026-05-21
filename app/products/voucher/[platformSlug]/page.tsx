import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DEFAULT_PER_PAGE, type SortValue } from "@/lib/constants/products";
import { getPlatformBySlug, getVouchersByPlatform } from "@/lib/data/platforms";
import type { Product } from "@/lib/types/product";
import { parseProductQuery } from "@/lib/utils/product-query";
import { ProductGrid } from "../../_components/product-grid";
import { ProductPagination } from "../../_components/product-pagination";
import { ProductSortSelect } from "../../_components/product-sort-select";
import { PlatformListHeader } from "./_components/platform-list-header";

type Params = Promise<{ platformSlug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface VoucherDetailPageProps {
  params: Params;
  searchParams: SearchParams;
}

const RESULT_FORMATTER = new Intl.NumberFormat("id-ID");

/**
 * Metadata async untuk `Platform_Detail_Page`
 * (`/products/voucher/[platformSlug]`).
 *
 * - Title mengikuti tabel metadata di `design.md`:
 *   `Voucher ${Platform.name}` (REQ-6.4).
 * - Indexable: halaman ini stabil & share-able per `Platform`, bukan
 *   listing flat dengan permutasi filter.
 * - Bila slug tidak dikenal, kita kembalikan metadata fallback minimal —
 *   keputusan `notFound()` final tetap di komponen halaman supaya error
 *   non-`notFound` (mis. fetch gagal) lolos ke `error.tsx` segment
 *   terdekat (REQ-9.4) alih-alih disamakan dengan 404 di sini.
 */
export async function generateMetadata({
  params,
}: VoucherDetailPageProps): Promise<Metadata> {
  const { platformSlug } = await params;
  const platform = await getPlatformBySlug(platformSlug);

  if (!platform) {
    return {
      title: "Voucher",
    };
  }

  return {
    title: `Voucher ${platform.name}`,
    description: `Pilihan voucher digital untuk ${platform.name}. Pengiriman instan via email setelah pembayaran terkonfirmasi.`,
    robots: { index: true, follow: true },
  };
}

/**
 * Sort daftar `Voucher` berdasarkan `ProductQuery.sort`. Logika dijaga
 * lokal (alih-alih reuse `searchProducts`) supaya halaman ini tetap
 * presentational atas hasil `getVouchersByPlatform` dan kontrak
 * "filter Game **TIDAK** dirender" di Platform_Detail_Page (REQ-8.4)
 * tidak terbocori secara tidak sengaja.
 */
function sortVouchers(items: Product[], sort: SortValue): Product[] {
  const sorted = [...items];
  switch (sort) {
    case "price_asc":
      sorted.sort((a, b) => a.price.amount - b.price.amount);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.price.amount - a.price.amount);
      break;
    case "newest":
    default:
      sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
  }
  return sorted;
}

/**
 * `Platform_Detail_Page` — listing `Voucher` untuk satu `Platform`
 * (`/products/voucher/[platformSlug]`).
 *
 * Server Component, `params` dan `searchParams` di-`await` per konvensi
 * Next.js 16.
 *
 * Kontrak penting:
 * - **REQ-3.5 (notFound)**: `notFound()` HANYA dipanggil saat
 *   `platformSlug` tidak ada di catalog. Error lain (data fetch /
 *   parsing / hard-rule REQ-5.2 dari `getVouchersByPlatform`) sengaja
 *   TIDAK ditangkap di sini — exception dibiarkan menjalar agar
 *   `app/products/voucher/[platformSlug]/error.tsx` (atau `error.tsx`
 *   segment di atasnya) yang menampilkannya. Pemisahan ini menjaga
 *   404 standar Next.js untuk slug yang benar-benar tidak ada,
 *   dan layar error untuk gangguan teknis.
 * - **REQ-3.6 (empty state tanpa filter/sort)**: saat `platformSlug`
 *   valid namun 0 voucher, render empty state khusus TANPA toolbar
 *   sort apa pun. Layout single-column, copy konteks-spesifik
 *   "Belum ada voucher untuk {Platform.name}", CTA kembali ke
 *   `/products/voucher`.
 * - **REQ-8.4 (no game filter)**: filter Game tidak dirender — voucher
 *   tidak terikat ke `Game`. Hanya kontrol `sort` + pagination yang
 *   tersedia, tanpa sidebar filter dan tanpa drawer.
 * - **REQ-6.3 (cached)**: `getPlatformBySlug` & `getVouchersByPlatform`
 *   sudah memiliki direktif `"use cache" + cacheTag(...)` siap-aktif
 *   begitu `cacheComponents: true` dipasang di `next.config.ts`.
 *
 * Header + breadcrumb diekstrak ke `PlatformListHeader` (task 8.7) agar
 * `page.tsx` tetap fokus pada orkestrasi data.
 */
export default async function VoucherDetailPage({
  params,
  searchParams,
}: VoucherDetailPageProps) {
  const { platformSlug } = await params;
  const sp = await searchParams;

  // 1) Resolve platform — `null` artinya slug tidak ada di catalog → 404
  //    (REQ-3.5). Error lain (fetch/parse) akan menjalar ke `error.tsx`.
  const platform = await getPlatformBySlug(platformSlug);
  if (!platform) notFound();

  // 2) Parse query (sort + page + perPage). Filter `games`, `category`,
  //    `q`, `min`, `max` diabaikan secara semantik di sini sesuai
  //    REQ-8.4 (filter Game tidak dirender) — tetap di-parse agar URL
  //    yang membawa parameter tersebut tidak crash, tapi UI tidak
  //    memberikan affordance untuk mengubahnya.
  const query = parseProductQuery(sp);

  // 3) Fetch voucher untuk platform ini. Hard-rule REQ-5.2 ditegakkan
  //    di data layer; bila ada voucher tanpa `platformSlug`, exception
  //    dilempar dan ditangkap oleh `error.tsx` (REQ-9.4).
  const allVouchers = await getVouchersByPlatform(platformSlug);

  // 4) Sort + paginasi lokal. Voucher untuk satu platform diasumsikan
  //    relatif kecil (puluhan), jadi sort in-memory aman.
  const sorted = sortVouchers(allVouchers, query.sort);
  const total = sorted.length;
  const perPage = query.perPage > 0 ? query.perPage : DEFAULT_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, query.page), totalPages);
  const start = (page - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  const basePath = `/products/voucher/${platformSlug}`;

  return (
    <div className="container-page py-8 sm:py-10">
      <PlatformListHeader platform={platform} total={total} />

      {/* Single-column layout (REQ-8.4): tidak ada sidebar filter Game. */}
      {items.length === 0 ? (
        // REQ-3.6 — empty state khusus TANPA toolbar/sort/filter UI.
        <EmptyVoucherState platformName={platform.name} />
      ) : (
        <section
          aria-label={`Daftar voucher ${platform.name}`}
          className="space-y-6"
        >
          {/* Toolbar: hanya sort + total. Tidak ada filter drawer (REQ-8.4). */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
            <p className="text-xs text-fg-muted sm:text-sm">
              Menampilkan{" "}
              <span className="font-semibold tabular-nums text-fg">
                {RESULT_FORMATTER.format(items.length)}
              </span>{" "}
              dari {RESULT_FORMATTER.format(total)} voucher
            </p>
            <ProductSortSelect query={query} basePath={basePath} />
          </div>

          <ProductGrid items={items} />

          <ProductPagination
            query={query}
            page={page}
            totalPages={totalPages}
            basePath={basePath}
            className="mt-2 sm:mt-4"
          />
        </section>
      )}
    </div>
  );
}

/**
 * Empty state untuk `Platform_Detail_Page` saat `platformSlug` valid tapi 0
 * voucher (REQ-3.6). Sengaja **inline** dan **tanpa toolbar/sort/filter UI**
 * — pembeda terbesar dari `ProductListingEmpty` global.
 *
 * CTA mengarah balik ke `Category_Landing_Page` Voucher
 * (`/products/voucher`), bukan ke beranda — sesuai instruksi task ("Kembali
 * ke daftar Platform").
 */
function EmptyVoucherState({ platformName }: { platformName: string }) {
  return (
    <div
      role="status"
      className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-16 text-center"
    >
      <div className="mx-auto max-w-md space-y-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
          Belum ada voucher untuk {platformName}
        </h2>
        <p className="text-sm text-fg-muted">
          Stok untuk platform ini sedang kosong. Coba jelajahi platform lain
          melalui daftar Voucher.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button asChild variant="primary" size="md">
            <Link href="/products/voucher">Kembali ke daftar Platform</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
