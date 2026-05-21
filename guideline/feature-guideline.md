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

### Tahap 3 — Landing Page (`/`) ✅

Kerjakan section-by-section, masing-masing jadi komponen sendiri (lihat §4).

- [x] Hero (`HeroSection`)
- [x] Promo Carousel (`PromoCarousel` + `PromoCarouselTrack` client)
- [x] Popular Games (`PopularGameGrid`)
- [x] Featured Products (`FeaturedProducts` di-`<Suspense>` dengan skeleton)
- [x] Testimoni Customer (`TestimonialGrid`) — kartu rating, blockquote, avatar inisial dengan gradient ungu
- [x] FAQ Accordion (`FaqAccordion`) — Radix Accordion (`components/ui/accordion.tsx`) + cached data via `getFaqItems()`
- [x] CTA penutup (`CtaClosing`) — section ungu glass dengan trio highlight (anti-minus, top up cepat, support 24 jam) + dual CTA ke `/products` dan `/products?category=topup`

### Tahap 4 — Product Listing (`/products`) ✅

Dipecah jadi 3 fase agar tiap fase _shippable_.

#### Fase 4A — Listing Core (server-driven, URL-as-state) ✅

- [x] `lib/constants/products.ts` — `DEFAULT_PER_PAGE`, `MAX_PER_PAGE`, `SORT_OPTIONS`, `CATEGORY_LABELS`.
- [x] `lib/utils/product-query.ts` — `parseProductQuery(sp)` + `buildProductsHref(query, override)` (tahan terhadap URL hand-edited).
- [x] `hooks/use-debounced-value.ts` — debounce generik untuk search input.
- [x] `app/products/page.tsx` — Server Component, `searchParams: Promise<...>`, `generateMetadata` per kombinasi (noindex untuk filter aktif), call `searchProducts()`.
- [x] `app/products/loading.tsx` — skeleton header + toolbar + grid.
- [x] `app/products/error.tsx` — error boundary segment dengan tombol `reset`.
- [x] `app/products/_components/product-listing-toolbar.tsx` — search + sort + total hits.
- [x] `app/products/_components/product-search-input.tsx` (`"use client"`) — debounced (350ms), `router.replace` + `useTransition`, sync ulang dari URL.
- [x] `app/products/_components/product-sort-select.tsx` (`"use client"`) — native `<select>` + custom chevron, `router.push` saat berubah.
- [x] `app/products/_components/product-grid.tsx` — grid 1/2/3/4 kolom dengan LCP priority untuk 2 kartu pertama.
- [x] `app/products/_components/product-pagination.tsx` — link-based, windowed (1, ..., n-1, n, n+1, ..., last), pertahankan query lain.
- [x] `app/products/_components/product-active-filters.tsx` — chip filter aktif yang bisa dihapus (link statis, tanpa JS).
- [x] `app/products/_components/product-listing-empty.tsx` — empty state Bahasa Indonesia + CTA reset.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅ (route `/products` ter-mark `ƒ` dynamic — sesuai karena `searchParams` request-time API).

#### Fase 4B — Filter Sidebar + Drawer (shadcn Sheet) ✅

- [x] Install `@radix-ui/react-dialog`.
- [x] `components/ui/sheet.tsx` — shadcn-style Sheet primitive (Radix Dialog wrapper) dengan animasi keyframe (overlay fade + slide per side).
- [x] `components/ui/input.tsx` — themed input primitive (number spinners hidden, focus ring violet).
- [x] `stores/filter-store.ts` — draft filter Zustand (sebelum apply ke URL), `draftToOverride()` helper.
- [x] `app/products/_components/product-filter-form.tsx` (`"use client"`) — checkbox group game (multi), radio kategori, range harga, tombol Terapkan & Reset. Shared antara sidebar dan drawer.
- [x] `app/products/_components/product-filter-sidebar.tsx` — wrapper desktop (sticky `lg:block`, hidden di mobile).
- [x] `app/products/_components/product-filter-drawer.tsx` (`"use client"`) — wrapper mobile dengan Sheet (side left) + tombol "Filter" dengan badge count.
- [x] Update `app/products/page.tsx` ke layout 2 kolom `lg:grid-cols-[260px_minmax(0,1fr)]` + parallel fetch games.
- [x] Update `app/products/_components/product-listing-toolbar.tsx` — `leadingSlot` prop untuk drawer trigger.
- [x] Animasi Sheet via `@keyframes` di `globals.css` (overlay-in/out, sheet-in/out per side) — tidak butuh `tailwindcss-animate`.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅.

#### Fase 4C — Mobile Nav + QA ✅

- [x] `components/layout/mobile-nav.tsx` (`"use client"`) — Sheet drawer (side left) berisi nav links + ikon per item, active state berdasarkan `pathname`, auto-close on navigate.
- [x] Update `components/layout/site-header.tsx` — hamburger `<MobileNav />` di `< lg`, tersembunyi di desktop.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅ (route `/` static ●, `/products` dynamic ƒ).

### Tahap 5 — Product Detail (`/products/[slug]`) ✅

Dipecah jadi 3 fase agar tiap fase _shippable_.

#### Fase 5A — Page Shell + Data + Metadata ✅

- [x] `app/products/[slug]/page.tsx` — Server Component, `params: Promise<{ slug }>`, panggil `getProductBySlug()`, `notFound()` jika null, `generateMetadata` per produk (title, description, OG image).
- [x] `app/products/[slug]/loading.tsx` — skeleton layout 2 kolom (gallery + specs kiri, buy card kanan), breadcrumb skeleton.
- [x] `app/products/[slug]/error.tsx` — error boundary segment dengan tombol reset + link kembali ke listing.
- [x] Breadcrumb navigasi (Home > Produk > [title]) menggunakan `next/link`.
- [x] Route `/products/[slug]` ter-mark `ƒ` dynamic — sesuai karena stok harus real-time.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅.

#### Fase 5B — Komponen Utama (Gallery, Specs, BuyCard) ✅

- [x] `app/products/[slug]/_components/product-gallery.tsx` (`"use client"`) — thumbnail strip + main image, keyboard navigable (ArrowLeft/ArrowRight), active thumbnail auto-scroll, counter "n / total", ARIA roles (`group`, `tablist`, `tab`).
- [x] `app/products/[slug]/_components/product-specs.tsx` — 3 section: Highlights (bullet grid), Spesifikasi (striped key-value table), Cara Pemesanan (numbered steps). Ikon Lucide per section, `aria-labelledby`.
- [x] `app/products/[slug]/_components/product-buy-card.tsx` (`"use client"`) — sticky di desktop (`lg:sticky lg:top-24`), reuse `PriceTag`/`StockBadge`/`DiscountBadge`, quantity selector (+/-), add-to-cart via Zustand, feedback "Ditambahkan!" 2 detik, disabled + "Sold Out" saat habis, trust signals.
- [x] Update `app/products/[slug]/page.tsx` — komposisi bersih menggunakan ketiga komponen baru.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅.

#### Fase 5C — Related Products + Polish ✅

- [x] `app/products/[slug]/_components/related-products.tsx` — async Server Component, panggil `getRelatedProducts()` (cached), grid 4 kolom, return null jika kosong.
- [x] `app/products/[slug]/_components/related-products-skeleton.tsx` — skeleton fallback untuk Suspense boundary (4 card skeleton).
- [x] Wrap `RelatedProducts` dalam `<Suspense>` di page dengan separator border-top.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅ (route `/` static ●, `/products` dynamic ƒ, `/products/[slug]` dynamic ƒ).

### Tahap 6 — Checkout UI (`/checkout` + `/checkout/confirmation`) ✅

Simulasi checkout front-end (tanpa backend payment gateway). Dipecah jadi 3 fase.

#### Fase 6A — Tipe, Store & Data Layer ✅

- [x] `lib/types/checkout.ts` — `PaymentMethodType`, `PaymentMethod`, `CustomerInfo`, `VoucherResult`, `OrderItem`, `OrderSummary`, `OrderResult`.
- [x] `stores/checkout-store.ts` — Zustand store untuk draft checkout (customer info, selected payment, voucher, order result, processing flag). Ephemeral (tanpa `persist`); helper `reset()` mengembalikan ke `INITIAL_STATE`.
- [x] `lib/constants/checkout.ts` — `PAYMENT_METHODS` (Transfer Bank BCA/Mandiri/BRI, E-Wallet GoPay/OVO/Dana, QRIS) + `MOCK_VOUCHERS` (`HEMAT10`, `GAMING20`, `NEWUSER15`).
- [x] `lib/utils/checkout.ts` — `validateVoucher()`, `calculateOrderSummary()`, `generateOrderId()`, plus `validateCustomerInfo()` (dipakai 6B).
- [x] `lib/data/mock-checkout.ts` — `getPaymentInstructions()` per `PaymentMethodType` + `getEstimatedDelivery()`.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅.

#### Fase 6B — Checkout Page (`/checkout`) ✅

- [x] `app/checkout/page.tsx` — Server Component shell + breadcrumb, render `<CheckoutForm />`.
- [x] `app/checkout/loading.tsx` — skeleton form + order summary 2 kolom.
- [x] `app/checkout/error.tsx` — error boundary segment dengan tombol reset + link ke produk.
- [x] `app/checkout/_components/checkout-form.tsx` (`"use client"`) — orchestrator: layout 2 kolom, validasi via `validateCustomerInfo`, redirect ke `/products` saat cart kosong (`useHydrated` gating), submit handler dengan delay 1.5s, push ke `/checkout/confirmation`.
- [x] `app/checkout/_components/customer-info-section.tsx` (`"use client"`) — Nama, Email, WhatsApp, ID Game + Server Game (conditional saat ada item kategori `topup`/`account`), Catatan. ARIA `aria-invalid` + `aria-describedby` per error.
- [x] `app/checkout/_components/payment-method-section.tsx` (`"use client"`) — radio group card-style, dikelompokkan per `type` (Transfer Bank / E-Wallet / QRIS), ikon Lucide (`Landmark`, `Wallet`, `QrCode`).
- [x] `app/checkout/_components/voucher-section.tsx` (`"use client"`) — input + tombol Terapkan, state idle/loading/valid/invalid, badge `±%` saat valid + tombol hapus, Enter key submits.
- [x] `app/checkout/_components/order-summary-card.tsx` (`"use client"`) — sticky di desktop (`lg:sticky lg:top-24`), subtotal, diskon voucher, total, tombol "Bayar Sekarang" dengan spinner saat processing, trust signal.
- [x] `app/checkout/_components/cart-item-row.tsx` (`"use client"`) — thumbnail, title, `qty × harga`, line total. Reuse `formatIDR()`.
- [x] Metadata: `title: "Checkout"`, `robots: { index: false, follow: false }`.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅ (route `/checkout` ter-prerender sebagai static shell ○; `CheckoutForm` hydrate client-side dan menjadikan flow dinamis tanpa perlu opt-out static rendering — sudah sesuai karena page tidak mengakses request-time API).

#### Fase 6C — Confirmation Page (`/checkout/confirmation`) ✅

- [x] `app/checkout/confirmation/page.tsx` — Server Component shell + breadcrumb (Home > Checkout > Konfirmasi), render `<ConfirmationContent />`.
- [x] `app/checkout/confirmation/loading.tsx` — skeleton (header sukses, meta cards, summary, payment + instructions, CTA).
- [x] `app/checkout/confirmation/_components/confirmation-content.tsx` (`"use client"`) — header sukses (icon `CheckCircle2` hijau + heading), meta cards (order ID dengan tombol "Salin" + tanggal `Intl.DateTimeFormat('id-ID')`), ringkasan item (reuse `CartItemRow`), totals (subtotal/diskon/total), card metode pembayaran + estimasi pengiriman, instruksi pembayaran bernomor, recap data pemesan, dual CTA (Beranda + Produk Lain).
- [x] **Snapshot pattern**: `orderResult` dari Zustand di-capture ke local state via "set state during render" (sesuai rule React 19 `react-hooks/set-state-in-effect`), lalu `reset()` dijalankan di `useEffect` agar back/refresh tidak menampilkan data lama.
- [x] **Empty guard**: jika tidak ada `orderResult` dan belum ada snapshot setelah hidrasi, redirect ke `/products`.
- [x] Metadata: `title: "Pesanan Berhasil"`, `robots: { index: false, follow: false }`.
- [x] Verifikasi: `npm run lint` ✅, `npm run build` ✅ (route `/checkout/confirmation` ter-prerender sebagai static shell ○; `ConfirmationContent` hydrate client-side dan baca dari Zustand).

### Tahap 7 — Polish ⬜

- [ ] Aktifkan `cacheComponents: true` di `next.config.ts` dan un-comment directive `"use cache"`/`cacheLife`/`cacheTag` di `lib/data/*.ts`.
- [ ] OG image dinamis (`opengraph-image.tsx`).
- [ ] `sitemap.ts`, `robots.ts`.
- [ ] Lighthouse audit (target Performance ≥ 90, Accessibility ≥ 95, SEO 100).
- [ ] Cross-browser & device check.

### Tahap 8 — Restrukturisasi Kategori (Two-Step Browse) ⬜

Refactor `Browse_System` dari listing flat menjadi alur **two-step entity-first** per kategori (lihat §5 untuk kontrak URL & rendering, dan [`styling-guideline.md` §6.9](./styling-guideline.md#69-game-card--platform-card) untuk resep `Game_Card` & `Platform_Card`). Setiap fase wajib lulus `npm run lint` dan `npm run build` sebelum lanjut.

#### Fase A — Tipe `Platform`, data layer, dan helper kategorisasi ⬜

- [ ] `lib/types/platform.ts` — definisi `interface Platform` (`slug`, `name`, `icon`, `accent`, `productCount`) + alias `PlatformSlug`.
- [ ] `lib/types/product.ts` — tambah field opsional `platformSlug?: string` dengan kontrak hard-rule REQ-5.2 (lihat §7).
- [ ] `lib/data/mock-platforms.ts` — minimal 5 entry: Steam, Google Play, PlayStation Store, App Store, Xbox.
- [ ] `lib/data/mock-products.ts` — migrasi voucher existing (mis. `voucher-google-play-100rb`) ke `platformSlug`, hapus `gameSlug` di entry voucher.
- [ ] `lib/utils/categorization.ts` (pure helpers) — `groupGamesByCategory(products, category, gameCatalog)` + `groupPlatformsForVouchers(products, platformCatalog)`. Yang kedua **throw `Error`** saat menemukan voucher tanpa `platformSlug`.
- [ ] `lib/data/platforms.ts` (baru) — `getPlatforms()` (cached, `cacheTag('platforms')`), `getPlatformBySlug(slug)`, `getVouchersByPlatform(platformSlug)` (throw saat data invalid).
- [ ] `lib/data/games.ts` — tambah `getGamesForCategory(category)` (cached, `cacheTag('games', 'games:{category}')`).
- [ ] `lib/data/products.ts` — tambah `getAccountsByGame(gameSlug)` (uncached, stok real-time) + `getTopupsByGame(gameSlug)` (cached).
- [ ] Property tests opsional untuk `groupGamesByCategory` & `groupPlatformsForVouchers` (sum-conservation, permutation invariance, idempotence, hard-rule enforcement).

#### Fase B — Category Landing Pages: Akun & Topup ⬜

- [ ] `app/products/_components/game-card.tsx` — single `<Link>`, props `{ game, href, countLabel }`, aria-label deskriptif, focus ring violet-400, hit area ≥ 44×44px.
- [ ] `app/products/_components/game-grid.tsx` — props `{ games, category: "account" | "topup", emptyText }`. Render `Game_Card` dengan `href` `/products/account/{slug}` saat `category === "account"`, atau `/checkout?category=topup&game={slug}` saat `category === "topup"`.
- [ ] `app/products/account/page.tsx` (Server Component, cached) + `loading.tsx` + `error.tsx`.
- [ ] `app/products/topup/page.tsx` (Server Component, cached) + `loading.tsx` + `error.tsx`.

#### Fase C — `Game_Detail_Page` Akun ⬜

- [ ] `app/products/account/[gameSlug]/page.tsx` — Server Component uncached, `params: Promise<{ gameSlug }>` di-`await`, `notFound()` saat game tidak ada (REQ-2.5). Reuse `product-grid`, `product-pagination`, `product-active-filters`, `product-listing-toolbar`. `generateMetadata` async title `${Game.name} — Akun`.
- [ ] `app/products/account/[gameSlug]/loading.tsx` + `error.tsx`.
- [ ] `app/products/account/[gameSlug]/_components/account-list-header.tsx` — header + breadcrumb + jumlah Akun.
- [ ] Update `app/products/_components/product-filter-form.tsx` — tambah prop `scope: "global" | "game-detail"`. Saat `"game-detail"`, sembunyikan multi-select Game. `filter-store` tidak persist field `game` di scope ini.

#### Fase D — Voucher routes ⬜

- [ ] `app/products/_components/platform-card.tsx` — single `<Link>` ke `/products/voucher/{slug}`, struktur identik `Game_Card` namun **icon-led** (Lucide 32–48px) dengan gradient `accent`.
- [ ] `app/products/_components/platform-grid.tsx` — props `{ platforms, emptyText }`.
- [ ] `app/products/voucher/page.tsx` (Server Component, cached) + `loading.tsx` + `error.tsx`.
- [ ] `app/products/voucher/[platformSlug]/page.tsx` — Server Component cached. `notFound()` HANYA saat `platformSlug` tidak ada di catalog (REQ-3.5). Empty state khusus saat valid namun 0 voucher (TANPA filter/sort UI) per REQ-3.6. Filter Game **TIDAK** dirender. `generateMetadata` async title `Voucher ${Platform.name}`.
- [ ] `app/products/voucher/[platformSlug]/loading.tsx` + `error.tsx` + `_components/platform-list-header.tsx`.

#### Fase E — `Topup_Picker` di `Checkout_Page` ⬜

- [ ] `stores/checkout-store.ts` — tambah `topupSelectedId: string | null` + `setTopupSelectedId(id)`; ikut di-reset oleh `reset()`. Ephemeral (no `persist`).
- [ ] `app/checkout/_components/topup-picker.tsx` (`"use client"`) — `<fieldset>` + `<legend>`, radio card-style, props `{ game, denominations, selectedId, onSelect }`. Empty state saat 0 denominasi (REQ-4.8).
- [ ] `app/checkout/page.tsx` — parse `searchParams.category` + `searchParams.game` (di-`await`); saat mode topup, fetch `Game` + `Topup_Denomination[]`, redirect 302/307 ke `/products/topup` saat `gameSlug` invalid (REQ-4.7), render `<CheckoutForm mode="topup" game={...} denominations={...} />`.
- [ ] `app/checkout/_components/checkout-form.tsx` — tambah props `mode: "cart" | "topup"`, `game?`, `denominations?`. Mode topup: `Topup_Picker` di paling atas, `OrderSummary` dari denominasi terpilih, **tidak** menyentuh `cart-store` (REQ-4.9), tombol disabled hingga (a) denominasi terpilih, (b) customer info valid, (c) payment method terpilih (REQ-4.5).
- [ ] `app/checkout/_components/customer-info-section.tsx` — tambah prop `requireGameFields: boolean`; saat `true`, `gameId` & `gameServer` mandatory.
- [ ] Fallback `setOrderResult` (REQ-4.10) — try/catch, simpan ke `sessionStorage` key `gm-pending-order`, navigate `/checkout/confirmation?fallback=session`.
- [ ] `app/checkout/confirmation/_components/confirmation-content.tsx` — baca fallback `sessionStorage` saat `?fallback=session`, hapus key setelah snapshot.

#### Fase F — Redirects, `Category_Chooser`, finalisasi `/products` ⬜

- [ ] `next.config.ts` — `redirects()` 308 dari `/products?category=account|topup|voucher` ke route baru. Verifikasi via `curl -I` (REQ-6.5, REQ-12.1).
- [ ] `app/products/_components/category-chooser.tsx` — 3 `<Link>` kartu (Akun, Topup, Voucher), tanpa state.
- [ ] `app/products/page.tsx` — refactor menjadi chooser. Hapus parse `searchParams` listing flat. Pertahankan `searchParams.q` (TIDAK di-redirect; tetap routable per REQ-6.6 / REQ-12.2).
- [ ] `app/products/loading.tsx` — skeleton 3 kartu kategori (bukan grid produk).
- [ ] Smoke test: `/products?category=account` → 308 → `/products/account`; `/products?q=keyword` tidak di-redirect.

---

## 2. Strategi Rendering & Caching

| Halaman                                         | Strategi                                                                                                                                                       | Alasan                                                                                        |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `/` Landing                                     | Prerendered shell + cached sections (`"use cache"` + `cacheLife('hours')`)                                                                                     | Konten promosional, jarang berubah; loading harus instan untuk SEO                            |
| `/products` Chooser                             | **Static** — Server Component tanpa data fetch, hanya 3 `<Link>` kartu kategori                                                                                | Tidak ada state per request; LCP harus tetap instan                                           |
| `/products/account` Akun grid                   | Cached (`"use cache"` + `cacheTag('games', 'games:account')`)                                                                                                  | Daftar `Game` yang punya akun jarang berubah; invalidate via `revalidateTag('games:account')` |
| `/products/account/[gameSlug]` Game_Detail Akun | **Tidak** di-cache (stok akun real-time, sama dengan `/products/[slug]`)                                                                                       | Mencegah double-buy untuk akun game per-game                                                  |
| `/products/topup` Topup grid                    | Cached (`"use cache"` + `cacheTag('games', 'games:topup')`)                                                                                                    | Daftar `Game` yang punya paket topup jarang berubah                                           |
| `/products/voucher` Platform grid               | Cached (`"use cache"` + `cacheTag('platforms')`)                                                                                                               | Daftar `Platform` (Steam, Google Play, dst.) sangat jarang berubah                            |
| `/products/voucher/[platformSlug]`              | Cached (`"use cache"` + `cacheTag('voucher', 'voucher:{platformSlug}')`)                                                                                       | Voucher per platform stabil; invalidate per `platformSlug` saat ada perubahan                 |
| `/products` Listing (legacy `?category=…`)      | **Redirect 308** ke `/products/{kategori}` lewat `next.config.ts` `redirects()`                                                                                | Backward compat dari URL lama; lihat REQ-6.5 / REQ-12.1                                       |
| `/products/[slug]` Detail                       | **Tidak** di-cache. Fetch dilakukan langsung di Server Component supaya `stockStatus` selalu real-time. `RelatedProducts` di-`<Suspense>` dengan `"use cache"` | Mencegah double-buy untuk akun game                                                           |
| `/checkout` (mode cart)                         | Client-heavy, **tidak** di-cache. Cart state dari Zustand (client). Form ephemeral. `robots: noindex`.                                                         | Data sensitif (email, WA), session-specific; tidak boleh ter-cache                            |
| `/checkout?category=topup&game={slug}`          | **Uncached** — Server Component fetch `Game` + `Topup_Denomination[]` per request, `robots: noindex`                                                           | Cart dilewati (REQ-4.9); single-shot flow per game                                            |
| `/checkout/confirmation`                        | Client-heavy, **tidak** di-cache. Baca order result dari sessionStorage/Zustand. `robots: noindex`.                                                            | Hasil order unik per transaksi                                                                |
| Section "Related" / "Popular"                   | `"use cache"` + `cacheTag('products')`                                                                                                                         | Murah di-invalidate via `revalidateTag('products')` saat ada perubahan stok                   |

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
│  ├─ page.tsx                 # Category Chooser (3 kartu Akun/Topup/Voucher)
│  ├─ loading.tsx
│  ├─ account/                 # Akun: two-step (grid Game → listing Akun)
│  │  ├─ page.tsx              # Category_Landing_Page Akun (cached, grid Game)
│  │  ├─ loading.tsx
│  │  ├─ error.tsx
│  │  └─ [gameSlug]/           # Game_Detail_Page Akun (uncached, listing Akun)
│  │     ├─ page.tsx
│  │     ├─ loading.tsx
│  │     ├─ error.tsx
│  │     └─ _components/       # account-list-header.tsx
│  ├─ topup/                   # Topup: grid Game → /checkout?category=topup
│  │  ├─ page.tsx              # Category_Landing_Page Topup (cached, grid Game)
│  │  ├─ loading.tsx
│  │  └─ error.tsx
│  ├─ voucher/                 # Voucher: two-step (grid Platform → listing Voucher)
│  │  ├─ page.tsx              # Category_Landing_Page Voucher (cached, grid Platform)
│  │  ├─ loading.tsx
│  │  ├─ error.tsx
│  │  └─ [platformSlug]/       # Platform_Detail_Page (cached, listing Voucher)
│  │     ├─ page.tsx
│  │     ├─ loading.tsx
│  │     ├─ error.tsx
│  │     └─ _components/       # platform-list-header.tsx
│  ├─ [slug]/
│  │  ├─ page.tsx              # Product Detail (SSR per request)
│  │  ├─ loading.tsx
│  │  ├─ error.tsx
│  │  ├─ opengraph-image.tsx   # OG dinamis per produk
│  │  └─ _components/          # Komponen privat untuk halaman ini
│  └─ _components/             # category-chooser, game-grid, game-card, platform-grid, platform-card, product-filter-*, ...
├─ checkout/
│  ├─ page.tsx                 # Checkout form (client-heavy); juga handle ?category=topup&game=…
│  ├─ loading.tsx
│  ├─ error.tsx
│  ├─ _components/             # Form sections, order summary, topup-picker.tsx (mode topup)
│  └─ confirmation/
│     ├─ page.tsx              # Order confirmation
│     ├─ loading.tsx
│     └─ _components/          # Confirmation content (baca fallback sessionStorage saat ?fallback=session)
└─ _components/                # Section landing privat (tidak routable)

components/
├─ ui/                         # shadcn primitives (Button, Card, Sheet, ...)
├─ common/                     # Reusable cross-domain (PriceTag, DiscountBadge, ...)
├─ layout/                     # SiteHeader, SiteFooter, MobileNav
└─ product/                    # ProductCard, ProductGallery, ProductFilterSidebar, ...

lib/
├─ types/                      # Product, Game, Platform, Voucher, TopUpItem, Review, FAQItem, Cart, Checkout
├─ data/                       # Data access (cached) + mock data (mock-platforms.ts, platforms.ts, ...)
├─ utils/                      # cn, formatCurrency, slugify, checkout helpers, categorization helpers, ...
└─ constants/                  # Enum game, sort options, payment methods, dsb.

stores/
├─ cart-store.ts               # Zustand: cart UI state
├─ filter-store.ts             # Zustand: ephemeral filter draft (sebelum apply ke URL)
└─ checkout-store.ts           # Zustand: ephemeral checkout draft (customer, payment, voucher)

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
- `app/_components/cta-closing.tsx`
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
import CtaClosing from "./_components/cta-closing";

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
      <CtaClosing />
    </>
  );
}
```

`FeaturedProducts` adalah async Server Component yang memanggil `getFeaturedProducts()` (cached, lihat §2). `CtaClosing` murni statis — di-render di server tanpa fetch.

### 4.4 Definition of Done

- [ ] Lulus `npm run build` tanpa warning.
- [ ] LCP element punya `priority` (gunakan `next/image` dengan `priority` di hero).
- [ ] Semua gambar pakai `next/image`, tidak ada `<img>` mentah.
- [ ] Kontras teks vs background lulus AA.
- [ ] FAQ accordion bisa dinavigasi keyboard (Enter/Space toggle, Tab traversal).

---

## 5. Halaman 2 — Product Listing (Two-Step Browse per Kategori)

Halaman 2 **bukan** lagi listing flat. Sejak Tahap 8 (Restrukturisasi Kategori), `/products` dipecah menjadi alur dua-langkah berbasis entitas (`Game` atau `Platform`) per kategori utama. Pengguna memilih kategori → memilih entitas → baru melihat produk yang relevan. Untuk Topup, langkah kedua langsung loncat ke `/checkout` dengan `Topup_Picker` (single-shot, tanpa cart).

Resep visual `Game_Card` dan `Platform_Card` ada di [`styling-guideline.md` §6.9](./styling-guideline.md#69-game-card--platform-card).

### 5A. Pemilihan Kategori (`/products`)

Path: `app/products/page.tsx`. Server Component **statis** (tidak ada data fetch).

- Render `<CategoryChooser />` (3 kartu: Akun · Topup · Voucher) — tanpa filter, tanpa search input listing.
- `searchParams.q` (pencarian global dari header) tetap dibiarkan routable; tidak di-redirect (REQ-6.6 / REQ-12.2). Hasil pencarian mengarah langsung ke `/products/{slug}` lewat detail produk.
- `metadata.title = "Kategori Produk"`, indexable.
- Skeleton (`loading.tsx`): 3 kartu kategori, **bukan** grid produk.

```tsx
// app/products/page.tsx (sketsa)
import type { Metadata } from "next";
import CategoryChooser from "./_components/category-chooser";

export const metadata: Metadata = { title: "Kategori Produk" };

export default function ProductsHubPage() {
  return (
    <main className="container py-8">
      <h1 className="sr-only">Kategori Produk</h1>
      <CategoryChooser />
    </main>
  );
}
```

### 5B. Akun (`/products/account` → `/products/account/{gameSlug}`)

Alur dua-langkah:

1. **`Category_Landing_Page` Akun (`/products/account`)** — Server Component, **cached** (`"use cache"` + `cacheTag('games', 'games:account')`). Render grid `Game_Card` berisi `Game` yang punya minimal satu `Akun`. Tidak ada `Product` di halaman ini (REQ-1.1).
   - Sort default: jumlah produk descending, tie-breaker `name` ascending (REQ-1.6).
   - Empty: "Belum ada akun tersedia saat ini" + tombol kembali ke beranda.
2. **`Game_Detail_Page` Akun (`/products/account/{gameSlug}`)** — Server Component, **uncached** (stok akun real-time, sama seperti `/products/[slug]`).
   - `params: Promise<{ gameSlug: string }>` di-`await`. `notFound()` saat `gameSlug` tidak ada di catalog (REQ-2.5).
   - Reuse listing components existing (`product-grid`, `product-pagination`, `product-active-filters`, `product-listing-toolbar`) dengan `gameSlug` ter-fix dari URL.
   - **Filter sidebar tanpa multi-select Game** (URL sudah memfix `gameSlug`); rentang harga + status stok tetap tersedia. Lihat §5.5 Migrasi.
   - `searchParams` yang relevan: `sort`, `min`, `max`, `page`, `perPage`. Filter Game (`game=`) di-drop dari `product-filter-form.tsx` saat `scope === "game-detail"` (REQ-2.7, REQ-8.5).
   - Header: nama `Game`, breadcrumb `Beranda > Akun > {Game.name}`, jumlah `Akun` (REQ-2.3).
   - `generateMetadata` async → title `${Game.name} — Akun`, indexable.
   - Empty (game valid, 0 akun): "Belum ada akun untuk {Game.name}" + tombol kembali ke `/products/account` (REQ-2.6).

### 5C. Topup (`/products/topup` → `/checkout?category=topup&game={gameSlug}`)

Alur **dua-langkah single-shot**, melompati cart:

1. **`Category_Landing_Page` Topup (`/products/topup`)** — Server Component, **cached** (`"use cache"` + `cacheTag('games', 'games:topup')`). Render grid `Game_Card` berisi `Game` yang punya minimal satu `Topup` (REQ-1.2).
   - `Game_Card` di sini secara visual **identik** dengan `Game_Card` di Akun; tujuan navigasi ditentukan oleh konteks `Category_Landing_Page` saat ini (REQ-2.1). Klik card → `/checkout?category=topup&game={slug}`.
   - Empty: "Belum ada topup tersedia saat ini".
2. **`Checkout_Page` mode Topup (`/checkout?category=topup&game={gameSlug}`)** — uncached, `robots: noindex`.
   - Server Component `app/checkout/page.tsx` parse `searchParams.category` + `searchParams.game` (di-`await`).
   - Saat `gameSlug` invalid → redirect 302/307 ke `/products/topup` (REQ-4.7).
   - Saat valid → fetch `Game` + `Topup_Denomination[]` dan render `<CheckoutForm mode="topup" game={...} denominations={...} />` dengan `Topup_Picker` di posisi paling atas form.
   - **Tidak menyentuh `cart-store`** (REQ-4.9). `OrderSummary` bersumber dari denominasi terpilih, bukan cart.
   - `customer-info-section.tsx` mempelakukan `gameId` & `gameServer` sebagai **required** saat mode topup (REQ-4.6).
   - Tombol "Bayar Sekarang" disabled sampai (a) denominasi terpilih, (b) customer info valid, (c) payment method terpilih (REQ-4.5).
   - Empty (game valid, 0 denominasi): "Belum ada paket topup untuk {Game.name}" + tombol kembali (REQ-4.8).
   - **Fallback `setOrderResult` (REQ-4.10):** bungkus `checkout-store.setOrderResult` di try/catch; pada catch simpan `OrderResult` ke `sessionStorage` (key `gm-pending-order`) lalu navigate `/checkout/confirmation?fallback=session`. Halaman konfirmasi membaca fallback setelah hidrasi dan menghapus key setelah snapshot.

### 5D. Voucher (`/products/voucher` → `/products/voucher/{platformSlug}`)

Alur dua-langkah berbasis `Platform` (entitas baru di `lib/types/platform.ts`):

1. **`Category_Landing_Page` Voucher (`/products/voucher`)** — Server Component, **cached** (`"use cache"` + `cacheTag('platforms')`). Render grid `Platform_Card` berisi `Platform` yang punya minimal satu `Voucher` (REQ-1.3).
   - Empty: "Belum ada voucher tersedia saat ini".
2. **`Platform_Detail_Page` (`/products/voucher/{platformSlug}`)** — Server Component, **cached** (`"use cache"` + `cacheTag('voucher', 'voucher:{platformSlug}')`).
   - `params: Promise<{ platformSlug: string }>` di-`await`. `notFound()` **hanya** saat `platformSlug` tidak ada di `Platform_Catalog` (REQ-3.5); error lain (fetch gagal, parsing) di-throw → ditangkap `error.tsx`.
   - Sort + pagination didukung; **filter Game TIDAK dirender** (Voucher tidak terikat Game) (REQ-3.4, REQ-8.4).
   - Header: nama `Platform`, breadcrumb `Beranda > Voucher > {Platform.name}`, jumlah `Voucher` (REQ-3.3).
   - `generateMetadata` async → title `Voucher ${Platform.name}`, indexable.
   - Empty (platform valid, 0 voucher): "Belum ada voucher untuk {Platform.name}" + tombol kembali, **tanpa** kontrol filter/sort (REQ-3.6).

### 5.5 Catatan Migrasi (Tahap 8)

Refactor ini **mengubah peran**, bukan menghapus, file existing. Dampak yang harus dipahami sebelum mulai Fase A–F:

- **`app/products/page.tsx`** — listing flat existing dipindah perannya menjadi `Category_Chooser` (3 kartu kategori). Logika `parseProductQuery` + `searchProducts` di-pindah/reuse di `Game_Detail_Page` Akun dan `Platform_Detail_Page`. `searchParams.q` tetap routable agar global search dari header tidak putus (REQ-6.6, REQ-12.2, REQ-12.4).
- **`app/products/_components/product-filter-sidebar.tsx`** + **`product-filter-form.tsx`** — tambah prop `scope: "global" | "game-detail"`. Saat `scope === "game-detail"`, multi-select Game di-hide (URL sudah memfix `gameSlug`). `filter-store` tidak boleh persist field `game` di scope ini (REQ-2.7, REQ-8.3, REQ-8.5).
- **`app/_components/popular-game-grid.tsx`** — pola visual jadi rujukan untuk `Game_Card` & `Platform_Card` baru. Tidak diubah, tapi visual di `Category_Landing_Page` harus **konsisten** dengannya (cover image, accent gradient, name + count). `Platform_Card` ikut pola yang sama namun **icon-led** (Lucide 32–48px) alih-alih cover image. Resep lengkap: [`styling-guideline.md` §6.9](./styling-guideline.md#69-game-card--platform-card).
- **`lib/types/product.ts`** — tambah field opsional `platformSlug?: string`. Kontrak hard-rule: `category === "voucher"` wajib `platformSlug`, `gameSlug` boleh kosong; `category === "account" | "topup"` wajib `gameSlug`, `platformSlug` harus kosong. Validasi di runtime via data layer (`getVouchersByPlatform` melempar `Error` saat menemukan voucher tanpa `platformSlug`) — tidak ada periode tenggang (REQ-5.2). Lihat §7.
- **`lib/data/mock-products.ts`** — voucher existing (mis. `voucher-google-play-100rb`) di-migrasi: `gameSlug` dihapus, `platformSlug` di-set sesuai (`"google-play"`, `"steam"`, dst.). Tambah `lib/data/mock-platforms.ts` minimal 5 entry: Steam, Google Play, PlayStation Store, App Store, Xbox.
- **`next.config.ts`** — tambah `redirects()` 308 untuk `/products?category=account|topup|voucher` ke route baru (REQ-6.5, REQ-12.1). Backward compat tidak dianggap selesai sampai redirect terbukti aktif (uji manual via `curl -I`).
- **Komponen baru di `app/products/_components/`:** `category-chooser.tsx`, `game-grid.tsx`, `game-card.tsx`, `platform-grid.tsx`, `platform-card.tsx`. Komponen baru di `app/checkout/_components/`: `topup-picker.tsx`.
- **Zustand `checkout-store`** — tambah field `topupSelectedId: string | null` + setter `setTopupSelectedId(id)`; ikut di-reset oleh `reset()`. Tetap ephemeral (no `persist`).

### 5.6 Definition of Done (Tahap 8 — keseluruhan)

- [ ] `/products` menampilkan `CategoryChooser` (3 kartu) — listing flat tidak ada lagi.
- [ ] `/products/account`, `/products/topup`, `/products/voucher` render grid entitas, bukan grid produk.
- [ ] `/products/account/{gameSlug}` listing `Akun` dengan filter sidebar tanpa multi-select Game.
- [ ] `/products/voucher/{platformSlug}` listing `Voucher` dengan sort + pagination, tanpa filter Game.
- [ ] `/checkout?category=topup&game={gameSlug}` memunculkan `Topup_Picker` di paling atas form, cart tidak tersentuh.
- [ ] Redirect 308 dari `/products?category=…` ke route baru aktif dan terverifikasi via `curl -I`.
- [ ] `/products?q=…` tetap routable sebagai pencarian global.
- [ ] Empty/loading/error state per route baru terpasang sesuai §9 (REQ-9.1, REQ-9.2).
- [ ] `npm run lint` ✅, `npm run build` ✅ di setiap fase A–F.

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
  /**
   * Slug Game yang terkait. WAJIB untuk `category` `"account" | "topup"`.
   * HARUS kosong saat `category === "voucher"` (Voucher dikelompokkan per Platform, bukan Game).
   */
  gameSlug?: string;
  gameName?: string;
  /**
   * Slug Platform tujuan voucher (Steam, Google Play, dst.).
   * WAJIB untuk `category === "voucher"`. HARUS kosong saat `category` `"account" | "topup"`.
   * Kontrak hard-rule REQ-5.2: data layer (`getVouchersByPlatform`) MELEMPAR `Error`
   * saat menemukan voucher tanpa `platformSlug`. Tidak ada periode tenggang migrasi.
   */
  platformSlug?: string;
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

### `Platform` — entitas baru (Tahap 8)

```ts
// lib/types/platform.ts
export interface Platform {
  /** Slug stabil (kebab-case), contoh: "steam", "google-play". */
  slug: string;
  /** Nama display, contoh: "Steam", "Google Play". */
  name: string;
  /**
   * Nama ikon Lucide React, contoh: `"Gamepad2"`, `"Smartphone"`.
   * Map ke ikon konkret di `Platform_Card`.
   */
  icon: string;
  /** Tailwind class gradient untuk accent kartu, contoh: "from-violet-500 to-accent-pink". */
  accent: string;
  /** Jumlah voucher tersedia (computed saat data access; bukan field DB). */
  productCount: number;
}

export type PlatformSlug = Platform["slug"];
```

### Kontrak hard-rule `Voucher` ↔ `Platform` (REQ-5.2)

- `category === "voucher"` → `platformSlug` **wajib** diisi, `gameSlug` boleh kosong.
- `category === "account" | "topup"` → `gameSlug` **wajib**, `platformSlug` harus kosong.
- Validasi di **runtime data layer**, bukan type system (terlalu berisik dengan discriminated union di codebase saat ini). Implementasi: `lib/utils/categorization.ts` `groupPlatformsForVouchers` dan `lib/data/platforms.ts` `getVouchersByPlatform` melempar `Error` deskriptif saat menemukan voucher tanpa `platformSlug`.
- Tidak ada periode tenggang migrasi. Mock voucher existing di `lib/data/mock-products.ts` (mis. `voucher-google-play-100rb`) di-migrasi sekaligus saat Fase A.

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
3. Smoke test 4 halaman utama di mobile viewport (375px) dan desktop (1440px): `/`, `/products`, `/products/[slug]`, `/checkout`.
4. Tab keyboard dari header sampai footer tanpa "trap".
5. Lighthouse di mode incognito: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
6. Verifikasi tidak ada error/warning di Console & Network.
7. Checkout flow end-to-end: add to cart → checkout → fill form → submit → confirmation.

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

---

## 14. Halaman 4 — Checkout (`/checkout` + `/checkout/confirmation`)

Simulasi checkout front-end tanpa integrasi payment gateway. Fokus pada UX form yang bersih, validasi inline, dan feedback yang jelas. Seluruh state checkout bersifat ephemeral (tidak di-persist ke localStorage).

### 14.1 Flow Checkout

```
Cart (Zustand) → /checkout (form) → /checkout/confirmation (success)
```

1. User klik "Checkout" / "Bayar Sekarang" dari cart atau product buy card.
2. Halaman `/checkout` menampilkan form data customer, pilihan pembayaran, input voucher, dan order summary.
3. User submit → validasi client-side → simulasi proses (delay 1.5s) → redirect ke `/checkout/confirmation`.
4. Confirmation page menampilkan detail order + instruksi pembayaran mock. Cart di-clear.

### 14.2 Tipe Domain Checkout

```ts
// lib/types/checkout.ts

export type PaymentMethodType = "bank_transfer" | "ewallet" | "qris";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  /** Nama ikon Lucide atau path ke asset */
  icon: string;
  description?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  whatsapp: string;
  /** ID in-game, wajib untuk kategori topup & account */
  gameId?: string;
  /** Server game, opsional */
  gameServer?: string;
  notes?: string;
}

export interface VoucherResult {
  code: string;
  valid: boolean;
  discountPercent?: number;
  discountAmount?: number;
  message: string;
}

export interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  voucherDiscount: number;
  voucherCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  customer: CustomerInfo;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  thumbnailUrl?: string;
}

export interface OrderResult {
  orderId: string;
  orderDate: string; // ISO
  summary: OrderSummary;
  paymentInstructions: string[];
  estimatedDelivery: string;
}
```

### 14.3 Zustand Store — Checkout

```ts
// stores/checkout-store.ts
"use client";

import { create } from "zustand";
import type {
  CustomerInfo,
  PaymentMethod,
  VoucherResult,
  OrderResult,
} from "@/lib/types/checkout";

interface CheckoutState {
  customer: Partial<CustomerInfo>;
  selectedPayment: PaymentMethod | null;
  voucher: VoucherResult | null;
  orderResult: OrderResult | null;
  isProcessing: boolean;

  setCustomer: (info: Partial<CustomerInfo>) => void;
  setPayment: (method: PaymentMethod) => void;
  applyVoucher: (result: VoucherResult) => void;
  clearVoucher: () => void;
  setProcessing: (v: boolean) => void;
  setOrderResult: (result: OrderResult) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  customer: {},
  selectedPayment: null,
  voucher: null,
  orderResult: null,
  isProcessing: false,

  setCustomer: (info) => set((s) => ({ customer: { ...s.customer, ...info } })),
  setPayment: (method) => set({ selectedPayment: method }),
  applyVoucher: (result) => set({ voucher: result }),
  clearVoucher: () => set({ voucher: null }),
  setProcessing: (v) => set({ isProcessing: v }),
  setOrderResult: (result) => set({ orderResult: result }),
  reset: () =>
    set({
      customer: {},
      selectedPayment: null,
      voucher: null,
      orderResult: null,
      isProcessing: false,
    }),
}));
```

### 14.4 Constants — Payment Methods & Voucher Codes

```ts
// lib/constants/checkout.ts

import type { PaymentMethod } from "@/lib/types/checkout";

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bca",
    type: "bank_transfer",
    name: "Bank BCA",
    icon: "Landmark",
    description: "Transfer manual ke rekening BCA",
  },
  {
    id: "mandiri",
    type: "bank_transfer",
    name: "Bank Mandiri",
    icon: "Landmark",
    description: "Transfer manual ke rekening Mandiri",
  },
  {
    id: "bri",
    type: "bank_transfer",
    name: "Bank BRI",
    icon: "Landmark",
    description: "Transfer manual ke rekening BRI",
  },
  {
    id: "gopay",
    type: "ewallet",
    name: "GoPay",
    icon: "Wallet",
    description: "Bayar via GoPay",
  },
  {
    id: "ovo",
    type: "ewallet",
    name: "OVO",
    icon: "Wallet",
    description: "Bayar via OVO",
  },
  {
    id: "dana",
    type: "ewallet",
    name: "Dana",
    icon: "Wallet",
    description: "Bayar via Dana",
  },
  {
    id: "qris",
    type: "qris",
    name: "QRIS",
    icon: "QrCode",
    description: "Scan QR dari aplikasi apapun",
  },
];

/** Mock voucher codes untuk simulasi */
export const MOCK_VOUCHERS: Record<
  string,
  { discountPercent: number; message: string }
> = {
  HEMAT10: { discountPercent: 10, message: "Diskon 10% berhasil diterapkan!" },
  GAMING20: { discountPercent: 20, message: "Diskon 20% berhasil diterapkan!" },
  NEWUSER15: {
    discountPercent: 15,
    message: "Diskon 15% untuk pengguna baru!",
  },
};
```

### 14.5 Utility — Checkout Helpers

```ts
// lib/utils/checkout.ts

import { MOCK_VOUCHERS } from "@/lib/constants/checkout";
import type { VoucherResult, OrderItem } from "@/lib/types/checkout";

export function validateVoucher(code: string): VoucherResult {
  const normalized = code.trim().toUpperCase();
  const found = MOCK_VOUCHERS[normalized];
  if (!found) {
    return {
      code: normalized,
      valid: false,
      message: "Kode voucher tidak valid.",
    };
  }
  return {
    code: normalized,
    valid: true,
    discountPercent: found.discountPercent,
    message: found.message,
  };
}

export function calculateOrderSummary(
  items: OrderItem[],
  discountPercent?: number,
): { subtotal: number; voucherDiscount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const voucherDiscount = discountPercent
    ? Math.round(subtotal * (discountPercent / 100))
    : 0;
  const total = subtotal - voucherDiscount;
  return { subtotal, voucherDiscount, total: Math.max(total, 0) };
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GM-${timestamp}-${random}`;
}
```

### 14.6 Pola Page — Checkout

```tsx
// app/checkout/page.tsx
import type { Metadata } from "next";
import CheckoutForm from "./_components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}
```

`CheckoutForm` adalah Client Component utama yang mengorkestrasikan seluruh form. Layout 2 kolom di desktop: form kiri, order summary kanan (sticky).

```tsx
// app/checkout/_components/checkout-form.tsx (sketch)
"use client";

export default function CheckoutForm() {
  // Baca cart dari useCartStore
  // Redirect ke /products jika cart kosong (useEffect + router.replace)
  // Render: CustomerInfoSection + PaymentMethodSection + VoucherSection | OrderSummaryCard
  // Submit handler: validate → setProcessing → delay 1.5s → generate order → setOrderResult → router.push('/checkout/confirmation')
}
```

### 14.7 Komponen Checkout

| Komponen                     | Tipe   | Tanggung Jawab                                                                                                                                            |
| ---------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checkout-form.tsx`          | Client | Orchestrator: layout 2 kolom, submit logic, redirect jika cart kosong                                                                                     |
| `customer-info-section.tsx`  | Client | Form fields: Nama*, Email*, WhatsApp\*, ID Game (conditional), Server, Catatan. Validasi inline (required, email format, WA format 08xx).                 |
| `payment-method-section.tsx` | Client | Radio group dengan card-style per metode. Grouped by type (Bank Transfer, E-Wallet, QRIS). Ikon Lucide.                                                   |
| `voucher-section.tsx`        | Client | Input + tombol Terapkan. State: idle / loading / valid / invalid. Badge diskon jika valid. Tombol hapus voucher.                                          |
| `order-summary-card.tsx`     | Client | Sticky sidebar: list items, subtotal, diskon, total, tombol "Bayar Sekarang" (disabled saat form incomplete/processing). Loading spinner saat processing. |
| `cart-item-row.tsx`          | Client | Baris item: thumbnail, title, qty × harga. Compact.                                                                                                       |

### 14.8 Pola Page — Confirmation

```tsx
// app/checkout/confirmation/page.tsx
import type { Metadata } from "next";
import ConfirmationContent from "./_components/confirmation-content";

export const metadata: Metadata = {
  title: "Pesanan Berhasil",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <main className="container py-8">
      <ConfirmationContent />
    </main>
  );
}
```

```tsx
// app/checkout/confirmation/_components/confirmation-content.tsx (sketch)
"use client";

// Baca orderResult dari useCheckoutStore
// Jika null → redirect ke /checkout atau /products
// Tampilkan:
//   - Ikon CheckCircle2 hijau + "Pesanan Berhasil!"
//   - Order ID (bold, copyable)
//   - Tanggal order
//   - Tabel ringkasan item
//   - Metode pembayaran yang dipilih
//   - Instruksi pembayaran (numbered list)
//   - Estimasi pengiriman
//   - Dual CTA: "Kembali ke Beranda" (/) + "Lihat Produk Lain" (/products)
// useEffect: clear cart store on mount
```

### 14.9 Validasi Form

Validasi dilakukan client-side (simulasi). Rules:

| Field          | Validasi                                                 |
| -------------- | -------------------------------------------------------- |
| Nama           | Required, min 3 karakter                                 |
| Email          | Required, format email valid                             |
| WhatsApp       | Required, format `08xxxxxxxxxx` (10-13 digit, awalan 08) |
| ID Game        | Required jika kategori item = `topup` atau `account`     |
| Server Game    | Opsional                                                 |
| Payment Method | Required (harus pilih salah satu)                        |

Error ditampilkan inline di bawah field dengan warna `text-destructive`. Focus otomatis ke field pertama yang error saat submit.

### 14.10 UX Details

- **Empty cart guard**: Jika user akses `/checkout` dengan cart kosong, redirect ke `/products` dengan toast/info.
- **Processing state**: Tombol "Bayar Sekarang" menampilkan spinner + "Memproses..." selama 1.5 detik (simulasi API call).
- **Voucher feedback**: Animasi badge muncul saat voucher valid. Shake + merah saat invalid.
- **Order summary responsive**: Di mobile, order summary tampil di bawah form (bukan sticky sidebar). Di desktop, sticky `lg:sticky lg:top-24`.
- **Breadcrumb**: Home > Checkout (di page) / Home > Checkout > Konfirmasi (di confirmation).
- **Back navigation**: Tombol "← Kembali ke Keranjang" di atas form (link ke halaman sebelumnya atau `/products`).

### 14.11 Definition of Done

- [ ] Cart kosong → redirect ke `/products`.
- [ ] Semua field required tervalidasi sebelum submit.
- [ ] Voucher code valid mengurangi total di order summary secara real-time.
- [ ] Voucher code invalid menampilkan pesan error.
- [ ] Processing state menampilkan loading indicator.
- [ ] Confirmation page menampilkan semua detail order.
- [ ] Cart ter-clear setelah order confirmed.
- [ ] Navigasi keyboard berfungsi di seluruh form (Tab, Enter submit, radio Arrow keys).
- [ ] Mobile layout berfungsi baik (form full-width, summary di bawah).
- [ ] `npm run lint` ✅, `npm run build` ✅.
- [ ] Route `/checkout` dan `/checkout/confirmation` ter-mark `ƒ` dynamic.
