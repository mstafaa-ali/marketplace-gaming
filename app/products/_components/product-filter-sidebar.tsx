import type { GameFilterDefinition } from "@/lib/data/game-filters";
import type { Game } from "@/lib/types/game";
import type { ProductQuery } from "@/lib/types/product";
import { cn } from "@/lib/utils/cn";
import {
  ProductFilterForm,
  type ProductFilterScope,
} from "./product-filter-form";

interface ProductFilterSidebarProps {
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
 * Desktop filter sidebar. Server Component shell — only the inner form is
 * client. Sticks below the header so filters stay reachable when scrolling
 * a long results list.
 */
export function ProductFilterSidebar({
  query,
  games,
  className,
  scope,
  basePath,
  gameFilters,
}: ProductFilterSidebarProps) {
  return (
    <aside
      aria-label="Filter produk"
      className={cn(
        "hidden lg:block",
        "lg:sticky lg:top-24 lg:self-start",
        className,
      )}
    >
      <div className="rounded-xl border border-border bg-bg-elevated p-5">
        <ProductFilterForm
          query={query}
          games={games}
          scope={scope}
          basePath={basePath}
          gameFilters={gameFilters}
        />
      </div>
    </aside>
  );
}
