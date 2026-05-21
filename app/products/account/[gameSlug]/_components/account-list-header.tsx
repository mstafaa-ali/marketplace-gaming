import Link from "next/link";
import type { Game } from "@/lib/types/game";

const NUMBER_FORMATTER = new Intl.NumberFormat("id-ID");

interface AccountListHeaderProps {
  /** Game yang sedang ditampilkan listing-nya — sudah dipastikan ada oleh page (REQ-2.5). */
  game: Game;
  /** Total `Akun` yang dimuat halaman ini setelah filter & pagination diaplikasikan. */
  total: number;
}

/**
 * Header `Game_Detail_Page` Akun (`/products/account/[gameSlug]`).
 *
 * Server Component — tidak butuh interaktivitas, jadi tetap di server agar
 * tidak menambah JS bundle. Mengeksekusi REQ-2.3 dengan tiga elemen:
 *
 * 1. **Breadcrumb** "Beranda > Akun > {Game.name}" untuk orientasi navigasi
 *    dan secondary link kembali ke parent route.
 * 2. **Eyebrow + judul + subtitle** identik dengan markup yang sebelumnya
 *    inline di `page.tsx`, supaya visual tidak bergeser.
 * 3. **Total `Akun`** dengan `aria-live="polite"` agar assistive tech
 *    membaca perubahan jumlah saat user mengubah filter / pagination.
 *
 * Menggunakan `Intl.NumberFormat("id-ID")` untuk pemisah ribuan supaya
 * angka besar (>1.000) tetap mudah dibaca pengguna ID.
 */
export function AccountListHeader({ game, total }: AccountListHeaderProps) {
  const formattedTotal = NUMBER_FORMATTER.format(total);

  return (
    <>
      {/* Breadcrumb: "Beranda > Akun > {Game.name}" (REQ-2.3). */}
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
            <Link
              href="/products/account"
              className="transition-colors hover:text-fg focus-visible:text-fg"
            >
              Akun
            </Link>
          </li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li>
            <span className="font-medium text-fg" aria-current="page">
              {game.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Header: eyebrow + judul + subtitle + total (REQ-2.3). */}
      <header className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Akun · {game.publisher}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {game.name}
        </h1>
        <p className="max-w-2xl text-sm text-fg-muted sm:text-base">
          Akun {game.name} terverifikasi dengan garansi anti-minus. Filter
          rentang harga atau urutkan untuk menemukan akun yang pas.
        </p>
        <p className="text-sm text-fg-muted" aria-live="polite">
          <span className="font-semibold tabular-nums text-fg">
            {formattedTotal}
          </span>{" "}
          akun ditemukan
        </p>
      </header>
    </>
  );
}
