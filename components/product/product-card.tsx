import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DiscountBadge } from "@/components/common/discount-badge";
import { PriceTag } from "@/components/common/price-tag";
import { StockBadge } from "@/components/common/stock-badge";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/lib/types/product";

const RATING_FORMATTER = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const RATING_COUNT_FORMATTER = new Intl.NumberFormat("id-ID");

const CATEGORY_LABELS: Record<Product["category"], string> = {
  account: "Akun",
  topup: "Top Up",
  voucher: "Voucher",
};

export interface ProductCardProps {
  product: Product;
  /**
   * Hint for `next/image` so the optimizer requests sensibly sized variants.
   * Override per layout when the grid differs from the listing default.
   */
  sizes?: string;
  /** Optional priority hint for the LCP candidate above the fold. */
  priority?: boolean;
  className?: string;
}

/**
 * Reusable product tile used across landing (`FeaturedProducts`) and the
 * `/products` listing. Renders as a single accessible link via the
 * stretched-link pattern, so the entire card is clickable without nested
 * interactives.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  priority = false,
  className,
}: ProductCardProps) {
  const isSoldOut = product.stockStatus === "sold_out";
  const discount = product.price.discountPercent ?? 0;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated",
        "transition-all duration-(--duration-base) ease-snappy",
        "hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-glow",
        "focus-within:-translate-y-0.5 focus-within:border-violet-400 focus-within:shadow-glow",
        isSoldOut && "opacity-90",
        className,
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-bg-overlay">
        <Image
          src={product.coverImage.url}
          alt={product.coverImage.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-(--duration-slow) ease-snappy",
            "group-hover:scale-[1.03]",
            isSoldOut && "grayscale-35",
          )}
        />

        {/* Top-left: discount badge */}
        {discount > 0 ? (
          <div className="absolute left-3 top-3 z-10">
            <DiscountBadge percent={discount} withIcon />
          </div>
        ) : null}

        {/* Top-right: stock status */}
        <div className="absolute right-3 top-3 z-10">
          <StockBadge status={product.stockStatus} />
        </div>

        {/* Bottom gradient for legibility of the category chip */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/60 via-black/15 to-transparent"
        />
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2">
          <Badge
            variant="neutral"
            className="border-white/20 bg-black/40 text-white backdrop-blur"
          >
            {CATEGORY_LABELS[product.category]}
          </Badge>
          {/* `gameName` opsional sejak Fase A task 3.3 — voucher tidak punya
              game. Skip label saat tidak tersedia agar tidak merender
              "undefined" pada card voucher. */}
          {product.gameName ? (
            <span className="text-xs font-medium text-white/85">
              {product.gameName}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1.5">
          <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-fg">
            <Link
              href={`/products/${product.slug}`}
              aria-label={`${product.title} — lihat detail produk`}
              className={cn(
                "line-clamp-2 outline-none transition-colors",
                "hover:text-violet-300",
                // Stretched link: makes the whole card clickable while keeping
                // a single interactive child for keyboard + screen readers.
                "before:absolute before:inset-0 before:rounded-xl before:content-['']",
                "focus-visible:before:outline-2 focus-visible:before:outline-offset-2 focus-visible:before:outline-violet-400",
              )}
            >
              {product.title}
            </Link>
          </h3>
          <p className="line-clamp-1 text-xs text-fg-subtle">
            {product.shortDescription}
          </p>
        </div>

        {product.highlights.length > 0 ? (
          <ul aria-label="Highlight produk" className="flex flex-wrap gap-1.5">
            {product.highlights.slice(0, 3).map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-bg-overlay px-2 py-0.5 text-[11px] text-fg-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <PriceTag
            amount={product.price.amount}
            originalAmount={product.price.originalAmount}
            size="md"
          />
          {product.rating ? (
            <div
              className="inline-flex items-center gap-1 text-xs text-fg-muted"
              aria-label={`Rating ${RATING_FORMATTER.format(product.rating.average)} dari 5, ${RATING_COUNT_FORMATTER.format(product.rating.count)} ulasan`}
            >
              <Star
                className="size-3.5 fill-accent-amber text-accent-amber"
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="font-semibold tabular-nums text-fg">
                {RATING_FORMATTER.format(product.rating.average)}
              </span>
              <span className="tabular-nums text-fg-subtle">
                ({RATING_COUNT_FORMATTER.format(product.rating.count)})
              </span>
            </div>
          ) : (
            <span
              aria-hidden
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full border border-border bg-bg-overlay text-fg-muted",
                "transition-colors duration-(--duration-base) ease-snappy",
                "group-hover:border-violet-400 group-hover:text-violet-300",
              )}
            >
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
