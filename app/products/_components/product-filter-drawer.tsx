"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { GameFilterDefinition } from "@/lib/data/game-filters";
import type { Game } from "@/lib/types/game";
import type { ProductQuery } from "@/lib/types/product";
import { cn } from "@/lib/utils/cn";
import {
  ProductFilterForm,
  type ProductFilterScope,
} from "./product-filter-form";

interface ProductFilterDrawerProps {
  query: ProductQuery;
  games: Game[];
  className?: string;
  /**
   * Cakupan halaman pemanggil. Diteruskan ke `ProductFilterForm`. Default
   * `"global"` agar listing flat di `/products` tetap berperilaku sama.
   */
  scope?: ProductFilterScope;
  /**
   * Path dasar untuk URL Apply/Reset. Default `/products`. Untuk
   * Game_Detail_Page Akun, pemanggil mengirim `/products/account/{gameSlug}`.
   */
  basePath?: string;
  /**
   * Definisi filter spesifik game. Diteruskan ke `ProductFilterForm`.
   */
  gameFilters?: GameFilterDefinition[];
}

/**
 * Mobile filter drawer. Hidden on `lg+` where the sidebar takes over.
 *
 * The Sheet's open state is local because committing filters happens via the
 * URL (server roundtrip). Once `router.push` resolves, we close the drawer
 * via the `onCommit` callback so the user lands on the new results.
 */
export function ProductFilterDrawer({
  query,
  games,
  className,
  scope = "global",
  basePath,
  gameFilters,
}: ProductFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  const isGameDetail = scope === "game-detail";

  // Pada scope game-detail, `?game=…` ditetapkan oleh URL segment dan tidak
  // muncul di sidebar — jadi tidak perlu dihitung sebagai filter aktif.
  const filterTagCount = query.filterTags
    ? Object.values(query.filterTags).reduce((sum, arr) => sum + arr.length, 0)
    : 0;
  const activeCount =
    (isGameDetail ? 0 : query.games.length) +
    (isGameDetail ? 0 : query.category ? 1 : 0) +
    (typeof query.min === "number" ? 1 : 0) +
    (typeof query.max === "number" ? 1 : 0) +
    filterTagCount;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="md"
          className={cn("lg:hidden", className)}
        >
          <SlidersHorizontal
            className="size-4"
            aria-hidden
            strokeWidth={1.75}
          />
          Filter
          {activeCount > 0 ? (
            <span
              aria-label={`${activeCount} filter aktif`}
              className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-white tabular-nums"
            >
              {activeCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter produk</SheetTitle>
          <SheetDescription>
            {isGameDetail
              ? "Filter akun berdasarkan spesifikasi game."
              : "Pilih kategori, game, dan rentang harga."}
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <ProductFilterForm
            query={query}
            games={games}
            onCommit={() => setOpen(false)}
            hideTitle
            scope={scope}
            basePath={basePath}
            gameFilters={gameFilters}
          />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
