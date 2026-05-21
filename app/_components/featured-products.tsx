import { ChevronRight, Flame } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/lib/data/products";

/**
 * Async Server Component. Reads from the cached data layer
 * (`getFeaturedProducts`) so the section is render-once-per-revalidate
 * once Cache Components are enabled. Wrapped in a `<Suspense>` boundary
 * by the page so streaming stays smooth even with cold caches.
 */
export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="container-page py-12 sm:py-16"
    >
      <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="space-y-2">
          <Badge variant="promo" className="uppercase tracking-wider">
            <Flame className="size-3.5" strokeWidth={2.25} aria-hidden />
            Flash Sale
          </Badge>
          <h2
            id="featured-products-heading"
            className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Produk pilihan yang lagi diburu
          </h2>
          <p className="max-w-xl text-sm text-fg-muted">
            Akun, top up, dan voucher dengan harga terbaik minggu ini. Stok
            dikurasi langsung tim LootBox dan dijaga 100% anti-minus.
          </p>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="self-start sm:self-end"
        >
          <Link href="/products?sort=newest">
            Lihat semua produk
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </header>

      <ul
        role="list"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product) => (
          <li key={product.id} className="h-full">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
