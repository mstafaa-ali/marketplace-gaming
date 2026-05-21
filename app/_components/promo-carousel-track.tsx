"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useMemo, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { PromoSlide } from "@/lib/types/common";

const AUTOPLAY_INTERVAL_MS = 6000;

interface PromoCarouselTrackProps {
  slides: PromoSlide[];
  ariaLabel?: string;
}

export function PromoCarouselTrack({
  slides,
  ariaLabel = "Promo carousel",
}: PromoCarouselTrackProps) {
  const labelId = useId();

  // Stable plugin instance for the lifetime of this component. Using useMemo
  // (instead of a ref) keeps us compatible with React 19's `react-hooks/refs`.
  const plugins = useMemo(
    () => [
      Autoplay({
        delay: AUTOPLAY_INTERVAL_MS,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ],
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
    },
    plugins,
  );

  // Subscribe to Embla via useSyncExternalStore so we don't trigger
  // `set-state-in-effect`. Embla fires `select` on snap changes and
  // `reInit` whenever options/slides change.
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("select", onStoreChange);
      emblaApi.on("reInit", onStoreChange);
      return () => {
        emblaApi.off("select", onStoreChange);
        emblaApi.off("reInit", onStoreChange);
      };
    },
    [emblaApi],
  );

  const selectedIndex = useSyncExternalStore(
    subscribe,
    () => emblaApi?.selectedScrollSnap() ?? 0,
    () => 0,
  );
  const snapCount = useSyncExternalStore(
    subscribe,
    () => emblaApi?.scrollSnapList().length ?? slides.length,
    () => slides.length,
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-labelledby={labelId}
      className="relative"
    >
      <span id={labelId} className="sr-only">
        Promo dan penawaran spesial GameVault
      </span>

      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <ul className="flex touch-pan-y -ml-4">
            {slides.map((slide, idx) => (
              <li
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} dari ${slides.length}`}
                className="min-w-0 shrink-0 grow-0 basis-[80%] pl-4 sm:basis-[60%] lg:basis-[50%] xl:basis-[45%]"
              >
                <article
                  className={cn(
                    "group relative h-full overflow-hidden rounded-2xl border border-white/10",
                    "p-6 sm:p-10",
                  )}
                >
                  {/* Background image */}
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 70vw, 50vw"
                  />

                  {/* Gradient overlay for text readability */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-linear-to-br",
                      slide.gradient,
                    )}
                  />

                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-black/20 blur-3xl"
                  />

                  <div className="relative flex h-full flex-col justify-between gap-6 text-white">
                    <div className="space-y-3 w-fit">
                      {slide.badge ? (
                        <Badge
                          variant="primary"
                          className="border-white/30 bg-white/15 text-white uppercase tracking-wider backdrop-blur"
                        >
                          {slide.badge}
                        </Badge>
                      ) : null}
                      <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-3xl md:text-4xl">
                        {slide.title}
                      </h3>
                      <p className="max-w-md text-sm text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:text-base">
                        {slide.description}
                      </p>
                    </div>

                    <div>
                      <Button
                        asChild
                        size="lg"
                        variant="secondary"
                        className="bg-white text-violet-900 hover:bg-white/90 focus-visible:outline-white"
                      >
                        <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Pilih slide promo"
          className="flex items-center gap-2"
        >
          {Array.from({ length: snapCount }).map((_, idx) => {
            const selected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Tampilkan slide ${idx + 1}`}
                onClick={() => scrollTo(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-(--duration-base) ease-snappy",
                  selected
                    ? "w-8 bg-violet-300"
                    : "w-3 bg-border-strong hover:bg-violet-400/60",
                )}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Slide sebelumnya"
            onClick={scrollPrev}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Slide berikutnya"
            onClick={scrollNext}
          >
            <ChevronRight className="size-5" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
