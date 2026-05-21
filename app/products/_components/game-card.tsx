import {
  Crosshair,
  Flame,
  Gamepad2,
  Sparkles,
  Star,
  Swords,
  Target,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Game } from "@/lib/types/game";

/**
 * Map nama ikon Lucide (sesuai `lib/data/mock-games.ts`) ke komponen ikon-nya.
 * Sengaja sempit supaya saat ada nilai `icon` baru di data tanpa update map,
 * fallback `Gamepad2` muncul agar regresi visual gampang ditangkap.
 */
const GAME_ICONS: Record<string, LucideIcon> = {
  Swords,
  Crosshair,
  Target,
  Sparkles,
  Flame,
  Star,
};

export interface GameCardProps {
  /** Entitas Game yang dirender. Sumber `name`, `icon`, dan `accent`. */
  game: Game;
  /**
   * Tujuan klik — selalu ditentukan halaman induk supaya `GameCard` tidak
   * membaca konteks kategori sendiri. Contoh:
   *   - `/products/account/{slug}` saat dipakai di Category_Landing_Page Akun.
   *   - `/checkout?category=topup&game={slug}` saat dipakai di Topup landing.
   */
  href: string;
  /**
   * Label jumlah produk yang sudah ter-format untuk dibaca manusia,
   * mis. `"12 akun"` atau `"8 paket topup"`. Dipakai di body card maupun
   * `aria-label` link.
   */
  countLabel: string;
}

/**
 * Card entitas `Game` untuk grid di `Category_Landing_Page` Akun & Topup.
 *
 * Kontrak (lihat `guideline/styling-guideline.md` §6.9):
 * - **Single `<Link>`** membungkus seluruh card. Tidak ada nested anchor /
 *   button di dalamnya — pembaca layar harus menemui satu landmark per item.
 * - **`aria-label`** dirakit dari `countLabel` + `game.name` supaya konteks
 *   terbaca lengkap tanpa bergantung pada teks visual.
 * - **Tujuan navigasi** ditentukan oleh halaman induk lewat prop `href`;
 *   card ini tidak tahu apakah sedang di kategori Akun atau Topup.
 * - **Focus ring** mengikuti rule global `:focus-visible` di
 *   `app/globals.css` (`outline: 2px solid var(--color-violet-400)`).
 * - **Hit area** ≥ 44×44px di mobile (card secara visual jauh lebih besar).
 *
 * Visual mengekor `app/_components/popular-game-grid.tsx`: panel `aspect-4/3`
 * berisi gradient `accent` + ikon Lucide di tengah, body 2 baris (nama +
 * jumlah produk). `Game` belum punya field `cover` di `lib/types/game.ts`,
 * jadi pendekatan ikon-over-gradient yang dipakai — selaras dengan
 * implementasi referensi.
 */
export function GameCard({ game, href, countLabel }: GameCardProps) {
  const Icon = GAME_ICONS[game.icon] ?? Gamepad2;

  return (
    <Link
      href={href}
      aria-label={`Lihat ${countLabel} untuk ${game.name}`}
      className={cn(
        "group relative block h-full overflow-hidden rounded-xl border border-border bg-bg-elevated",
        "transition-all duration-(--duration-base) ease-snappy",
        "hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-glow",
        "focus-visible:-translate-y-0.5 focus-visible:border-violet-400",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "relative aspect-4/3 w-full overflow-hidden",
          !game.image && "bg-linear-to-br",
          !game.image && game.accent,
        )}
      >
        {game.image ? (
          <Image
            src={game.image}
            alt=""
            fill
            className="object-cover transition-transform duration-(--duration-base) ease-snappy group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-white/10" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/15 text-white shadow-md backdrop-blur transition-transform duration-(--duration-base) ease-snappy group-hover:scale-105 sm:size-16">
                <Icon
                  className="size-7 sm:size-8"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
            </div>
          </>
        )}
      </div>

      <div className="space-y-1 p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-fg">
          {game.name}
        </h3>
        <p className="text-xs tabular-nums text-fg-muted">{countLabel}</p>
      </div>
    </Link>
  );
}
