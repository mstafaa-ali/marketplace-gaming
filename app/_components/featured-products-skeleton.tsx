/**
 * Suspense fallback for `FeaturedProducts`. Mirrors the eventual layout
 * (header + 4-column grid on desktop) to avoid layout shift while the
 * server component streams in.
 */
export function FeaturedProductsSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      aria-label="Memuat produk pilihan"
      className="container-page py-12 sm:py-16"
    >
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="space-y-3">
          <div className="h-5 w-24 animate-pulse rounded-full bg-bg-overlay" />
          <div className="h-8 w-72 max-w-full animate-pulse rounded-md bg-bg-overlay" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-bg-overlay" />
        </div>
        <div className="h-9 w-40 animate-pulse rounded-md bg-bg-overlay" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-xl border border-border bg-bg-elevated"
          >
            <div className="aspect-4/3 w-full animate-pulse bg-bg-overlay" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-4/5 animate-pulse rounded-md bg-bg-overlay" />
              <div className="h-3 w-2/3 animate-pulse rounded-md bg-bg-overlay" />
              <div className="flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-bg-overlay" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-bg-overlay" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-28 animate-pulse rounded-md bg-bg-overlay" />
                <div className="h-5 w-12 animate-pulse rounded-md bg-bg-overlay" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
