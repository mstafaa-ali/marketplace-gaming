markdown_content = """# AI Agent Guideline: Front-End Digital Gaming Marketplace

## 1. Project Overview & Context

- **Project Name:** Digital Gaming Marketplace (Front-End)
- **Industry:** Gaming & E-Commerce
- **Core Business:** Jual beli akun game, top-up game (currency/diamonds), dan penjualan voucher game digital.
- **Primary Focus:** High-fidelity UI/UX, fully responsive (mobile-first approach), optimal SEO performance, and production-ready clean code.

## 2. Core Tech Stack Rules (Strict Compliance)

AI Agent harus menulis kode dan memberikan solusi **hanya** menggunakan ekosistem berikut:

- **Framework:** Next.js (App Router, React)
- **Language:** TypeScript (Strict Mode, explicit interfaces/types for all data structures)
- **Styling:** Tailwind CSS (Utility-first, responsive design variants `sm:`, `md:`, `lg:`)
- **UI Components:** Shadcn/ui (Tailwind + Radix UI primitives)
- **State Management:** Zustand (For client-side filtering, sorting, and search state)
- **Icons:** Lucide React

---

## 3. Scope of Work & Page Requirements

### Halaman 1: Landing Page

- **Hero Section:** Visual yang imersif (gaming vibes), headline yang persuasif, dan Call to Action (CTA) utama.
- **Banner Promo:** Komponen carousel/slider responsif untuk menampilkan promo diskon top-up atau akun.
- **Kategori Game Populer:** Grid berisi game utama (Mobile Legends, PUBG Mobile, Valorant) menggunakan logo/card yang interaktif.
- **Produk Unggulan:** Menampilkan _flash sale_ atau produk terlaris dengan badge diskon.
- **Testimoni Customer:** Komponen review/rating grid yang bersih dan estetis.
- **FAQ Section:** Menggunakan komponen Accordion (shadcn/ui) untuk memuat pertanyaan umum seputar keamanan transaksi.
- **Global Layout:** Header Navigation (dengan Search Bar global & Floating Cart/Profile icon) dan Footer.

### Halaman 2: Product Listing — Two-Step Browse

Listing flat berbasis produk diganti dengan alur **two-step entity-first**: pengguna memilih `Game` (untuk Akun & Topup) atau `Platform` (untuk Voucher) lebih dulu, baru melihat produk yang relevan. Tidak ada lagi grid produk flat di entry kategori.

#### 2A. Pemilihan Kategori (`/products`)

- **Category Chooser:** 3 kartu navigasi (Akun · Topup · Voucher). Tidak ada listing produk pada halaman ini.
- **Tujuan:** memaksa pengguna mempersempit konteks sebelum melihat katalog produk.

#### 2B. Akun (`/products/account` → `/products/account/{gameSlug}`)

- **Step 1 — Game Grid:** grid `Game_Card` berisi `Game` yang memiliki minimal satu Akun, lengkap dengan jumlah produk per game (mis. "12 akun").
- **Step 2 — Account Listing:** daftar `Akun` untuk `Game` terpilih, mendukung `sort` (`Termurah`, `Termahal`, `Terbaru`), filter rentang harga & status stok, dan pagination yang sinkron dengan URL Query Parameters (`?page=1&sort=price_asc`).
- **Detail Akun:** klik Akun → `/products/{slug}` (halaman detail existing, tidak berubah).

#### 2C. Topup (`/products/topup` → `/checkout?category=topup&game={gameSlug}`)

- **Step 1 — Game Grid:** grid `Game_Card` berisi `Game` yang memiliki minimal satu paket topup.
- **Step 2 — Direct Checkout:** klik kartu game langsung membuka `Checkout_Page` dengan `Topup_Picker` (radio card pemilihan `Topup_Denomination`). `cart-store` dilewati — alur Topup bersifat single-shot tanpa keranjang.
- **Field Mandatory:** `gameId` dan `gameServer` wajib diisi pada `customer-info-section` saat alur Topup aktif.

#### 2D. Voucher (`/products/voucher` → `/products/voucher/{platformSlug}`)

- **Step 1 — Platform Grid:** grid `Platform_Card` (Steam, Google Play, PlayStation Store, App Store, Xbox, dst.). `Platform` adalah entitas berdiri sendiri, lepas dari `Game`.
- **Step 2 — Voucher Listing:** daftar `Voucher` untuk `Platform` terpilih, mendukung `sort` dan pagination. Filter Game tidak dirender (Voucher tidak terikat ke Game).
- **Detail Voucher:** klik Voucher → `/products/{slug}` (halaman detail existing).

#### Komponen Bersama

- **Product Card:** tetap dipakai di Step 2 Akun & Voucher, menampilkan thumbnail game/akun, judul, spesifikasi singkat, harga (sebelum & sesudah diskon), dan badge status (`Ready` / `Sold Out`).
- **Search Input:** pencarian global lintas kategori tetap routable via `/products?q={keyword}` (tidak dihapus, tidak di-redirect).
- **Pagination / Load More:** kontrol navigasi sinkron dengan URL Query Parameters (`?page=1&sort=price_asc`).

### Halaman 3: Product Detail Page

- **Detail & Spesifikasi:** Tampilan galeri foto akun atau banner top-up, judul, dan status keamanan (e.g., "100% Anti-Minus").
- **Deskripsi & Spesifikasi Akun:** Layout yang rapi menggunakan tab atau list untuk informasi _detail skin_, _rank_, _level_, dan kelengkapan data login.
- **Pricing & CTA:** Card mengambang (sticky on desktop) berisi harga pas, kuantitas, dan tombol "Beli Sekarang".
- **Related Products:** Rekomendasi produk serupa dari kategori game yang sama.

---

## 4. Architectural & Rendering Guidelines for AI

AI Agent harus menerapkan strategi rendering Next.js yang tepat untuk efisiensi performa dan SEO:

- **Static Pages (SSG/ISR):** Gunakan untuk Landing Page agar _loading speed_ maksimal.
- **Dynamic Server-Side (SSR):** Gunakan pada _Product Detail Page_ (terutama kategori Jual Beli Akun) untuk memastikan status stok (`Ready` atau `Sold Out`) selalu _real-time_ dan mencegah _double-buy_.
- **Client-Side State (Zustand):** Gunakan untuk mengelola interaksi filter dan sorting pada _Product Listing_ tanpa memicu _full page reload_.

---

## 5. Coding Standards & UI/UX Constraints

### Clean Code & Architecture

- **Component-Driven Development:** Pisahkan komponen menjadi _reusable atomic components_ (e.g., `ProductCard.tsx`, `Badge.tsx`, `FilterSidebar.tsx`).
- **Type Safety:** Semua properti komponen wajib menggunakan TypeScript interface. Dilarang menggunakan tipe `any`.
- **Folder Structure:** Ikuti konvensi Next.js App Router standar:
