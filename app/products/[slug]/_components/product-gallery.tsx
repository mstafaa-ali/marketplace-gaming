"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { MediaItem } from "@/lib/types/product";

export interface ProductGalleryProps {
  media: MediaItem[];
  productTitle: string;
}

/**
 * Product image gallery with thumbnail strip. Supports keyboard navigation
 * (ArrowLeft/ArrowRight) when the gallery container is focused.
 */
export function ProductGallery({ media, productTitle }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, media.length - 1));
      setActiveIndex(clamped);
    },
    [media.length],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    },
    [activeIndex, goTo],
  );

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;
    const thumb = container.children[activeIndex] as HTMLElement | undefined;
    if (thumb) {
      thumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);

  const current = media[activeIndex];

  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-bg-elevated"
      role="group"
      aria-roledescription="Galeri gambar"
      aria-label={`Galeri ${productTitle}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Main image */}
      <div className="relative aspect-4/3 w-full bg-bg-overlay">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority={activeIndex === 0}
          className="object-cover transition-opacity duration-(--duration-base) ease-snappy"
        />

        {/* Image counter */}
        {media.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-sm">
            {activeIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {media.length > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto p-3"
          role="tablist"
          aria-label="Pilih gambar"
        >
          {media.map((item, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Gambar ${idx + 1} dari ${media.length}`}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-(--duration-base) ease-snappy",
                idx === activeIndex
                  ? "border-violet-400 shadow-glow"
                  : "border-border hover:border-violet-500/50",
              )}
            >
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
