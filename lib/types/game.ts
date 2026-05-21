export interface Game {
  slug: string;
  name: string;
  publisher: string;
  /** Lucide icon name used by the popular game grid until real logos arrive. */
  icon: string;
  /** Tailwind gradient classes for the placeholder card background. */
  accent: string;
  /** Optional cover image path (relative to /public). Shown instead of icon when provided. */
  image?: string;
  productCount: number;
}
