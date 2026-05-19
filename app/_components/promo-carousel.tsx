import { getPromoSlides } from "@/lib/data/content";
import { PromoCarouselTrack } from "./promo-carousel-track";

export async function PromoCarousel() {
  const slides = await getPromoSlides();

  if (slides.length === 0) return null;

  return (
    <section
      aria-labelledby="promo-heading"
      className="container-page py-12 sm:py-16"
    >
      <header className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-violet-300">
            Promo & Bundling
          </p>
          <h2
            id="promo-heading"
            className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Penawaran terbaik minggu ini
          </h2>
        </div>
        <p className="max-w-md text-sm text-fg-muted">
          Diskon top up, bundling voucher, dan akun pilihan dengan harga miring
          — diperbarui rutin oleh tim kurator.
        </p>
      </header>

      <PromoCarouselTrack slides={slides} ariaLabel="Promo unggulan" />
    </section>
  );
}
