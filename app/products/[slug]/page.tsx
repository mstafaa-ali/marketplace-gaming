import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug } from "@/lib/data/products";
import { ProductBuyCard } from "./_components/product-buy-card";
import { ProductGallery } from "./_components/product-gallery";
import { ProductSpecs } from "./_components/product-specs";
import { RelatedProducts } from "./_components/related-products";
import { RelatedProductsSkeleton } from "./_components/related-products-skeleton";

type Params = Promise<{ slug: string }>;

interface ProductDetailPageProps {
  params: Params;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: [
        {
          url: product.coverImage.url,
          width: product.coverImage.width,
          height: product.coverImage.height,
          alt: product.coverImage.alt,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="container-page py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fg-muted">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-fg focus-visible:text-fg"
            >
              Home
            </Link>
          </li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li>
            <Link
              href="/products"
              className="transition-colors hover:text-fg focus-visible:text-fg"
            >
              Produk
            </Link>
          </li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li>
            <span className="font-medium text-fg" aria-current="page">
              {product.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* Main content — 2 column on desktop */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left column: gallery + specs */}
        <div className="space-y-8">
          <ProductGallery media={product.media} productTitle={product.title} />
          <ProductSpecs product={product} />
        </div>

        {/* Right column: buy card */}
        <ProductBuyCard product={product} />
      </div>

      {/* Related products — streamed independently */}
      <div className="mt-12 border-t border-border pt-10">
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts gameSlug={product.gameSlug} excludeId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}
