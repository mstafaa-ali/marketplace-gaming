import { cn } from "@/lib/utils/cn";
import type { ProductQuery } from "@/lib/types/product";
import { ProductSearchInput } from "./product-search-input";
import { ProductSortSelect } from "./product-sort-select";

const RESULT_FORMATTER = new Intl.NumberFormat("id-ID");

interface ProductListingToolbarProps {
  query: ProductQuery;
  total: number;
  /**
   * Slot rendered before the result count — currently used by the listing
   * page to mount the mobile filter drawer trigger so it sits next to the
   * sort control on small screens.
   */
  leadingSlot?: React.ReactNode;
  /**
   * Route dasar yang dipakai oleh kontrol search & sort di dalam toolbar.
   * Default `"/products"` agar listing global tetap kompatibel; route
   * turunan (`/products/account/{gameSlug}`, `/products/voucher/{platformSlug}`)
   * mengirim path-nya sendiri supaya navigasi tidak lompat balik ke listing
   * global.
   */
  basePath?: string;
  className?: string;
}

/**
 * Server-rendered toolbar shell. Hosts the (client) search + sort controls and
 * a live result count. The Client Components inside read state from the
 * passed-in `query` (sourced from the URL) so the server stays the single
 * source of truth.
 */
export function ProductListingToolbar({
  query,
  total,
  leadingSlot,
  basePath = "/products",
  className,
}: ProductListingToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4",
        className,
      )}
    >
      <ProductSearchInput
        query={query}
        basePath={basePath}
        className="w-full sm:max-w-md sm:flex-1"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 sm:ml-auto sm:flex-nowrap">
        {leadingSlot}
        <p className="text-xs text-fg-muted sm:text-sm" aria-live="polite">
          <span className="font-semibold tabular-nums text-fg">
            {RESULT_FORMATTER.format(total)}
          </span>{" "}
          produk ditemukan
        </p>
        <ProductSortSelect query={query} basePath={basePath} />
      </div>
    </div>
  );
}
