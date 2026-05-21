import Link from "next/link";
import { X } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/constants/products";
import { MOCK_GAMES } from "@/lib/data/mock-games";
import { formatIDR } from "@/lib/utils/format";
import { buildProductsHref } from "@/lib/utils/product-query";
import { cn } from "@/lib/utils/cn";
import type { ProductQuery } from "@/lib/types/product";

interface ProductActiveFiltersProps {
  query: ProductQuery;
  /**
   * Route dasar untuk membangun href chip "hapus filter" dan link
   * "Reset semua". Default `"/products"`; route turunan mengirim path-nya
   * sendiri (mis. `/products/account/{gameSlug}`) supaya navigasi tetap di
   * dalam halaman yang sama.
   */
  basePath?: string;
  className?: string;
}

interface ActiveChip {
  key: string;
  label: string;
  href: string;
}

/**
 * Show every active filter as a removable chip. Each chip is a plain `<Link>`
 * to a URL with that single key cleared — no client JS required, plays nice
 * with prefetch and back/forward.
 *
 * `MOCK_GAMES` is imported directly here (rather than via the data layer)
 * because it's a static lookup table for slug → human name. When the real
 * games API arrives, swap to a `getGameMap()` helper.
 */
export function ProductActiveFilters({
  query,
  basePath = "/products",
  className,
}: ProductActiveFiltersProps) {
  const chips: ActiveChip[] = [];

  if (query.q) {
    chips.push({
      key: "q",
      label: `Pencarian: "${query.q}"`,
      href: buildProductsHref(
        query,
        { q: undefined, resetPage: true },
        basePath,
      ),
    });
  }

  if (query.category) {
    chips.push({
      key: "category",
      label: `Kategori: ${CATEGORY_LABELS[query.category]}`,
      href: buildProductsHref(
        query,
        { category: undefined, resetPage: true },
        basePath,
      ),
    });
  }

  for (const slug of query.games) {
    const game = MOCK_GAMES.find((g) => g.slug === slug);
    chips.push({
      key: `game:${slug}`,
      label: `Game: ${game?.name ?? slug}`,
      href: buildProductsHref(
        query,
        {
          games: query.games.filter((g) => g !== slug),
          resetPage: true,
        },
        basePath,
      ),
    });
  }

  if (typeof query.min === "number") {
    chips.push({
      key: "min",
      label: `Min: ${formatIDR(query.min)}`,
      href: buildProductsHref(
        query,
        { min: undefined, resetPage: true },
        basePath,
      ),
    });
  }
  if (typeof query.max === "number") {
    chips.push({
      key: "max",
      label: `Max: ${formatIDR(query.max)}`,
      href: buildProductsHref(
        query,
        { max: undefined, resetPage: true },
        basePath,
      ),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      aria-label="Filter aktif"
    >
      <span className="text-xs uppercase tracking-wider text-fg-subtle">
        Filter aktif
      </span>
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          scroll={false}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-overlay px-3 py-1",
            "text-xs text-fg-muted transition-colors",
            "hover:border-violet-400 hover:text-fg",
          )}
        >
          <span>{chip.label}</span>
          <X className="size-3.5" aria-hidden strokeWidth={2.25} />
          <span className="sr-only">— hapus filter</span>
        </Link>
      ))}
      <Link
        href={basePath}
        scroll={false}
        className="ml-1 text-xs text-violet-300 underline-offset-4 hover:underline"
      >
        Reset semua
      </Link>
    </div>
  );
}
