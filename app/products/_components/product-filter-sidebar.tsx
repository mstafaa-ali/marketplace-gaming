import type { Game } from "@/lib/types/game";
import type { ProductQuery } from "@/lib/types/product";
import { cn } from "@/lib/utils/cn";
import { ProductFilterForm } from "./product-filter-form";

interface ProductFilterSidebarProps {
  query: ProductQuery;
  games: Game[];
  className?: string;
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
        <ProductFilterForm query={query} games={games} />
      </div>
    </aside>
  );
}
