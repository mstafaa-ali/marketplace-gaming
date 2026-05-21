"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategorySearchInput } from "./category-search-input";
import { GameCard } from "./game-card";
import type { Game } from "@/lib/types/game";

const NUMBER_FORMATTER = new Intl.NumberFormat("id-ID");

/** Jumlah game yang ditampilkan pertama kali. */
const INITIAL_COUNT = 8;
/** Jumlah game yang ditambahkan setiap klik "Lihat Lebih Banyak". */
const LOAD_MORE_COUNT = 8;

export interface SearchableGameGridProps {
  games: Game[];
  category: "account" | "topup";
  emptyText: string;
}

/**
 * Client wrapper around GameGrid that adds a search bar for filtering
 * games by name and a "Load More" button for progressive disclosure.
 * Used on Account and Topup category landing pages.
 */
export function SearchableGameGrid({
  games,
  category,
  emptyText,
}: SearchableGameGridProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filtered = query
    ? games.filter((game) => game.name.toLowerCase().includes(query))
    : games;

  // Saat search aktif, tampilkan semua hasil. Load more hanya berlaku
  // saat tidak ada query pencarian.
  const displayedGames = query ? filtered : filtered.slice(0, visibleCount);
  const hasMore = !query && visibleCount < filtered.length;

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
    <div className="space-y-4">
      <CategorySearchInput
        placeholder="Cari game..."
        onSearch={setQuery}
        className="max-w-md"
      />

      {filtered.length === 0 ? (
        <div
          role="status"
          className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-12 text-center"
        >
          <p className="text-sm text-fg-muted">
            Tidak ada game yang cocok dengan &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <>
          <ul
            role="list"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          >
            {displayedGames.map((game) => {
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

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + LOAD_MORE_COUNT, filtered.length),
                  )
                }
              >
                Lihat Lebih Banyak
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
