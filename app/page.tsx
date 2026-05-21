import { Suspense } from "react";
import { CtaClosing } from "./_components/cta-closing";
import { FaqAccordion } from "./_components/faq-accordion";
import { FeaturedProducts } from "./_components/featured-products";
import { FeaturedProductsSkeleton } from "./_components/featured-products-skeleton";
import { HeroSection } from "./_components/hero-section";
import { PopularGameGrid } from "./_components/popular-game-grid";
import { PromoCarousel } from "./_components/promo-carousel";
import { TestimonialGrid } from "./_components/testimonial-grid";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PromoCarousel />
      <PopularGameGrid />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <TestimonialGrid />
      <FaqAccordion />
      <CtaClosing />
    </>
  );
}
