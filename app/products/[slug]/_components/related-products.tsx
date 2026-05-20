import { getRelatedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";

export interface RelatedProductsProps {
  gameSlug: string;
  excludeId: string;
}

/**
 * Async Server Component that fetches related products by game slug.
 * Wrapped in <Suspense> at the page level so it can stream independently.
 * The data call is cached (once cacheComponents is enabled).
 */
export async function RelatedProducts({
  gameSlug,
  excludeId,
}: RelatedProductsProps) {
  const products = await getRelatedProducts(gameSlug, excludeId, 4);

  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="space-y-5">
      <h2
        id="related-heading"
        className="font-display text-2xl font-semibold tracking-tight"
      >
        Produk Serupa
      </h2>
      <ul
        role="list"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      >
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
