import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPopularGames } from "@/lib/data/games";
import { PopularGameLoadMore } from "./popular-game-load-more";

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

      <PopularGameLoadMore games={games} />
    </section>
  );
}
