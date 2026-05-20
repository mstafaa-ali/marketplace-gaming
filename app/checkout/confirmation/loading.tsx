/**
 * Confirmation page loading skeleton. Mirrors the success layout
 * (icon header → meta cards → summary → payment → instructions → CTAs).
 */
export default function ConfirmationLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Breadcrumb skeleton */}
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-bg-overlay" />

      {/* Success header skeleton */}
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="size-16 animate-pulse rounded-full bg-bg-overlay" />
        <div className="h-8 w-64 animate-pulse rounded-md bg-bg-overlay" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-bg-overlay" />
      </div>

      {/* Meta cards skeleton (order id + date) */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl border border-border bg-bg-elevated p-5"
          >
            <div className="h-3 w-24 animate-pulse rounded bg-bg-overlay" />
            <div className="h-5 w-44 animate-pulse rounded bg-bg-overlay" />
          </div>
        ))}
      </div>

      {/* Order summary skeleton */}
      <div className="mt-6 space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
        <div className="h-5 w-44 animate-pulse rounded bg-bg-overlay" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-12 animate-pulse rounded-md bg-bg-overlay" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-bg-overlay" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-bg-overlay" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex justify-between">
            <div className="h-3.5 w-16 animate-pulse rounded bg-bg-overlay" />
            <div className="h-3.5 w-24 animate-pulse rounded bg-bg-overlay" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-12 animate-pulse rounded bg-bg-overlay" />
            <div className="h-4 w-28 animate-pulse rounded bg-bg-overlay" />
          </div>
        </div>
      </div>

      {/* Payment + instructions skeleton */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
          <div className="h-5 w-40 animate-pulse rounded bg-bg-overlay" />
          <div className="h-16 animate-pulse rounded-lg bg-bg-overlay" />
        </div>
        <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
          <div className="h-5 w-44 animate-pulse rounded bg-bg-overlay" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-3.5 w-full animate-pulse rounded bg-bg-overlay"
            />
          ))}
        </div>
      </div>

      {/* CTAs skeleton */}
      <div className="mt-8 flex flex-wrap gap-3">
        <div className="h-11 w-44 animate-pulse rounded-md bg-bg-overlay" />
        <div className="h-11 w-44 animate-pulse rounded-md bg-bg-overlay" />
      </div>
    </div>
  );
}
