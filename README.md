# Digital Gaming Marketplace

Front-end e-commerce untuk **jual beli akun game**, **top-up in-game currency**, dan **voucher gaming digital**. Project ini fokus pada UI/UX yang imersif (gaming vibes), responsive _mobile-first_, performa SEO yang optimal, serta _clean code_ siap produksi.

> Status: Front-end only (tanpa backend payment gateway). Checkout dan stok masih simulasi berbasis mock data.

---

## ✨ Fitur Utama

- **Landing Page** — hero imersif, promo carousel, popular games, featured products, testimoni, FAQ accordion, CTA penutup.
- **Two-Step Browse** per kategori:
  - **Akun** (`/products/account` → `/products/account/{gameSlug}`) — pilih game lalu lihat listing akun.
  - **Top-up** (`/products/topup` → `/checkout?category=topup&game={gameSlug}`) — pilih game langsung ke checkout (single-shot, tanpa cart).
  - **Voucher** (`/products/voucher` → `/products/voucher/{platformSlug}`) — pilih platform (Steam, Google Play, PlayStation, dst.) lalu lihat listing voucher.
- **Product Listing** — search, sort, filter (game, kategori, range harga), pagination. Semua state tersinkron ke URL query parameter.
- **Product Detail** — galeri foto interaktif (keyboard navigable), spesifikasi tabular, _sticky buy card_, related products.
- **Checkout** — customer info, metode pembayaran (Transfer Bank, E-Wallet, QRIS), voucher diskon, halaman konfirmasi dengan order ID.
- **UX Polish** — dark/light theme, mobile drawer nav, filter drawer di mobile, loading & error boundary per route, skeleton state, aksesibilitas WCAG AA.

---

## 🛠 Tech Stack

| Layer            | Tools                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)                |
| Language         | [TypeScript](https://www.typescriptlang.org) (strict mode)                                   |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com) + design tokens via `@theme`                      |
| UI Components    | [shadcn/ui](https://ui.shadcn.com) pattern + [Radix UI](https://www.radix-ui.com) primitives |
| State Management | [Zustand](https://zustand.docs.pmnd.rs) (cart, checkout, filter draft)                       |
| Carousel         | [Embla Carousel](https://www.embla-carousel.com)                                             |
| Icons            | [Lucide React](https://lucide.dev)                                                           |
| Theme            | [next-themes](https://github.com/pacocoursey/next-themes)                                    |
| Lint             | ESLint 9 + `eslint-config-next`                                                              |

### Kenapa Next.js?

- **Server-first rendering** yang fleksibel per halaman:
  - **SSG/ISR** untuk landing page agar SEO dan loading optimal.
  - **Dynamic SSR** untuk halaman detail akun supaya status stok selalu real-time dan mencegah _double-buy_.
- **App Router** memudahkan kolokasi `page`, `layout`, `loading`, `error`, dan `_components` per segment.
- **Cache Components** (Next.js 16) untuk strategi caching yang granular via `cacheLife` & `cacheTag`.

---

## 📂 Struktur Project

```
app/                   # App Router routes (page, layout, loading, error per segment)
├─ _components/        # Komponen khusus landing page
├─ products/
│  ├─ _components/     # Komponen reusable listing (grid, card, filter, pagination)
│  ├─ account/         # Two-step browse: Akun
│  ├─ topup/           # Two-step browse: Top-up
│  ├─ voucher/         # Two-step browse: Voucher
│  └─ [slug]/          # Product detail (dynamic SSR untuk stok real-time)
└─ checkout/           # Checkout form + halaman konfirmasi
components/
├─ ui/                 # Primitives (button, badge, sheet, accordion, input)
├─ common/             # Reusable cross-domain (price-tag, stock-badge, theme-toggle)
├─ layout/             # Site header, footer, mobile nav, global search
└─ providers/          # Theme provider
lib/
├─ types/              # Type definitions (product, game, platform, checkout)
├─ data/               # Data access layer + mock data
├─ utils/              # Helpers (product-query, categorization, checkout)
└─ constants/          # Static config (sort options, payment methods)
hooks/                 # Custom hooks (useHydrated, useDebouncedValue)
stores/                # Zustand stores (cart, checkout, filter)
public/                # Static assets (images, video, icons)
```

---

## 🏗 Arsitektur

- **Component-driven & atomic** — komponen presentational dipisah dari container; primitives di `components/ui/`, domain logic di `lib/`, route-specific components di `_components/` per segment.
- **URL adalah state** — filter, sort, page, dan search di product listing tersinkron ke `searchParams`. Reload halaman atau share URL menghasilkan tampilan yang sama.
- **Zustand untuk UI state ephemeral** — cart, draft filter, dan state checkout. Tidak menyimpan data yang seharusnya ada di server.
- **Strict typing** — `strict: true` di `tsconfig.json`, dilarang `any`. Semua entitas didefinisikan di `lib/types/`.
- **Mobile-first responsive** — base styles untuk mobile, breakpoint `sm:` `md:` `lg:` `xl:` untuk layar lebih besar.
- **Aksesibilitas** — kontras ≥ 4.5:1, focus ring jelas, ARIA attributes pada komponen kustom, navigasi keyboard penuh.

### Strategi Rendering

| Halaman                                | Strategi                            | Alasan                                 |
| -------------------------------------- | ----------------------------------- | -------------------------------------- |
| `/`                                    | Static + cached sections            | Konten promosional, jarang berubah     |
| `/products`                            | Static (chooser kategori)           | Tidak ada data per request             |
| `/products/account`                    | Cached (`cacheTag: games:account`)  | Daftar game stabil                     |
| `/products/account/[gameSlug]`         | Uncached (SSR)                      | Stok akun harus real-time              |
| `/products/topup`                      | Cached (`cacheTag: games:topup`)    | Daftar game stabil                     |
| `/products/voucher`                    | Cached (`cacheTag: platforms`)      | Daftar platform sangat stabil          |
| `/products/voucher/[platformSlug]`     | Cached (`cacheTag: voucher:{slug}`) | Voucher per platform stabil            |
| `/products/[slug]`                     | Uncached (SSR)                      | Status stok real-time, anti double-buy |
| `/checkout` & `/checkout/confirmation` | Client-heavy, `noindex`             | Data session-specific dan sensitif     |

---

## 🚀 Getting Started

### Prasyarat

- **Node.js** ≥ 20
- **npm** (atau pnpm / yarn / bun)

### Instalasi

```bash
git clone <repository-url>
cd gaming-marketplace
npm install
```

### Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build & Production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## 📜 Scripts

| Script          | Keterangan                  |
| --------------- | --------------------------- |
| `npm run dev`   | Jalankan development server |
| `npm run build` | Build production bundle     |
| `npm run start` | Jalankan production server  |
| `npm run lint`  | Jalankan ESLint             |

---

## 🧭 Roadmap

- [x] Foundation (design tokens, types, mock data, primitives)
- [x] Global Layout (header, footer, mobile nav, theme provider)
- [x] Landing Page (hero, promo carousel, popular games, FAQ, testimoni)
- [x] Product Listing (search, sort, filter, pagination)
- [x] Product Detail (gallery, specs, sticky buy card, related products)
- [x] Checkout (form, payment, voucher, konfirmasi)
- [ ] Two-Step Browse refactor (Akun / Top-up / Voucher entity-first)
- [ ] OG image dinamis, `sitemap.ts`, `robots.ts`
- [ ] Aktifkan `cacheComponents: true` di `next.config.ts`
- [ ] Lighthouse audit (target Performance ≥ 90, Accessibility ≥ 95, SEO 100)
- [ ] Integrasi backend & payment gateway

---

## 📄 Lisensi

Project ini dibuat untuk keperluan portfolio dan pembelajaran.
