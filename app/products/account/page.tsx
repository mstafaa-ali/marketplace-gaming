import type { Metadata } from "next";
import Link from "next/link";
import { SearchableGameGrid } from "../_components/searchable-game-grid";
import { getGamesForCategory } from "@/lib/data/games";

/**
 * Metadata `Category_Landing_Page` Akun.
 *
 * - `title` mengikuti tabel metadata di `design.md` (REQ-6.4).
 * - `description` menggambarkan alur two-step browse (REQ-1) dengan contoh
 *   game populer agar relevan secara SEO.
 * - Tidak ada `robots` restriction → halaman tetap **indexable** (default
 *   sesuai REQ-6.4 yang menandai route ini `indexable`).
 */
export const metadata: Metadata = {
  title: "Akun Game",
  description:
    "Pilih game untuk melihat akun yang tersedia. Mythic ML, Immortal Valorant, Conqueror PUBG, dan lainnya.",
};

/**
 * `Category_Landing_Page` Akun (`/products/account`).
 *
 * Server Component yang menjadi entry alur browse two-step kategori Akun
 * (REQ-1.1). Halaman ini **tidak menampilkan `Product` apa pun** — hanya
 * grid `Game_Card` untuk memilih `Game` lebih dulu (REQ-1.1, REQ-2.1).
 *
 * Strategi:
 * - Data layer (`getGamesForCategory("account")`) sudah:
 *   - mengelompokkan `Akun` per `Game` & menghitung `productCount` (REQ-1.4),
 *   - sort descending `productCount` dengan tie-breaker ascending `name`
 *     (REQ-1.6),
 *   - melempar `Error` deskriptif saat fetch/parse gagal sehingga ditangkap
 *     `error.tsx` segment terdekat (REQ-9.4).
 * - `GameGrid` menentukan tujuan navigasi `Game_Card` ke
 *   `/products/account/{slug}` berdasarkan prop `category="account"` —
 *   visualnya identik dengan halaman Topup (REQ-2.1).
 * - Empty state ditangani oleh `GameGrid` lewat prop `emptyText` (REQ-1.5).
 *
 * Caching: belum diaktifkan di sini; `getGamesForCategory` sudah memiliki
 * direktif `cacheTag("games", "games:account")` siap-aktif begitu
 * `cacheComponents: true` dipasang (REQ-6.3).
 */
export default async function AccountLandingPage() {
  const games = await getGamesForCategory("account");

  return (
    <div className="container-page py-8 sm:py-10">
      {/* Breadcrumb — pola sama dengan `app/products/[slug]/page.tsx`,
          dengan label "Beranda > Akun" sesuai tabel breadcrumb di design.md. */}
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
              Akun
            </span>
          </li>
        </ol>
      </nav>

      <header className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Marketplace
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Akun Game
        </h1>
        <p className="max-w-2xl text-sm text-fg-muted sm:text-base">
          Pilih game di bawah untuk melihat akun yang tersedia. Semua akun
          melewati verifikasi internal dengan garansi anti-minus dan serah
          terima cepat lewat tim support kami.
        </p>
      </header>

      <section aria-label="Daftar game dengan akun tersedia">
        <SearchableGameGrid
          games={games}
          category="account"
          emptyText="Belum ada akun tersedia saat ini"
        />
      </section>
    </div>
  );
}
