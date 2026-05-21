import { Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTestimonials } from "@/lib/data/content";
import { cn } from "@/lib/utils/cn";
import type { Testimonial } from "@/lib/types/common";

const RATING_FORMATTER = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const RATING_COUNT_FORMATTER = new Intl.NumberFormat("id-ID");
const TOTAL_STARS = 5;

/**
 * Server component for the landing page "Testimoni Customer" section.
 * Reads from the cached data layer (`getTestimonials`) so it stays
 * cacheable when Cache Components is enabled later.
 */
export async function TestimonialGrid() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  const totalReviews = testimonials.length;
  const averageRating =
    testimonials.reduce((acc, item) => acc + item.rating, 0) / totalReviews;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="container-page py-12 sm:py-16"
    >
      <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-300">
            Testimoni Customer
          </p>
          <h2
            id="testimonials-heading"
            className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Kata mereka yang sudah top up & beli akun
          </h2>
          <p className="max-w-xl text-sm text-fg-muted">
            Pengalaman jujur dari pelanggan GameVault — mulai dari top up
            harian, bundling voucher, sampai akun premium dengan garansi
            anti-minus.
          </p>
        </div>

        <div
          className="flex items-center gap-3 self-start rounded-xl border border-border bg-bg-elevated/70 px-4 py-3 backdrop-blur sm:self-end"
          aria-label={`Rata-rata rating ${RATING_FORMATTER.format(averageRating)} dari 5 berdasarkan ${RATING_COUNT_FORMATTER.format(totalReviews)} ulasan`}
        >
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-full bg-accent-amber/15 text-accent-amber"
          >
            <Star className="size-4 fill-accent-amber" strokeWidth={1.5} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold tabular-nums text-fg">
              {RATING_FORMATTER.format(averageRating)}
              <span className="text-sm font-normal text-fg-subtle">/5</span>
            </p>
            <p className="text-xs text-fg-subtle">
              {RATING_COUNT_FORMATTER.format(totalReviews)} ulasan terverifikasi
            </p>
          </div>
        </div>
      </header>

      <ul
        role="list"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className="h-full">
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = getInitials(testimonial.name);
  const ratingLabel = `Rating ${testimonial.rating} dari ${TOTAL_STARS}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-border bg-bg-elevated p-5",
        "transition-all duration-(--duration-base) ease-snappy",
        "hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-glow",
      )}
    >
      <Quote
        className="size-8 text-violet-500/30 transition-colors group-hover:text-violet-400/60"
        strokeWidth={1.5}
        aria-hidden
      />

      <blockquote className="text-sm leading-6 text-fg-muted">
        <p className="line-clamp-5">&ldquo;{testimonial.message}&rdquo;</p>
      </blockquote>

      <div
        className="flex items-center gap-1 text-accent-amber"
        role="img"
        aria-label={ratingLabel}
      >
        {Array.from({ length: TOTAL_STARS }).map((_, idx) => {
          const filled = idx < testimonial.rating;
          return (
            <Star
              key={idx}
              className={cn(
                "size-3.5",
                filled ? "fill-accent-amber" : "text-fg-subtle/40",
              )}
              strokeWidth={1.5}
              aria-hidden
            />
          );
        })}
      </div>

      <footer className="mt-auto flex items-center gap-3 border-t border-border/70 pt-4">
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-full bg-linear-to-br from-violet-500 to-purple-500 font-display text-sm font-semibold text-white"
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-fg">
            {testimonial.name}
          </p>
          <p className="truncate text-xs text-fg-subtle">
            {testimonial.handle}
          </p>
        </div>
        {testimonial.game ? (
          <Badge variant="primary" className="shrink-0 normal-case">
            {testimonial.game}
          </Badge>
        ) : null}
      </footer>
    </article>
  );
}

/**
 * Returns up to two uppercase initials from a person's name. Falls back to
 * the first letter when only a single token is available so the avatar
 * placeholder is never empty.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
