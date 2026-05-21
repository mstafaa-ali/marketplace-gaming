"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Game } from "@/lib/types/game";

const GAME_ICONS: Record<string, LucideIcon> = {
  Swords,
  Crosshair,
  Target,
  Sparkles,
  Flame,
  Star,
};

const NUMBER_FORMATTER = new Intl.NumberFormat("id-ID");

/** Jumlah game yang ditampilkan pertama kali. */
const INITIAL_COUNT = 6;
/** Jumlah game yang ditambahkan setiap klik "Lihat Lebih Banyak". */
const LOAD_MORE_COUNT = 6;

export interface PopularGameLoadMoreProps {
  games: Game[];
}

/**
 * Client component yang membungkus grid game populer di landing page
 * dengan fitur "Load More" — menampilkan 6 game awal, lalu menambah
 * 6 game setiap klik tombol.
 */
export function PopularGameLoadMore({ games }: PopularGameLoadMoreProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleGames = games.slice(0, visibleCount);
  const hasMore = visibleCount < games.length;

  return (
    <div className="space-y-6">
      <ul
        role="list"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
      >
        {visibleGames.map((game) => (
          <li key={game.slug}>
            <PopularGameCard game={game} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="md"
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + LOAD_MORE_COUNT, games.length),
              )
            }
          >
            Lihat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  );
}

function PopularGameCard({ game }: { game: Game }) {
  const Icon = GAME_ICONS[game.icon] ?? Gamepad2;
  const productLabel = NUMBER_FORMATTER.format(game.productCount);

  return (
    <Link
      href={`/checkout?category=topup&game=${game.slug}`}
      aria-label={`Top up ${game.name} — ${productLabel} produk tersedia`}
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
        {game.image ? (
          <Image
            src={game.image}
            alt=""
            fill
            className="object-cover transition-transform duration-(--duration-base) ease-snappy group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-white/15 text-white shadow-md backdrop-blur transition-transform duration-(--duration-base) ease-snappy group-hover:scale-105 sm:size-16">
              <Icon
                className="size-7 sm:size-8"
                strokeWidth={1.75}
                aria-hidden
              />
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-white/10" />
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
