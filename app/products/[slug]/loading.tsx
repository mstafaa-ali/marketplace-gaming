/**
 * Skeleton for the product detail page. Mirrors the 2-column layout so
 * content doesn't shift on hydration.
 */
export default function ProductDetailLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3.5 w-12 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-3 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-14 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-3 animate-pulse rounded bg-bg-overlay" />
        <div className="h-3.5 w-40 animate-pulse rounded bg-bg-overlay" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-8">
          {/* Gallery skeleton */}
          <div className="overflow-hidden rounded-xl border border-border bg-bg-elevated">
            <div className="aspect-4/3 w-full animate-pulse bg-bg-overlay" />
            <div className="flex gap-2 p-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="size-16 shrink-0 animate-pulse rounded-md bg-bg-overlay"
                />
              ))}
            </div>
          </div>

          {/* Specs skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded bg-bg-overlay" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-bg-overlay" />
                  <div className="h-4 w-40 animate-pulse rounded bg-bg-overlay" />
                </div>
              ))}
            </div>
          </div>

          {/* Highlights skeleton */}
          <div className="space-y-3">
            <div className="h-6 w-28 animate-pulse rounded bg-bg-overlay" />
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-lg bg-bg-overlay"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: buy card skeleton */}
        <aside>
          <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
            <div className="space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-bg-overlay" />
              <div className="h-5 w-full animate-pulse rounded bg-bg-overlay" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-bg-overlay" />
            </div>
            <div className="h-8 w-36 animate-pulse rounded bg-bg-overlay" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-bg-overlay" />
            <div className="h-11 w-full animate-pulse rounded-md bg-bg-overlay" />
            <div className="h-3 w-48 animate-pulse rounded bg-bg-overlay mx-auto" />
          </div>
        </aside>
      </div>
    </div>
  );
}
