# Feature Guideline — Digital Gaming Marketplace

Panduan pengerjaan fitur untuk front-end Digital Gaming Marketplace. Dokumen ini berorientasi pada **Next.js 16 App Router + React 19 + TypeScript strict + Tailwind CSS v4 + shadcn/ui + Zustand + Lucide React**, sesuai stack di `package.json`.

> Wajib baca lebih dulu:
>
> - `guideline/project-description.md` — scope produk
> - `guideline/styling-guideline.md` — design system & palette ungu
> - `node_modules/next/dist/docs/01-app/` — sumber kebenaran konvensi Next.js 16 di project ini

---

## 0. Prinsip Inti

1. **Server-first rendering.** Default-kan setiap route segment sebagai Server Component. Tambahkan `"use client"` hanya pada komponen yang butuh state, event handler, atau browser API.
2. **Cache Components mindset.** Next.js 16 sudah membawa model Cache Components. Data yang stabil dibungkus dengan directive `"use cache"` + `cacheLife()` + `cacheTag()`. Data runtime (cookie, header, stok real-time) dibungkus `<Suspense>`.
3. **Type-safe ketat.** `tsconfig.json` sudah `strict: true`. Dilarang `any`. Semua entitas (Game, Product, Voucher, TopUpItem, Review, FAQItem) didefinisikan di `lib/types/`.
4. **Mobile-first.** Mulai dari layout sempit, lalu naik ke `sm:` `md:` `lg:` `xl:`.
5. **Atomic, composable components.** Pisahkan presentational vs container. Komponen reusable masuk ke `components/ui/` (shadcn primitives) dan `components/common/`. Komponen domain masuk ke `components/<domain>/`.
6. **URL adalah state.** Filter, sort, page, search di Product Listing harus disinkronkan ke `searchParams`. Zustand hanya untuk UI state ephemeral (drawer terbuka, hover, optimistic UI).
7. **Aksesibilitas.** Semua interaktif minimal AA: kontras ≥ 4.5:1, focus ring jelas, label form, `aria-*` di komponen kustom, navigasi keyboard. Kombinasikan dengan primitives Radix dari shadcn.
8. **SEO terukur.** Setiap route punya `metadata` atau `generateMetadata`. Halaman publik wajib punya OG image (file convention `opengraph-image`) dan title yang unik.

---

## 1. Roadmap Pengerjaan (Build Order)

Kerjakan secara bertahap. Setiap tahap harus _runnable_ dan ter-lint bersih sebelum lanjut.

> Status legend: ✅ selesai · 🟡 sedang dikerjakan · ⬜ belum mulai

### Tahap 1 — Foundation ✅

- [x] Set up design tokens & global CSS (lihat `styling-guideline.md`). → `app/globals.css` dengan `@theme` + variabel surface/foreground per tema (dark default + `.light`).
- [x] Install dependencies fondasi: `zustand`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `next-themes`, `@radix-ui/react-slot`.
- [x] Bentuk struktur folder dasar (lihat §3): `app/`, `components/{ui,common,layout,providers}`, `lib/{types,data,utils}`, `hooks/`, `stores/`.
- [x] Definisikan tipe domain di `lib/types/`: `product.ts`, `game.ts`, `common.ts`.
- [x] Buat mock data di `lib/data/mock-*.ts` dan data access layer (`getFeaturedProducts`, `getProductBySlug`, `getRelatedProducts`, `searchProducts`, `getPopularGames`, `getPromoSlides`, `getTestimonials`, `getFaqItems`). Directive `"use cache"` + `cacheLife/cacheTag` ditandai sebagai komentar siap-aktif saat `cacheComponents: true` di-enable.
- [x] Komponen UI dasar: `components/ui/button.tsx` (variants via CVA + Radix Slot), `components/ui/badge.tsx`. Komponen common: `price-tag.tsx`, `stock-badge.tsx`, `theme-toggle.tsx`.
- [x] Hook `useHydrated` (`useSyncExternalStore`) untuk gating client-only state — kompatibel dengan rule React 19 `react-hooks/set-state-in-effect`.
- [x] Zustand store `stores/cart-store.ts` dengan `persist` (`gm-cart`).

> **Catatan:** shadcn/ui CLI belum di-init. Komponen UI dibuat manual dengan pola yang sama (Radix Slot + CVA) supaya aman ditimpa atau ditambah lewat `npx shadcn@latest add` di kemudian hari tanpa konflik. Tema sudah memetakan variabel `--primary`, `--ring`, `--card`, `--popover`, dst., jadi shadcn primitives langsung mengikuti palette ungu.

### Tahap 2 — Global Layout ✅

- [x] `components/layout/site-header.tsx` (Server Component shell) — logo, primary nav, slot search, theme toggle, cart, profile.
- [x] `components/layout/global-search.tsx` (`"use client"`) — form search yang push ke `/products?q=...`.
- [x] `components/layout/cart-button.tsx` (`"use client"`) — badge counter dari Zustand, di-gate dengan `useHydrated`.
- [x] `components/layout/site-footer.tsx` — 4 kolom (brand, kategori, bantuan, legal).
- [x] `components/providers/theme-provider.tsx` — `next-themes` strategy `class`, default `system`, mendukung dark + light.
- [x] `app/layout.tsx`: metadata default + template, viewport theme-color dual (light/dark), font (Geist, Geist Mono, Space Grotesk), skip-to-content link.
- [x] `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅ (route `/` ter-prerender static).

> **Belum dikerjakan di Tahap 2:** `components/layout/mobile-nav.tsx` (Sheet drawer untuk navigasi mobile). Saat ini header sudah responsif (search row terpisah di mobile, nav links tersembunyi di < `lg`). Mobile nav drawer akan dibuat saat shadcn `Sheet` dipasang — dijadwalkan bersama Filter Drawer di Tahap 4 supaya satu kali setup Radix Dialog/Sheet.

### Tahap 3 — Landing Page (`/`) ⬜

Kerjakan section-by-section, masing-masing jadi komponen sendiri (lihat §4).

### Tahap 4 — Product Listing (`/products`) ⬜

- [ ] Server-render daftar awal dari `searchParams`.
- [ ] Sidebar filter (desktop) + Drawer filter (mobile, pakai shadcn Sheet).
- [ ] Mobile nav drawer (digabung dengan setup Sheet di tahap ini).
- [ ] Sorting + Search + Pagination via URL.
- [ ] Empty state, skeleton, error boundary.

### Tahap 5 — Product Detail (`/products/[slug]`) ⬜

- [ ] SSR per request (tanpa `use cache`) supaya stok real-time.
- [ ] Galeri media, tab spesifikasi, sticky CTA card.
- [ ] Related products (cached, di-`Suspense`).
- [ ] `generateMetadata` per slug.

### Tahap 6 — Polish ⬜

- [ ] Aktifkan `cacheComponents: true` di `next.config.ts` dan un-comment directive `"use cache"`/`cacheLife`/`cacheTag` di `lib/data/*.ts`.
- [ ] OG image dinamis (`opengraph-image.tsx`).
- [ ] `sitemap.ts`, `robots.ts`.
- [ ] Lighthouse audit (target Performance ≥ 90, Accessibility ≥ 95, SEO 100).
- [ ] Cross-browser & device check.

---

## 2. Strategi Rendering & Caching

| Halaman                       | Strategi                                                                                                                                                       | Alasan                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `/` Landing                   | Prerendered shell + cached sections (`"use cache"` + `cacheLife('hours')`)                                                                                     | Konten promosional, jarang berubah; loading harus instan untuk SEO          |
| `/products` Listing           | Server Component, query param drives SSR. Inner list bisa di-cache per kombinasi filter atau di-stream di `<Suspense>`                                         | Hasil filter umumnya bisa di-cache pendek; pagination konsisten via URL     |
| `/products/[slug]` Detail     | **Tidak** di-cache. Fetch dilakukan langsung di Server Component supaya `stockStatus` selalu real-time. `RelatedProducts` di-`<Suspense>` dengan `"use cache"` | Mencegah double-buy untuk akun game                                         |
| Section "Related" / "Popular" | `"use cache"` + `cacheTag('products')`                                                                                                                         | Murah di-invalidate via `revalidateTag('products')` saat ada perubahan stok |

Pola implementasi:

```ts
// lib/data/products.ts
import { cacheLife, cacheTag } from "next/cache";
import "server-only";
import type { Product } from "@/lib/types/product";

export async function getFeaturedProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", "products:featured");
  // ganti dengan query DB / API saat backend siap
  return MOCK_FEATURED;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // sengaja tanpa "use cache": stok harus real-time
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
```

Aktifkan Cache Components di `next.config.ts` saat siap:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

> Saat `cacheComponents: true`, semua data uncached harus berada di dalam `<Suspense>`. Build akan gagal kalau ada akses runtime tanpa boundary, jadi pastikan setiap komponen yang baca `cookies()`, `headers()`, `searchParams`, `params`, atau melakukan fetch tanpa `"use cache"` punya boundary.

---

## 3. Struktur Folder

Gunakan layout berikut. Folder hanya dibuat saat dibutuhkan; jangan buat folder kosong.

```
app/
├─ layout.tsx                  # Root layout, metadata default, font, provider
├─ globals.css                 # Tailwind v4 + design tokens
├─ page.tsx                    # Landing page
├─ loading.tsx
├─ error.tsx
├─ not-found.tsx
├─ opengraph-image.tsx         # OG default
├─ sitemap.ts
├─ robots.ts
├─ products/
│  ├─ page.tsx                 # Product Listing (server, baca searchParams)
│  ├─ loading.tsx
│  └─ [slug]/
│     ├─ page.tsx              # Product Detail (SSR per request)
│     ├─ loading.tsx
│     ├─ error.tsx
│     ├─ opengraph-image.tsx   # OG dinamis per produk
│     └─ _components/          # Komponen privat untuk halaman ini
└─ _components/                # Section landing privat (tidak routable)

components/
├─ ui/                         # shadcn primitives (Button, Card, Sheet, ...)
├─ common/                     # Reusable cross-domain (PriceTag, DiscountBadge, ...)
├─ layout/                     # SiteHeader, SiteFooter, MobileNav
└─ product/                    # ProductCard, ProductGallery, ProductFilterSidebar, ...

lib/
├─ types/                      # Product, Game, Voucher, TopUpItem, Review, FAQItem, Cart
├─ data/                       # Data access (cached) + mock data
├─ utils/                      # cn, formatCurrency, slugify, ...
└─ constants/                  # Enum game, sort options, dsb.

stores/
├─ cart-store.ts               # Zustand: cart UI state
└─ filter-store.ts             # Zustand: ephemeral filter draft (sebelum apply ke URL)

hooks/
├─ use-debounced-value.ts
└─ use-media-query.ts
```

Konvensi tambahan:

- Folder dengan prefix `_` (mis. `_components/`) **tidak routable**, aman untuk colocation.
- File komponen pakai `kebab-case.tsx`, default export PascalCase. Hooks `use-*.ts`.
- Path alias `@/*` sudah aktif di `tsconfig.json`.

---

## 4. Halaman 1 — Landing Page

Path: `app/page.tsx`. Server Component. Tidak boleh ada akses runtime di body utama; bagian dinamis harus di-`<Suspense>`.

### 4.1 Susunan Section

1. `HeroSection` — full-bleed banner gaming, headline persuasif, CTA primer ke `/products`, CTA sekunder ke kategori.
2. `PromoCarousel` — slider promo (Client Component, pakai `embla-carousel-react` atau `@radix-ui` patterns yang dipakai shadcn).
3. `PopularGameGrid` — grid kategori game (Mobile Legends, PUBG Mobile, Valorant, Genshin, dll).
4. `FeaturedProducts` — flash sale grid, 6–8 kartu, badge diskon, countdown opsional.
5. `TestimonialGrid` — kartu review/rating.
6. `FaqAccordion` — komponen Accordion shadcn.
7. CTA penutup + link ke listing.

### 4.2 Komponen yang Dibuat

- `app/_components/hero-section.tsx`
- `app/_components/promo-carousel.tsx` (`"use client"`)
- `app/_components/popular-game-grid.tsx`
- `app/_components/featured-products.tsx`
- `app/_components/testimonial-grid.tsx`
- `app/_components/faq-accordion.tsx`
- `components/product/product-card.tsx`
- `components/common/discount-badge.tsx`
- `components/common/price-tag.tsx`

### 4.3 Pola Data

Section data di-cache karena konten promo jarang berubah:

```tsx
// app/page.tsx
import { Suspense } from "react";
import HeroSection from "./_components/hero-section";
import PromoCarousel from "./_components/promo-carousel";
import PopularGameGrid from "./_components/popular-game-grid";
import FeaturedProducts from "./_components/featured-products";
import FeaturedProductsSkeleton from "./_components/featured-products-skeleton";
import TestimonialGrid from "./_components/testimonial-grid";
import FaqAccordion from "./_components/faq-accordion";

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
    </>
  );
}
```

`FeaturedProducts` adalah async Server Component yang memanggil `getFeaturedProducts()` (cached, lihat §2).

### 4.4 Definition of Done

- [ ] Lulus `npm run build` tanpa warning.
- [ ] LCP element punya `priority` (gunakan `next/image` dengan `priority` di hero).
- [ ] Semua gambar pakai `next/image`, tidak ada `<img>` mentah.
- [ ] Kontras teks vs background lulus AA.
- [ ] FAQ accordion bisa dinavigasi keyboard (Enter/Space toggle, Tab traversal).

---

## 5. Halaman 2 — Product Listing

Path: `app/products/page.tsx`. Server Component yang membaca `searchParams`.

### 5.1 URL sebagai Sumber Kebenaran

Dukung query param berikut:

- `q` — search keyword
- `game` — slug game (boleh multi: `game=mobile-legends&game=valorant`)
- `category` — `account` | `topup` | `voucher`
- `sort` — `price_asc` | `price_desc` | `newest`
- `min` / `max` — range harga (rupiah, integer)
- `page` — angka, default 1
- `perPage` — angka, default 12

`searchParams` di Next 16 adalah `Promise`. Harus di-`await`:

```tsx
// app/products/page.tsx
import type { Metadata } from "next";
import ProductGrid from "./_components/product-grid";
import ProductFilterSidebar from "./_components/product-filter-sidebar";
import ProductToolbar from "./_components/product-toolbar";
import { parseProductQuery } from "@/lib/utils/product-query";
import { searchProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Semua Produk",
  description: "Top up, voucher game, dan akun premium.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductListingPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const query = parseProductQuery(sp);
  const result = await searchProducts(query);

  return (
    <main className="container py-8 grid gap-6 lg:grid-cols-[260px_1fr]">
      <ProductFilterSidebar query={query} />
      <section className="space-y-4">
        <ProductToolbar query={query} total={result.total} />
        <ProductGrid items={result.items} />
      </section>
    </main>
  );
}
```

### 5.2 Komponen

- `app/products/_components/product-filter-sidebar.tsx` (`"use client"`) — pakai Zustand sebagai _draft state_, commit ke URL via `useRouter().push(`/products?${qs}`)` saat user klik "Terapkan". Versi mobile dibungkus `Sheet`.
- `app/products/_components/product-toolbar.tsx` (`"use client"`) — search input dengan `useDebouncedValue` (300ms), dropdown sort, total hits.
- `app/products/_components/product-grid.tsx` — grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`.
- `app/products/_components/pagination.tsx` (`"use client"`) — link-based pagination, mempertahankan query lain.

### 5.3 Filter & State

- Zustand store `filter-store.ts` hanya menampung _draft_ (sebelum apply). Setelah apply, baca dari URL.
- Untuk multi-select game, gunakan checkbox group; serialize jadi array di query string.
- Untuk debounce search: client component dengan `useEffect` yang `router.replace` setelah delay.

### 5.4 Definition of Done

- [ ] Refresh halaman tetap mempertahankan filter (karena state di URL).
- [ ] Link share-able: paste URL produktif menampilkan hasil yang sama.
- [ ] Skeleton tampil saat transisi route (`loading.tsx`).
- [ ] Empty state ramah ("Tidak ditemukan produk untuk filter ini").
- [ ] Pagination keyboard-accessible.

---

## 6. Halaman 3 — Product Detail

Path: `app/products/[slug]/page.tsx`. **SSR per request** untuk akun game (real-time stock).

### 6.1 Pola Page

```tsx
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import ProductGallery from "./_components/product-gallery";
import ProductSpecs from "./_components/product-specs";
import ProductBuyCard from "./_components/product-buy-card";
import RelatedProducts from "./_components/related-products";
import RelatedProductsSkeleton from "./_components/related-products-skeleton";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: { images: [product.coverImage] },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="container py-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <ProductGallery media={product.media} />
        <ProductSpecs product={product} />
      </div>
      <ProductBuyCard product={product} />

      <div className="lg:col-span-2">
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts gameSlug={product.gameSlug} excludeId={product.id} />
        </Suspense>
      </div>
    </main>
  );
}
```

### 6.2 Komponen

- `ProductGallery` — thumbnail + main image, keyboard navigable. Pakai `next/image`.
- `ProductSpecs` — Tabs shadcn (Detail Akun, Spesifikasi, Cara Pemesanan).
- `ProductBuyCard` — sticky di desktop (`lg:sticky lg:top-24`), berisi harga, badge status, quantity, tombol "Beli Sekarang", security note ("100% Anti-Minus").
- `RelatedProducts` — async Server Component dengan `getRelatedProducts()` yang di-cache.

### 6.3 Definition of Done

- [ ] Stok ditampilkan real-time (tidak dari cache).
- [ ] `<title>` dan `<meta description>` unik per produk.
- [ ] OG image dihasilkan otomatis via `opengraph-image.tsx` (gunakan `ImageResponse` dari `next/og`).
- [ ] CTA "Beli Sekarang" disable + label "Sold Out" saat `stockStatus === 'sold_out'`.
- [ ] Galeri dapat dinavigasi panah keyboard.

---

## 7. Tipe Domain (Kontrak Data)

Letakkan di `lib/types/`. Contoh dasar:

```ts
// lib/types/product.ts
export type ProductCategory = "account" | "topup" | "voucher";
export type StockStatus = "ready" | "sold_out";

export interface PriceInfo {
  currency: "IDR";
  amount: number; // harga akhir
  originalAmount?: number; // untuk diskon
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
  highlights: string[]; // bullet poin spesifikasi singkat
  specs: Record<string, string>;
  rating?: { average: number; count: number };
  createdAt: string; // ISO date
}
```

Tipe lain yang perlu dibuat: `Game`, `Voucher`, `TopUpDenomination`, `Review`, `FaqItem`, `CartItem`, `ProductQuery`, `PaginatedResult<T>`.

---

## 8. State Management (Zustand)

Aturan:

- Zustand **bukan** untuk data fetching — itu pekerjaan Server Component.
- Dipakai untuk: cart, draft filter, mobile drawer, toast/snackbar, theme toggle.
- Setiap store di file sendiri, default `create` + `devtools` di development.
- Bersihkan state yang tak perlu persist; pakai `persist` middleware hanya untuk cart.

```ts
// stores/cart-store.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types/cart";

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => ({
          items: s.items.find((i) => i.id === item.id)
            ? s.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + item.qty } : i,
              )
            : [...s.items, item],
        })),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "gm-cart" },
  ),
);
```

---

## 9. Coding Standards

- **Tidak ada `any`.** Pakai `unknown` + type guard kalau perlu.
- **Props interface** wajib di-export bila komponen reusable. Penamaan: `ProductCardProps`.
- **Pure functions** di `lib/utils/`. Tidak ada side effect tersembunyi.
- **Server-only modules**: file yang menyentuh secret/DB harus `import 'server-only'` di bagian atas.
- **Naming**:
  - Komponen: `PascalCase`
  - Hooks: `useThing`
  - Variabel/fungsi: `camelCase`
  - Constants: `SCREAMING_SNAKE_CASE` di `lib/constants/`
- **Class merging**: pakai helper `cn` (`clsx` + `tailwind-merge`) di `lib/utils/cn.ts`.
- **Format harga**: helper `formatIDR(amount: number)` agar konsisten (`Rp1.250.000`).
- **Tanggal**: `Intl.DateTimeFormat('id-ID', ...)`.
- **Error handling**: gunakan `error.tsx` per route segment; `lib/data/*` melempar `Error` deskriptif, jangan `console.log` di production path.
- **Image policy**: hanya `next/image`. Konfigurasi `images.remotePatterns` di `next.config.ts` saat tambah CDN.
- **Environment variables**: hanya yang perlu di client diberi prefix `NEXT_PUBLIC_`. Sisanya hanya untuk server.

---

## 10. SEO & Metadata

- `app/layout.tsx`: `metadata` default (title template `%s | Gaming Marketplace`, description, OG defaults).
- Setiap page: `metadata` statis atau `generateMetadata`. Untuk listing dengan query, biarkan default + `robots: { index: false }` pada kombinasi yang berisik (`page > 1`, hasil pencarian).
- `app/sitemap.ts` mengembalikan list URL utama + per produk.
- `app/robots.ts` mengizinkan crawl publik, blokir `/api/*` jika dibuat.
- OG image dinamis via `opengraph-image.tsx` (`ImageResponse` dari `next/og`).

---

## 11. Performance Checklist

- [ ] Hindari Client Component di branch root layout. `'use client'` ditarik sedalam mungkin.
- [ ] `next/image` untuk semua aset raster. SVG inline atau di `public/`.
- [ ] Font via `next/font` (sudah dipakai di layout). Tambah `display: 'swap'` jika perlu.
- [ ] Bundle Zustand store kecil; jangan mengimpor seluruh store ke Server Component.
- [ ] `Suspense` boundary di sekitar fetch yang bisa lambat (related products, recommendations).
- [ ] Verifikasi `next build` menampilkan ◐ (partial prerender) atau ● (static) pada route yang seharusnya.

---

## 12. QA Sebelum Merge

1. `npm run lint` bersih.
2. `npm run build` sukses.
3. Smoke test 3 halaman utama di mobile viewport (375px) dan desktop (1440px).
4. Tab keyboard dari header sampai footer tanpa "trap".
5. Lighthouse di mode incognito: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
6. Verifikasi tidak ada error/warning di Console & Network.

---

## 13. Catatan Migrasi & Hal-Hal yang Beda dari "Next.js Lama"

Project ini **Next.js 16**. Hal-hal yang sering keliru kalau mengandalkan ingatan lama:

- `params` dan `searchParams` adalah `Promise`. Harus di-`await`.
- `fetch()` **tidak** lagi auto-cache. Pakai `"use cache"` directive untuk data-level caching.
- Caching diatur via Cache Components: `cacheLife`, `cacheTag`, `revalidateTag`, `updateTag`. `unstable_cache` dan opsi `next: { revalidate }` di `fetch` adalah model lama.
- Tailwind CSS v4: token didefinisikan di `@theme` block di `globals.css`, bukan di `tailwind.config.js`. Tidak ada `tailwind.config.js` di project ini, dan jangan dibuat kecuali benar-benar perlu.
- React 19: `use()` API untuk membaca promise di Client Component, `useActionState` untuk form actions, `useFormStatus` untuk pending state.
- Untuk men-disable streaming metadata pada bot tertentu, gunakan `htmlLimitedBots` di `next.config.ts` (bukan flag eksperimental lama).

Selalu cek `node_modules/next/dist/docs/01-app/` saat ragu.
