export type ProductCategory = "account" | "topup" | "voucher";
export type StockStatus = "ready" | "sold_out";

export interface PriceInfo {
  currency: "IDR";
  amount: number;
  originalAmount?: number;
  discountPercent?: number;
}

export interface MediaItem {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: ProductCategory;
  gameSlug: string;
  gameName: string;
  coverImage: MediaItem;
  media: MediaItem[];
  price: PriceInfo;
  stockStatus: StockStatus;
  highlights: string[];
  specs: Record<string, string>;
  rating?: { average: number; count: number };
  createdAt: string;
}

export interface ProductQuery {
  q?: string;
  games: string[];
  category?: ProductCategory;
  sort: "price_asc" | "price_desc" | "newest";
  min?: number;
  max?: number;
  page: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
