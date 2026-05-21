/**
 * Checkout loading skeleton. Mirrors the 2-column layout (form + order summary).
 */
export default function CheckoutLoading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Breadcrumb skeleton */}
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-bg-overlay" />

      {/* Title skeleton */}
      <div className="h-8 w-48 animate-pulse rounded-md bg-bg-overlay" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-bg-overlay" />

      {/* 2-column layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Form skeleton */}
        <div className="space-y-6">
          {/* Customer info section */}
          <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
            <div className="h-5 w-36 animate-pulse rounded bg-bg-overlay" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3.5 w-20 animate-pulse rounded bg-bg-overlay" />
                  <div className="h-10 w-full animate-pulse rounded-md bg-bg-overlay" />
                </div>
              ))}
            </div>
          </div>

          {/* Payment section */}
          <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
            <div className="h-5 w-44 animate-pulse rounded bg-bg-overlay" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-bg-overlay"
                />
              ))}
            </div>
          </div>

          {/* Voucher section */}
          <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
            <div className="h-5 w-32 animate-pulse rounded bg-bg-overlay" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 animate-pulse rounded-md bg-bg-overlay" />
              <div className="h-10 w-24 animate-pulse rounded-md bg-bg-overlay" />
            </div>
          </div>
        </div>

        {/* Order summary skeleton */}
        <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
          <div className="h-5 w-36 animate-pulse rounded bg-bg-overlay" />
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
          <div className="h-11 w-full animate-pulse rounded-md bg-bg-overlay" />
        </div>
      </div>
    </div>
  );
}
