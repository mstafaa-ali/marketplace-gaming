import "server-only";
import {
  MOCK_FAQ,
  MOCK_PROMOS,
  MOCK_TESTIMONIALS,
} from "@/lib/data/mock-content";
import type { FaqItem, PromoSlide, Testimonial } from "@/lib/types/common";

export async function getPromoSlides(): Promise<PromoSlide[]> {
  // "use cache" / cacheLife("hours") / cacheTag("promos")
  return MOCK_PROMOS;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  // "use cache" / cacheLife("days") / cacheTag("testimonials")
  return MOCK_TESTIMONIALS;
}

export async function getFaqItems(): Promise<FaqItem[]> {
  // "use cache" / cacheLife("days") / cacheTag("faq")
  return MOCK_FAQ;
}
