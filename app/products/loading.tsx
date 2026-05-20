import { DEFAULT_PER_PAGE } from "@/lib/constants/products";

/**
 * Listing skeleton. Mirrors the final layout (header, toolbar, grid) so the
 * page swap doesn't shift content. Rendered automatically by the App Router
 * during navigation transitions.
 */
export default function ProductListingLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-bg-overlay" />
        <div className="h-9 w-72 animate-pulse rounded-md bg-bg-overlay sm:h-10" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-bg-overlay" />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <div className="h-10 w-full animate-pulse rounded-md bg-bg-overlay sm:max-w-md sm:flex-1" />
        <div className="flex items-center justify-between gap-3 sm:ml-auto">
          <div className="h-4 w-28 animate-pulse rounded bg-bg-overlay" />
          <div className="h-10 w-36 animate-pulse rounded-md bg-bg-overlay" />
        </div>
      </div>

      <ul
        role="list"
        className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6"
      >
        {Array.from({ length: DEFAULT_PER_PAGE }).map((_, idx) => (
          <li key={idx}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated">
      <div className="aspect-4/3 w-full animate-pulse bg-bg-overlay" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <div className="h-4 w-4/5 animate-pulse rounded bg-bg-overlay" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-bg-overlay" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-16 animate-pulse rounded-full bg-bg-overlay" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-bg-overlay" />
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="h-5 w-24 animate-pulse rounded bg-bg-overlay" />
          <div className="size-8 animate-pulse rounded-full bg-bg-overlay" />
        </div>
      </div>
    </div>
  );
}
