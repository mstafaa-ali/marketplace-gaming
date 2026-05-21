# Implementation Plan: Product Categorization Update

> Convert the feature design into a series of prompts for a code-generation LLM that will implement each step with incremental progress. Make sure that each prompt builds on the previous prompts, and ends with wiring things together. There should be no hanging or orphaned code that isn't integrated into a previous step. Focus ONLY on tasks that involve writing, modifying, or testing code.

## Overview

Eksekusi dibagi ke dalam dua lapis sesuai `design.md`:

1. **Lapis 1 — Guideline Updates** (Tahap 1) wajib selesai lebih dulu sebagai sumber kebenaran tunggal.
2. **Lapis 2 — Implementasi (Fase A–F)** mengikuti urutan migrasi: tipe `Platform` → category landing → game/platform detail → checkout topup → redirect & chooser.

Setiap fase wajib lulus `npm run lint` dan `npm run build` sebelum masuk fase berikutnya. Bahasa implementasi: **TypeScript** (Next.js 16 App Router, React 19, Tailwind v4, Zustand, Lucide), sesuai stack di `package.json`.

## Tasks

- [x] 1. Update Guideline_Documents (Lapis 1, mendahului implementasi)
  - [x] 1.1 Update `guideline/project-description.md` — section "Halaman 2"
    - Ganti deskripsi listing flat menjadi alur two-step browse per kategori (2A chooser, 2B Akun, 2C Topup, 2D Voucher) sesuai `design.md` § Guideline Updates
    - Pertahankan section lain (Tech Stack, Hero, Detail) tanpa perubahan substansi
    - _Requirements: 7.1_

  - [x] 1.2 Update `guideline/feature-guideline.md` — restrukturisasi §5 + tipe domain + roadmap
    - Pecah §5 lama jadi §5A–5D (chooser, Akun, Topup, Voucher) dengan kontrak URL & rendering per route
    - Tambah definisi tipe `Platform` dan perubahan `Product.platformSlug` (kontrak hard-rule REQ-5.2) di "§ Tipe Domain (Kontrak Data)"
    - Tambah baris route baru ke §2 "Strategi Rendering & Caching" (cached `games`/`platforms`/`voucher:{platformSlug}` + uncached `Game_Detail_Page` Akun + uncached checkout topup)
    - Tambah Tahap 8 "Restrukturisasi Kategori" di §1 Roadmap dengan checklist Fase A–F
    - Tambah catatan migrasi yang menjelaskan dampak ke `app/products/page.tsx`, `app/products/_components/product-filter-sidebar.tsx`, `app/_components/popular-game-grid.tsx`
    - Tambah cross-reference ke `styling-guideline.md` §6.9 untuk resep `Game_Card` & `Platform_Card`
    - _Requirements: 5.6, 6.1, 6.2, 6.3, 6.4, 7.2, 7.4, 7.5_

  - [x] 1.3 Update `guideline/styling-guideline.md` — resep `Game_Card` & `Platform_Card`
    - Tambah §6.9 "Game Card & Platform Card" dengan struktur (single `<Link>` wrap, aspect 4/3 atau square, icon-led untuk Platform_Card, hover lift, focus ring `--color-violet-400`, hit area ≥ 44×44px)
    - Tambah contoh markup `Game_Card` dan `Platform_Card` di §13 (Quick Snippets)
    - _Requirements: 7.3, 10.1, 10.2, 10.3, 10.4_

  - [x] 1.4 Jalankan `npm run lint` setelah guideline diperbarui
    - Pastikan tidak ada error baru karena perubahan guideline (Markdown lint optional jika tidak terkonfigurasi)
    - _Requirements: 7.6, 7.7_

- [x] 2. Checkpoint — Guideline approved sebelum kode disentuh
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Fase A — Tipe `Platform`, data layer, dan helper kategorisasi
  - [x] 3.1 Buat tipe `Platform` di `lib/types/platform.ts` & perluas `Product`
    - Definisikan `interface Platform` dengan field `slug`, `name`, `icon`, `accent`, `productCount` plus alias `PlatformSlug`
    - Tambahkan `platformSlug?: string` opsional di `interface Product` (`lib/types/product.ts`); dokumentasikan kontrak hard-rule via JSDoc
    - _Requirements: 5.1, 5.2_

  - [x] 3.2 Buat data mock `Platform` di `lib/data/mock-platforms.ts`
    - Minimal 5 entry: Steam, Google Play, PlayStation Store, App Store, Xbox
    - Setiap entry punya `slug`, `name`, `icon` (Lucide icon name), `accent` (Tailwind gradient class). `productCount` di-set 0 (akan di-compute oleh data access)
    - _Requirements: 5.3_

  - [x] 3.3 Migrasi mock voucher di `lib/data/mock-products.ts` ke `platformSlug`
    - Hapus `gameSlug` dari semua entry `category === "voucher"` (mis. `voucher-google-play-100rb`)
    - Set `platformSlug` yang sesuai (mis. `"google-play"`, `"steam"`, dst.)
    - _Requirements: 5.5_

  - [x] 3.4 Implementasi pure helpers di `lib/utils/categorization.ts`
    - Fungsi `groupGamesByCategory(products, category, gameCatalog)` — return `Game[]` unik per `gameSlug`, sort descending `productCount`, tie-breaker ascending `name`
    - Fungsi `groupPlatformsForVouchers(products, platformCatalog)` — return `Platform[]` unik per `platformSlug`; **throw `Error`** jika menemukan `Voucher` tanpa `platformSlug` (kontrak hard-rule)
    - Tidak ada I/O, deterministic
    - _Requirements: 1.6, 5.2, 5.4, 11.1, 11.2_

  - [x]\* 3.5 Property test 1 — Sum-conservation untuk `groupGamesByCategory`
    - **Property 1: Sum-conservation**
    - **Validates: Requirements 11.1, 11.3**
    - Set up test framework (vitest + fast-check) jika belum ada (`devDependencies` + skrip `test`)
    - Generate `Product[]` arbitrary; assert `Σ groupGamesByCategory(products, c).productCount === products.filter(p => p.category === c && p.gameSlug).length`

  - [x]\* 3.6 Property test 2 — Set-wise permutation invariance untuk `groupGamesByCategory`
    - **Property 2: Permutation invariance**
    - **Validates: Requirements 11.3**
    - Untuk dua input list `products` dan `shuffle(products)`, hasil `groupGamesByCategory(...)` setara setelah di-sort by `slug` (urut input tidak mengubah hasil set-wise)

  - [x]\* 3.7 Property test 3 — Idempotence under re-projection untuk `groupGamesByCategory`
    - **Property 3: Idempotence**
    - **Validates: Requirements 11.3**
    - Apply `groupGamesByCategory` ulang ke `products` yang sama menghasilkan list dengan `productCount` identik

  - [x]\* 3.8 Property test 4 — `groupPlatformsForVouchers` throws ketika voucher tanpa `platformSlug`
    - **Property 4: Hard-rule enforcement**
    - **Validates: Requirements 5.2**
    - Generate `Product[]` yang mengandung minimal satu voucher dengan `platformSlug` kosong; assert `groupPlatformsForVouchers(...)` melempar `Error`

  - [x] 3.9 Implementasi `lib/data/platforms.ts`
    - `getPlatforms()` — pakai `groupPlatformsForVouchers` + `MOCK_PLATFORMS`; mengikuti pola cached/uncached `lib/data/games.ts` (komentar `"use cache"`/`cacheLife("hours")`/`cacheTag("platforms")` siap-aktif)
    - `getPlatformBySlug(slug)` — return `Platform | null`
    - `getVouchersByPlatform(platformSlug)` — return `Product[]`; throw `Error` jika voucher tanpa `platformSlug` ditemukan
    - _Requirements: 5.4, 9.4_

  - [x] 3.10 Perluas `lib/data/games.ts` & `lib/data/products.ts`
    - `getGamesForCategory(category)` di `games.ts` — pakai `groupGamesByCategory`; `cacheTag("games", "games:account" | "games:topup")` siap-aktif
    - `getAccountsByGame(gameSlug)` & `getTopupsByGame(gameSlug)` di `products.ts` — uncached untuk akun (stok real-time), cached untuk topup
    - Pastikan throw `Error` deskriptif saat fetch/parse gagal (REQ-9.4)
    - _Requirements: 5.4, 6.3, 9.4_

- [x] 4. Checkpoint — Fase A build hijau, belum di-render
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Fase B — Category Landing Pages: Akun & Topup
  - [x] 5.1 Buat komponen `app/products/_components/game-card.tsx`
    - Single `<Link>` membungkus seluruh card (REQ-10.1)
    - Props: `game: Game`, `href: string`, `countLabel: string`
    - aria-label deskriptif (mis. "Lihat 12 akun untuk Mobile Legends")
    - Visual mengikuti `popular-game-grid.tsx` (cover image, accent gradient, name, count) dengan token violet-400 untuk focus ring
    - _Requirements: 1.4, 2.1, 10.1, 10.2, 10.3, 10.4_

  - [x] 5.2 Buat komponen `app/products/_components/game-grid.tsx`
    - Props: `games: Game[]`, `category: "account" | "topup"`, `emptyText: string`
    - Render `Game_Card` dengan `href` `/products/account/{slug}` saat `category === "account"`, atau `/checkout?category=topup&game={slug}` saat `category === "topup"`
    - Empty state ketika `games.length === 0`
    - _Requirements: 1.1, 1.2, 1.5, 2.1, 4.1_

  - [x] 5.3 Buat route `app/products/account/page.tsx` (Category_Landing_Page Akun)
    - Server Component, render `<GameGrid />` dengan hasil `getGamesForCategory("account")`
    - `metadata` title "Akun Game", indexable
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 6.1, 6.4_

  - [x] 5.4 Buat `loading.tsx` dan `error.tsx` untuk `/products/account`
    - `loading.tsx` skeleton: grid 8 kartu (mobile 2 kolom, desktop 4 kolom)
    - `error.tsx` mengikuti pola `app/products/error.tsx` dengan tombol `reset()` + link ke beranda
    - _Requirements: 9.1, 9.2_

  - [x] 5.5 Buat route `app/products/topup/page.tsx` (Category_Landing_Page Topup)
    - Server Component, render `<GameGrid />` dengan hasil `getGamesForCategory("topup")` (`href` ke `/checkout?category=topup&game={slug}`)
    - `metadata` title "Top Up Game", indexable
    - _Requirements: 1.2, 1.4, 1.5, 1.6, 4.1, 6.1, 6.4_

  - [x] 5.6 Buat `loading.tsx` dan `error.tsx` untuk `/products/topup`
    - Reuse pola skeleton + error dari `/products/account`
    - _Requirements: 9.1, 9.2_

  - [x]\* 5.7 Unit tests untuk `Game_Card` & `Game_Grid`
    - Render snapshot, aria-label correctness, href routing per `category`
    - _Requirements: 2.1, 4.1, 10.1_

- [x] 6. Fase C — Game_Detail_Page Akun
  - [x] 6.1 Buat route `app/products/account/[gameSlug]/page.tsx`
    - Server Component, `params: Promise<{ gameSlug: string }>` di-`await`
    - Panggil `getGameBySlug` & `getAccountsByGame`; `notFound()` saat game tidak ada (REQ-2.5)
    - Reuse listing components existing (`product-grid`, `product-pagination`, `product-active-filters`, `product-listing-toolbar`) dengan filter `gameSlug` ter-fix dari URL
    - `generateMetadata` async — title `${Game.name} — Akun`, indexable
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 6.2, 6.3, 6.4_

  - [x] 6.2 Buat `loading.tsx` dan `error.tsx` untuk `/products/account/[gameSlug]`
    - Skeleton: header + filter sidebar + grid 12 produk
    - Error boundary segment dengan tombol `reset()` + link ke `/products/account`
    - _Requirements: 9.1, 9.2_

  - [x] 6.3 Buat `app/products/account/[gameSlug]/_components/account-list-header.tsx`
    - Header: nama `Game`, breadcrumb "Beranda > Akun > {Game.name}", jumlah Akun yang ditampilkan
    - _Requirements: 2.3_

  - [x] 6.4 Update `app/products/_components/product-filter-form.tsx` agar scope-aware
    - Tambah prop `scope: "global" | "game-detail"`; saat `"game-detail"`, sembunyikan multi-select Game (URL sudah memfix `gameSlug`)
    - Tetap render filter rentang harga, status stok, dan kategori (sesuai context)
    - Pastikan `filter-store` tidak mempersist field `game` saat scope game-detail
    - _Requirements: 2.7, 8.3, 8.5_

  - [x]\* 6.5 Unit tests untuk filter form scope-aware
    - Assert multi-select Game tersembunyi saat `scope === "game-detail"`
    - _Requirements: 8.5_

- [x] 7. Checkpoint — Fase A–C lulus build & lint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Fase D — Voucher routes
  - [x] 8.1 Buat komponen `app/products/_components/platform-card.tsx`
    - Single `<Link>` ke `/products/voucher/{slug}`, struktur identik `Game_Card` namun icon-led (Lucide icon 32–48px) dengan gradient `accent`
    - aria-label "Lihat {count} voucher untuk {Platform.name}"
    - _Requirements: 3.1, 10.1, 10.2, 10.3, 10.4_

  - [x] 8.2 Buat komponen `app/products/_components/platform-grid.tsx`
    - Props: `platforms: Platform[]`, `emptyText: string`
    - Render `Platform_Card` per platform, empty state saat kosong
    - _Requirements: 1.3, 1.5_

  - [x] 8.3 Buat route `app/products/voucher/page.tsx` (Category_Landing_Page Voucher)
    - Server Component, panggil `getPlatforms()`; render `<PlatformGrid />`
    - `metadata` title "Voucher Digital", indexable
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 6.1, 6.4_

  - [x] 8.4 Buat `loading.tsx` dan `error.tsx` untuk `/products/voucher`
    - Skeleton grid 8 kartu, error boundary segment
    - _Requirements: 9.1, 9.2_

  - [x] 8.5 Buat route `app/products/voucher/[platformSlug]/page.tsx` (Platform_Detail_Page)
    - Server Component, `params` di-`await`; panggil `getPlatformBySlug` & `getVouchersByPlatform`
    - `notFound()` HANYA saat `platformSlug` tidak ada di catalog (REQ-3.5); error lain (fetch gagal) di-throw → ditangkap oleh `error.tsx`
    - Empty state khusus saat valid namun 0 voucher (TANPA filter/sort UI) per REQ-3.6
    - `sort` + pagination didukung; filter Game **TIDAK** dirender
    - `generateMetadata` async — title `Voucher ${Platform.name}`, indexable
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 6.2, 6.3, 6.4, 8.4_

  - [x] 8.6 Buat `loading.tsx` dan `error.tsx` untuk `/products/voucher/[platformSlug]`
    - Skeleton serupa Game_Detail_Page tanpa filter game
    - _Requirements: 9.1, 9.2_

  - [x] 8.7 Buat `app/products/voucher/[platformSlug]/_components/platform-list-header.tsx`
    - Header: nama `Platform`, breadcrumb "Beranda > Voucher > {Platform.name}", jumlah Voucher
    - _Requirements: 3.3_

  - [x]\* 8.8 Unit tests untuk `Platform_Card` dan empty state Voucher
    - Render snapshot + aria-label + verifikasi tidak ada filter game di Platform_Detail_Page
    - _Requirements: 8.4_

- [x] 9. Checkpoint — Fase A–D lulus build, navigasi end-to-end via UI
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Fase E — Topup_Picker di `Checkout_Page`
  - [x] 10.1 Perluas `stores/checkout-store.ts` dengan state `topupSelectedId`
    - Tambah field `topupSelectedId: string | null` dan setter `setTopupSelectedId(id)`
    - Sertakan ke fungsi `reset()` agar kembali ke `INITIAL_STATE`
    - _Requirements: 4.4_

  - [x] 10.2 Buat komponen `app/checkout/_components/topup-picker.tsx`
    - `"use client"`, props: `game: Game`, `denominations: Product[]`, `selectedId: string | null`, `onSelect: (id) => void`
    - Render daftar denominasi sebagai radio card (visual mirip `payment-method-section.tsx`) dengan title, `PriceTag`, highlight singkat
    - Empty state "Belum ada paket topup untuk {Game.name}" + tombol kembali ke `/products/topup`
    - `<fieldset>` + `<legend>` untuk aksesibilitas radio group, keyboard navigable (Tab + Space)
    - _Requirements: 4.2, 4.3, 4.8_

  - [x] 10.3 Update `app/checkout/page.tsx` untuk dukung dua mode (cart vs topup)
    - Parse `searchParams.category` dan `searchParams.game` (di-`await`)
    - Saat mode topup: fetch `Game` & `Topup_Denomination[]`; redirect 302/307 ke `/products/topup` jika `gameSlug` invalid (REQ-4.7); render `<CheckoutForm mode="topup" game={...} denominations={...} />`
    - Saat mode cart (default): perilaku existing
    - _Requirements: 4.1, 4.2, 4.7_

  - [x] 10.4 Update `app/checkout/_components/checkout-form.tsx` untuk dual mode
    - Tambah props `mode: "cart" | "topup"`, `game?: Game`, `denominations?: Product[]`
    - Saat `mode === "topup"`: render `<TopupPicker />` di posisi paling atas form, bind ke `topupSelectedId` Zustand
    - `OrderSummary` bersumber dari denominasi terpilih (bukan cart) saat mode topup
    - Tombol "Bayar Sekarang" disabled sampai (a) denominasi terpilih, (b) customer info valid, (c) payment method terpilih (REQ-4.5)
    - **TIDAK** memanggil `cart-store` saat mode topup (REQ-4.9)
    - _Requirements: 4.2, 4.4, 4.5, 4.9_

  - [x] 10.5 Update `app/checkout/_components/customer-info-section.tsx` untuk topup flow
    - Tambah prop `requireGameFields: boolean`; saat `true`, `gameId` & `gameServer` mandatory dengan validasi `aria-invalid` + `aria-describedby`
    - Pastikan `validateCustomerInfo` di `lib/utils/checkout.ts` mendukung kondisi ini
    - _Requirements: 4.6_

  - [x] 10.6 Implementasi sessionStorage fallback saat `setOrderResult` gagal
    - Bungkus `checkout-store.setOrderResult(...)` di try/catch di `checkout-form.tsx`
    - Pada catch: simpan `OrderResult` ke `sessionStorage` key `gm-pending-order` lalu navigate `/checkout/confirmation?fallback=session`
    - _Requirements: 4.10_

  - [x] 10.7 Update `app/checkout/confirmation/_components/confirmation-content.tsx` untuk membaca fallback
    - Saat `searchParams.fallback === "session"` dan tidak ada order di Zustand, baca `sessionStorage.getItem("gm-pending-order")` setelah hidrasi (`useHydrated` gating)
    - Hapus key setelah snapshot di-capture untuk menghindari replay
    - _Requirements: 4.10_

  - [x]\* 10.8 Integration test untuk alur Topup checkout end-to-end
    - Skenario: visit `/checkout?category=topup&game=mobile-legends` → pilih denominasi → isi customer info → submit → assert navigate ke `/checkout/confirmation` dengan order data
    - _Requirements: 4.2, 4.4, 4.5, 4.6, 4.10_

- [x] 11. Checkpoint — Topup flow shippable, cart flow tidak regresi
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Fase F — Redirects, Category_Chooser, dan finalisasi `/products`
  - [x] 12.1 Update `next.config.ts` dengan redirect 308 dari URL legacy
    - Tambah `redirects()` untuk `/products?category=account|topup|voucher` ke `/products/account|topup|voucher` (`permanent: true`)
    - Verifikasi via `curl -I 'http://localhost:3000/products?category=account'` mengembalikan `308 Permanent Redirect`
    - _Requirements: 6.5, 12.1_

  - [x] 12.2 Buat komponen `app/products/_components/category-chooser.tsx`
    - Tiga `<Link>` kartu (Akun, Topup, Voucher) tanpa state
    - Visual mengikuti pola card existing di landing
    - _Requirements: 6.1_

  - [x] 12.3 Refactor `app/products/page.tsx` menjadi category chooser
    - Hapus parse `searchParams` listing flat; render `<CategoryChooser />`
    - Pertahankan `searchParams.q` agar tidak memutus pencarian global (TIDAK di-redirect; biarkan tetap routable per REQ-6.6 / REQ-12.2)
    - Pindahkan helper `searchProducts` reuse ke `Game_Detail_Page` Akun & `Platform_Detail_Page` jika belum dilakukan di Fase C/D
    - _Requirements: 6.1, 6.6, 12.2, 12.4_

  - [x] 12.4 Update `app/products/loading.tsx` untuk skeleton chooser
    - Skeleton 3 kartu kategori (bukan grid produk)
    - _Requirements: 9.1_

  - [x]\* 12.5 Smoke test redirect 308 & chooser routing
    - Curl atau e2e: `/products?category=account` → 308 → `/products/account`; `/products?q=keyword` tidak di-redirect
    - _Requirements: 6.5, 6.6, 12.1, 12.2_

- [x] 13. Final checkpoint — All routes, all phases, build hijau
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP. Core implementation tasks (non-`*`) MUST be implemented.
- Each task references specific requirements/sub-requirements for traceability.
- Task 1 (Guideline updates) MUST complete before any code in Fase A–F per REQ-7.6.
- Property tests (3.5–3.8) sit close to the helper implementation (3.4) to catch regressions early.
- `app/products/page.tsx` is touched in two phases (Fase C indirectly via filter form, Fase F directly as chooser); coordinate via the dependency graph below.
- `lib/data/products.ts` and `lib/data/games.ts` are extended in Fase A; do not edit them again outside that fase unless required.
- Test framework setup (vitest + fast-check) is bundled into the first property test sub-task (3.5) so it lands only when property tests are actually implemented.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "3.4"] },
    { "id": 4, "tasks": ["3.5", "3.6", "3.7", "3.8", "3.9", "3.10"] },
    { "id": 5, "tasks": ["5.1", "8.1"] },
    { "id": 6, "tasks": ["5.2", "8.2"] },
    { "id": 7, "tasks": ["5.3", "5.5", "8.3", "6.4"] },
    { "id": 8, "tasks": ["5.4", "5.6", "8.4", "5.7"] },
    { "id": 9, "tasks": ["6.1", "8.5"] },
    { "id": 10, "tasks": ["6.2", "6.3", "8.6", "8.7", "6.5", "8.8"] },
    { "id": 11, "tasks": ["10.1"] },
    { "id": 12, "tasks": ["10.2", "10.5"] },
    { "id": 13, "tasks": ["10.3", "10.4"] },
    { "id": 14, "tasks": ["10.6"] },
    { "id": 15, "tasks": ["10.7"] },
    { "id": 16, "tasks": ["10.8"] },
    { "id": 17, "tasks": ["12.1", "12.2"] },
    { "id": 18, "tasks": ["12.3"] },
    { "id": 19, "tasks": ["12.4", "12.5"] }
  ]
}
```
