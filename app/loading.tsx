export default function Loading() {
  return (
    <div className="container-page py-20" aria-busy="true" aria-live="polite">
      <div className="space-y-6">
        <div className="h-10 w-2/3 max-w-lg animate-pulse rounded-md bg-bg-overlay" />
        <div className="h-4 w-1/2 max-w-md animate-pulse rounded-md bg-bg-overlay" />
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 animate-pulse rounded-xl border border-border bg-bg-elevated"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
