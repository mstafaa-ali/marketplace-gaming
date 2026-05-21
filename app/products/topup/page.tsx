import type { Metadata } from "next";
import Link from "next/link";
import { getGamesForCategory } from "@/lib/data/games";
import { SearchableGameGrid } from "../_components/searchable-game-grid";

/**
 * Metadata `Category_Landing_Page` Topup. Indexable (REQ-6.4) karena halaman
 * ini adalah entry SEO-relevan untuk pencarian "top up game" — beda dengan
 * route `Game_Detail_Page` topup yang langsung berpindah ke `/checkout` dan
 * di-`noindex` oleh halaman checkout itu sendiri.
 */
export const metadata: Metadata = {
  title: "Top Up Game",
  description:
    "Pilih game untuk top up diamond, UC, Valorant Points, atau Genesis Crystal. Proses 1–3 menit, resmi langsung ke akun.",
  robots: { index: true, follow: true },
};

/**
 * `Category_Landing_Page` Topup (`/products/topup`).
 *
 * Server Component yang merender grid `Game_Card` berisi semua `Game` yang
 * memiliki minimal satu `Topup` (REQ-1.2). Klik pada `Game_Card` membawa
 * pengguna ke `/checkout?category=topup&game={slug}` — alur Topup memang
 * single-shot (tidak melalui listing produk maupun cart, lihat REQ-4.1).
 *
 * Data flow (REQ-1.6):
 *   `getGamesForCategory("topup")` → list `Game` ter-deduplikasi & ter-sort
 *   (productCount desc, tie-breaker name asc). `<GameGrid />` membungkus
 *   logika href + label jumlah produk per kategori, jadi page ini tinggal
 *   memberikan konteks header.
 *
 * Loading & error state ditangani oleh segment-level `loading.tsx` dan
 * `error.tsx` di folder yang sama (REQ-9.1, REQ-9.2).
 */
export default async function TopupLandingPage() {
  const games = await getGamesForCategory("topup");

  return (
    <div className="container-page py-8 sm:py-10">
      {/* Breadcrumb — pola sama dengan halaman lain (lihat
          `app/products/[slug]/page.tsx`) supaya konsisten. */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fg-muted">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-fg focus-visible:text-fg"
            >
              Beranda
            </Link>
          </li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li>
            <span className="font-medium text-fg" aria-current="page">
              Top Up
            </span>
          </li>
        </ol>
      </nav>

      <header className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
          Top Up Game
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Top Up Game
        </h1>
        <p className="max-w-2xl text-sm text-fg-muted sm:text-base">
          Pilih game lalu langsung ke checkout — alur sekali jalan tanpa
          keranjang. Pilih nominal, isi data akun, bayar, selesai.
        </p>
      </header>

      <SearchableGameGrid
        games={games}
        category="topup"
        emptyText="Belum ada topup tersedia saat ini"
      />
    </div>
  );
}
