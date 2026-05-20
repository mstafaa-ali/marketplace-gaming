import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ProductQuery } from "@/lib/types/product";
import { buildProductsHref } from "@/lib/utils/product-query";

interface ProductPaginationProps {
  query: ProductQuery;
  page: number;
  totalPages: number;
  className?: string;
}

/**
 * Build a windowed list of pages: always show 1 and last, the current page
 * plus its immediate neighbors, and inject "..." as `null` markers.
 */
function buildPageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current]);
  for (let delta = 1; delta <= 1; delta += 1) {
    if (current - delta > 1) pages.add(current - delta);
    if (current + delta < total) pages.add(current + delta);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | null)[] = [];
  let prev: number | undefined;
  for (const p of sorted) {
    if (prev !== undefined && p - prev > 1) result.push(null);
    result.push(p);
    prev = p;
  }
  return result;
}

/**
 * Server-rendered pagination. Pure links so prefetch works and search engines
 * can crawl deeper pages. State (other filters) is preserved via
 * `buildProductsHref`.
 */
export function ProductPagination({
  query,
  page,
  totalPages,
  className,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const window = buildPageWindow(page, totalPages);
  const prevHref =
    page > 1 ? buildProductsHref(query, { page: page - 1 }) : undefined;
  const nextHref =
    page < totalPages
      ? buildProductsHref(query, { page: page + 1 })
      : undefined;

  return (
    <nav
      aria-label="Halaman produk"
      className={cn(
        "flex flex-wrap items-center justify-center gap-1.5 sm:gap-2",
        className,
      )}
    >
      <PaginationLink
        href={prevHref}
        disabled={!prevHref}
        ariaLabel="Halaman sebelumnya"
      >
        <ChevronLeft className="size-4" aria-hidden />
        <span className="hidden sm:inline">Sebelumnya</span>
      </PaginationLink>

      <ol className="flex items-center gap-1.5 sm:gap-2" role="list">
        {window.map((p, idx) =>
          p === null ? (
            <li
              key={`ellipsis-${idx}`}
              aria-hidden
              className="px-2 text-sm text-fg-subtle"
            >
              …
            </li>
          ) : (
            <li key={p}>
              <PaginationLink
                href={buildProductsHref(query, { page: p })}
                active={p === page}
                ariaLabel={`Halaman ${p}`}
              >
                <span className="tabular-nums">{p}</span>
              </PaginationLink>
            </li>
          ),
        )}
      </ol>

      <PaginationLink
        href={nextHref}
        disabled={!nextHref}
        ariaLabel="Halaman berikutnya"
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <ChevronRight className="size-4" aria-hidden />
      </PaginationLink>
    </nav>
  );
}

interface PaginationLinkProps {
  href?: string;
  active?: boolean;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

function PaginationLink({
  href,
  active,
  disabled,
  ariaLabel,
  children,
}: PaginationLinkProps) {
  const baseClasses = cn(
    "inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium",
    "border border-border bg-bg-overlay text-fg-muted",
    "transition-colors duration-(--duration-base) ease-snappy",
    !disabled && !active && "hover:border-violet-400 hover:text-fg",
    active &&
      "border-violet-500 bg-violet-500/15 text-violet-100 shadow-sm pointer-events-none",
    disabled && "cursor-not-allowed opacity-40",
  );

  if (!href || disabled) {
    return (
      <span aria-disabled="true" aria-label={ariaLabel} className={baseClasses}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      scroll={false}
      className={baseClasses}
    >
      {children}
    </Link>
  );
}
