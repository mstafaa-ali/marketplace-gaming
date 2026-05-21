"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const AUTOPLAY_INTERVAL_MS = 5000;

const heroImages = [
  "/image/genshin-2.jpeg",
  "/image/hero-1.png",
  "/image/hero-2.png",
];

export function HeroCarouselTrack() {
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
      align: "start",
      skipSnaps: false,
    },
    plugins,
  );

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
    () => emblaApi?.scrollSnapList().length ?? heroImages.length,
    () => heroImages.length,
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <section className="relative isolate h-[50vh] w-full overflow-hidden">
      {/* Background image carousel */}
      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {heroImages.map((src, idx) => (
            <div
              key={src}
              className="relative min-w-0 shrink-0 grow-0 basis-full h-full"
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Static content */}
      <div className="relative z-10 left-80 flex h-full w-1/2 flex-col items-start justify-center gap-6 px-4 text-left">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          Top up game, voucher, dan akun
          <span className="bg-linear-to-r from-violet-300 via-purple-400 to-violet-400 bg-clip-text text-transparent">
            {" "}
            tanpa drama.
          </span>
        </h1>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/products">
              Jelajahi Produk
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/products?category=topup">Mulai Top Up</Link>
          </Button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {Array.from({ length: snapCount }).map((_, idx) => {
          const selected = idx === selectedIndex;
          return (
            <button
              key={idx}
              type="button"
              aria-label={`Tampilkan slide ${idx + 1}`}
              onClick={() => scrollTo(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                selected ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75",
              )}
            />
          );
        })}
      </div>
    </section>
  );
}
