import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GameCard } from "./game-card";
import type { Game } from "@/lib/types/game";

/**
 * Formatter angka Indonesia (mis. `1.234`) — dipakai sekali pada module scope
 * supaya `Intl.NumberFormat` tidak diinstansiasi ulang per render. Konsisten
 * dengan pola di `app/_components/popular-game-grid.tsx`.
 */
const NUMBER_FORMATTER = new Intl.NumberFormat("id-ID");

export interface GameGridProps {
  /** Daftar `Game` unik (sudah ter-deduplikasi & ter-sort di data layer). */
  games: Game[];
  /**
   * Konteks `Category_Landing_Page`. Menentukan tujuan navigasi setiap card
   * tanpa mengubah tampilan visual (REQ-2.1):
   *   - `"account"` → `/products/account/{slug}` (Game_Detail_Page Akun).
   *   - `"topup"` → `/checkout?category=topup&game={slug}` (alur Topup
   *     single-shot, lihat REQ-4).
   */
  category: "account" | "topup";
  /**
   * Teks empty state, mis. `"Belum ada akun tersedia saat ini"`. Ditentukan
   * halaman induk supaya copy-nya bisa konteks-spesifik (REQ-1.5).
   */
  emptyText: string;
}

/**
 * Grid `Game_Card` untuk `Category_Landing_Page` Akun & Topup.
 *
 * Kontrak (REQ-2.1):
 * - **Visual identik** antara mode Akun dan Topup. Tidak ada penanda visual
 *   pada `Game_Card` yang membedakan kategori — pembeda satu-satunya adalah
 *   tujuan navigasi yang dihitung di sini berdasarkan prop `category`.
 * - **Server Component**: tidak ada state lokal, semua perhitungan terjadi
 *   saat render di server.
 * - **Empty state** muncul hanya saat `games.length === 0`; copy-nya datang
 *   dari prop `emptyText` agar halaman induk bisa menyesuaikan dengan
 *   konteks kategori (REQ-1.5).
 *
 * Layout: 2 kolom di mobile, 3 di tablet, 4 di desktop. Mengekor pola
 * `popular-game-grid.tsx` namun memakai 4 kolom di `lg` karena ini halaman
 * landing dedicated (bukan section di beranda yang bersaing dengan konten
 * lain).
 */
export function GameGrid({ games, category, emptyText }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div
        role="status"
        className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-16 text-center"
      >
        <div className="mx-auto max-w-md space-y-4">
          <p className="text-sm text-fg-muted">{emptyText}</p>
          <Button asChild variant="outline" size="md">
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
    >
      {games.map((game) => {
        const href =
          category === "account"
            ? `/products/account/${game.slug}`
            : `/checkout?category=topup&game=${game.slug}`;

        const formattedCount = NUMBER_FORMATTER.format(game.productCount);
        const countLabel =
          category === "account"
            ? `${formattedCount} akun`
            : `${formattedCount} paket topup`;

        return (
          <li key={game.slug}>
            <GameCard game={game} href={href} countLabel={countLabel} />
          </li>
        );
      })}
    </ul>
  );
}
