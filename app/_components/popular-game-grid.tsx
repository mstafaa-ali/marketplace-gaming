import {
  ChevronRight,
  Crosshair,
  Flame,
  Gamepad2,
  Sparkles,
  Star,
  Swords,
  Target,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPopularGames } from "@/lib/data/games";
import { cn } from "@/lib/utils/cn";
import type { Game } from "@/lib/types/game";

/**
 * Map of icon names referenced in `lib/data/mock-games.ts` to Lucide icon
 * components. Kept narrow so adding a game without updating the map fails
 * loud (we fall back to a sensible default).
 */
const GAME_ICONS: Record<string, LucideIcon> = {
  Swords,
  Crosshair,
  Target,
  Sparkles,
  Flame,
  Star,
};

const NUMBER_FORMATTER = new Intl.NumberFormat("id-ID");

export async function PopularGameGrid() {
  const games = await getPopularGames();

  if (games.length === 0) return null;

  return (
    <section
      aria-labelledby="popular-games-heading"
      className="container-page py-12 sm:py-16"
    >
      <header className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-violet-300">
            Pilih Game Favoritmu
          </p>
          <h2
            id="popular-games-heading"
            className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Game paling dicari minggu ini
          </h2>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="self-start sm:self-end"
        >
          <Link href="/products">
            Lihat semua kategori
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </header>

      <ul
        role="list"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
      >
        {games.map((game) => (
          <li key={game.slug}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface GameCardProps {
  game: Game;
}

function GameCard({ game }: GameCardProps) {
  const Icon = GAME_ICONS[game.icon] ?? Gamepad2;
  const productLabel = NUMBER_FORMATTER.format(game.productCount);

  return (
    <Link
      href={`/products?game=${game.slug}`}
      aria-label={`${game.name} — ${productLabel} produk tersedia`}
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
          "relative aspect-square w-full overflow-hidden bg-linear-to-br",
          game.accent,
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-white/10" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/15 text-white shadow-md backdrop-blur transition-transform duration-(--duration-base) ease-snappy group-hover:scale-105 sm:size-16">
            <Icon className="size-7 sm:size-8" strokeWidth={1.75} aria-hidden />
          </span>
        </div>
      </div>

      <div className="space-y-1 p-3 sm:p-4">
        <h3 className="font-display text-sm font-semibold tracking-tight text-fg sm:text-base">
          {game.name}
        </h3>
        <p className="text-xs text-fg-subtle">{game.publisher}</p>
        <p className="pt-1 text-xs text-fg-muted">
          <span className="font-semibold tabular-nums text-violet-300">
            {productLabel}
          </span>{" "}
          produk
        </p>
      </div>
    </Link>
  );
}
