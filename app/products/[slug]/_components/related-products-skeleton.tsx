/**
 * Skeleton fallback for the RelatedProducts Suspense boundary.
 * Mirrors the 4-column grid layout of the actual component.
 */
export function RelatedProductsSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      <div className="h-7 w-40 animate-pulse rounded bg-bg-overlay" />
      <ul
        role="list"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
