import { Suspense } from "react";
import { FeaturedProducts } from "./_components/featured-products";
import { FeaturedProductsSkeleton } from "./_components/featured-products-skeleton";
import { HeroSection } from "./_components/hero-section";
import { PopularGameGrid } from "./_components/popular-game-grid";
import { PromoCarousel } from "./_components/promo-carousel";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PromoCarousel />
      <PopularGameGrid />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      <section className="container-page py-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Roadmap berikutnya
        </h2>
        <p className="mt-2 text-fg-muted">
          Hero, Promo Carousel, Popular Games, dan Featured Products siap.
          Berikutnya: Testimoni, FAQ.
        </p>
      </section>
    </>
  );
}
