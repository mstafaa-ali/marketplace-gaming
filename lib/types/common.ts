export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  rating: number;
  message: string;
  game?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PromoSlide {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** Tailwind gradient classes for the slide background until imagery is ready. */
  gradient: string;
  badge?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  qty: number;
  thumbnailUrl?: string;
}
