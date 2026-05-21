import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/lib/types/product";

interface ProductGridProps {
  items: Product[];
  className?: string;
}

/**
 * Pure presentational grid for the listing page. Server Component — keeps
 * the heavy product DOM out of any client bundle.
 */
export function ProductGrid({ items, className }: ProductGridProps) {
  return (
    <ul
      role="list"
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6",
        className,
      )}
    >
      {items.map((product, index) => (
        <li key={product.id} className="h-full">
          {/* First two cards above the fold get LCP priority. */}
          <ProductCard
            product={product}
            priority={index < 2}
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
        </li>
      ))}
    </ul>
  );
}
