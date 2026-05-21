# Design Document — Product Categorization Update

## Overview

Spec ini merestrukturisasi `Browse_System` dari listing flat berbasis `Product` menjadi alur **two-step entity-first**: pengguna memilih `Game` (untuk Akun & Topup) atau `Platform` (untuk Voucher) terlebih dulu, baru melihat `Product` yang relevan. Untuk Topup, langkah kedua langsung berpindah ke `Checkout_Page` dengan `Topup_Picker` (single-shot flow tanpa cart).

Deliverable utama spec ini ada **dua lapis**:

1. **Lapis Dokumen (mendahului implementasi)** — update `Guideline_Documents` (`project-description.md`, `feature-guideline.md`, `styling-guideline.md`) sehingga developer punya rujukan tunggal sebelum mulai ngoding. Ini adalah explicit request user: "buat guideline untuk update beberapa hal ini terlebih dahulu sebelum pengerjaan".
2. **Lapis Implementasi (di-tasks turunan)** — restrukturisasi route `app/products/**`, penambahan entitas `Platform`, `Topup_Picker` di `Checkout_Page`, `next.config.ts` redirects, dan helper `lib/utils/categorization.ts`.

Design ini fokus mendetailkan **kontrak teknis** untuk kedua lapis: bagaimana guideline dipecah, bagaimana route dipisah, di mana data flow nyangkut, dan bagaimana migrasi tidak memutus link existing.

### Goals

- Two-step browse flow per kategori dengan URL share-able dan SEO-correct.
- Entitas `Platform` first-class (bukan `gameSlug` yang dipaksakan untuk voucher).
- `Topup_Picker` di `Checkout_Page` yang reuse infrastruktur checkout existing tanpa cart.
- Backward compatibility via redirect 308 dari URL lama (`/products?category=…`).
- Guideline tertulis lebih dulu, dapat di-review terpisah dari kode.

### Non-Goals

- Implementasi kode aplikasi (di-tasks turunan, bukan di spec ini).
- Backend / payment gateway nyata.
- Light mode tweaks beyond `Game_Card` / `Platform_Card`.
- Auth & user account.

### Stack Reference

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, Zustand, Lucide.
- Konvensi `params: Promise<…>` dan `searchParams: Promise<…>` (Next 16) — wajib `await`.
- Cache Components (`"use cache"` + `cacheLife()` + `cacheTag()`); diaktifkan saat `cacheComponents: true` di-flip.
- AGENTS.md mensyaratkan konsultasi `node_modules/next/dist/docs/` saat menulis kode produksi nanti — design ini hanya menetapkan kontrak.

---

## Architecture

### High-Level Flow

```
                   ┌─────────────────────────────────────────────┐
                   │           /products  (category chooser)      │
                   │   3 kartu: Akun · Topup · Voucher            │
                   └──────────┬──────────┬──────────┬─────────────┘
                              │          │          │
                  ┌───────────┘          │          └────────────┐
                  ▼                      ▼                       ▼
        /products/account       /products/topup         /products/voucher
        (grid Game_Card)        (grid Game_Card)        (grid Platform_Card)
                  │                      │                       │
        click Game│            click Game│            click Platform
                  ▼                      ▼                       ▼
        /products/account/{gameSlug}    /checkout?category=topup    /products/voucher/{platformSlug}
        (grid Akun)                       &game={gameSlug}         (grid Voucher)
                  │                      (Topup_Picker visible)              │
                  ▼                              │                           ▼
        /products/{slug}                         ▼                    /products/{slug}
        (existing detail)              /checkout/confirmation        (existing detail)
                                       (existing flow)
```

### Folder Footprint (target setelah implementasi)

```
app/
├─ products/
│  ├─ page.tsx                      # diubah: dari listing flat → category chooser (3 kartu)
│  ├─ loading.tsx                   # diubah: skeleton chooser
│  ├─ error.tsx                     # tetap
│  ├─ account/                      # BARU
│  │  ├─ page.tsx                   # Category_Landing_Page Akun (grid Game)
│  │  ├─ loading.tsx
│  │  ├─ error.tsx
│  │  ├─ _components/
│  │  │  └─ game-grid.tsx           # shared via re-export, lihat catatan komponen
│  │  └─ [gameSlug]/                # Game_Detail_Page Akun
│  │     ├─ page.tsx
│  │     ├─ loading.tsx
│  │     ├─ error.tsx
│  │     └─ _components/
│  │        └─ account-list-header.tsx
│  ├─ topup/                        # BARU
│  │  ├─ page.tsx                   # Category_Landing_Page Topup (grid Game)
│  │  ├─ loading.tsx
│  │  └─ error.tsx
│  ├─ voucher/                      # BARU
│  │  ├─ page.tsx                   # Category_Landing_Page Voucher (grid Platform)
│  │  ├─ loading.tsx
│  │  ├─ error.tsx
│  │  └─ [platformSlug]/            # Platform_Detail_Page
│  │     ├─ page.tsx
│  │     ├─ loading.tsx
│  │     ├─ error.tsx
│  │     └─ _components/
│  │        └─ platform-list-header.tsx
│  ├─ [slug]/…                      # tidak berubah
│  └─ _components/
│     ├─ category-chooser.tsx       # BARU, dipakai di /products
│     ├─ game-grid.tsx              # BARU, shared utk /products/account & /products/topup
│     ├─ game-card.tsx              # BARU
│     ├─ platform-grid.tsx          # BARU
│     ├─ platform-card.tsx          # BARU
│     ├─ product-filter-sidebar.tsx # diubah: hilangkan filter Game (di-handle URL segment)
│     ├─ product-filter-form.tsx    # diubah: drop multi-select game di scope game-detail
│     └─ … (komponen listing existing tetap reuse di Game_Detail_Page Akun & Platform_Detail_Page)
checkout/
├─ page.tsx                         # diubah: parse `?category=topup&game=…` lalu render TopupPicker
└─ _components/
   ├─ checkout-form.tsx             # diubah: alur Topup vs alur Cart, gating button
   ├─ topup-picker.tsx              # BARU
   └─ … (existing tetap)

lib/
├─ types/
│  ├─ product.ts                    # diubah: tambah optional `platformSlug`
│  └─ platform.ts                   # BARU
├─ data/
│  ├─ mock-platforms.ts             # BARU
│  ├─ mock-products.ts              # diubah: voucher pakai platformSlug
│  ├─ platforms.ts                  # BARU (data access cached/uncached)
│  ├─ games.ts                      # diubah: tambah `getGamesForCategory(category)`
│  └─ products.ts                   # diubah: tambah `getAccountsByGame`, `getTopupsByGame`, `getVouchersByPlatform`
├─ utils/
│  └─ categorization.ts             # BARU (pure helpers)
└─ constants/
   └─ products.ts                   # diubah: CATEGORY_LABELS dipakai di chooser

next.config.ts                      # diubah: tambah `redirects()` 308 utk /products?category=…

guideline/
├─ project-description.md           # diubah: deskripsi Halaman 2 → two-step browse
├─ feature-guideline.md             # diubah: bagian §5 dipecah, tipe domain, roadmap, caching
└─ styling-guideline.md             # diubah: resep Game_Card & Platform_Card
```

### Rendering Strategy per Route

| Route                              | Strategi                                                            | Tag cache                |
| ---------------------------------- | ------------------------------------------------------------------- | ------------------------ |
| `/products`                        | Static (no data fetch, hanya 3 link kartu)                          | —                        |
| `/products/account`                | Cached (`"use cache"` + `cacheTag('games')`)                        | `games`, `games:account` |
| `/products/account/[gameSlug]`     | **Uncached** (stok akun real-time, sama seperti `/products/[slug]`) | —                        |
| `/products/topup`                  | Cached (`"use cache"` + `cacheTag('games')`)                        | `games`, `games:topup`   |
| `/products/voucher`                | Cached (`"use cache"` + `cacheTag('platforms')`)                    | `platforms`              |
| `/products/voucher/[platformSlug]` | Cached (`"use cache"` + `cacheTag('voucher', platformSlug)`)        | `voucher:{platformSlug}` |
| `/checkout?category=topup&game=…`  | Uncached, `robots: noindex` (konsisten dengan existing)             | —                        |

Catatan: directive `"use cache"` ditulis siap-aktif sebagai komentar di Tahap 7 (Polish) atau langsung aktif jika `cacheComponents: true` di-flip selama tahap restrukturisasi ini. Default behavior saat `cacheComponents: false` tetap berjalan.

---

## Data Models

### `Platform` — entitas baru

```ts
// lib/types/platform.ts
export interface Platform {
  /** Slug stabil (kebab-case), contoh: "steam", "google-play". */
  slug: string;
  /** Nama display, contoh: "Steam", "Google Play". */
  name: string;
  /** Nama ikon Lucide React, contoh: "Steam" tidak ada di Lucide → pakai "Gamepad2"; map di komponen. */
  icon: string;
  /** Tailwind class gradient untuk accent kartu, contoh: "from-violet-500 to-accent-pink". */
  accent: string;
  /** Jumlah voucher tersedia (computed saat data access). */
  productCount: number;
}

export type PlatformSlug = Platform["slug"];
```

`accent` mengikuti pola yang sudah dipakai oleh `popular-game-grid.tsx` agar visual `Platform_Card` konsisten dengan `Game_Card`.

### `Product` — perubahan minor

```ts
// lib/types/product.ts (delta)
export interface Product {
  // … field existing tetap
  gameSlug?: string; // tetap, tapi WAJIB hanya untuk category 'account' | 'topup'
  platformSlug?: string; // BARU, WAJIB hanya untuk category 'voucher'
}
```

**Kontrak hard-rule (REQ-5.2):**

- `category === "voucher"` → `platformSlug` wajib diisi, `gameSlug` boleh kosong.
- `category === "account" | "topup"` → `gameSlug` wajib, `platformSlug` harus kosong.
- Data layer (`getVouchersByPlatform`) **melempar `Error`** jika menemukan `Voucher` tanpa `platformSlug`. Tidak ada periode tenggang migrasi.

Validasi ini **tidak** diangkat ke type system (terlalu berisik dengan discriminated unions di codebase saat ini); diberlakukan di runtime di data access layer.

### Mock Data Migration

`lib/data/mock-products.ts` — voucher existing seperti `voucher-google-play-100rb` saat ini punya `gameSlug: "free-fire"` (artifact lama). Diganti jadi:

```ts
{
  id: "voucher-google-play-100rb",
  slug: "voucher-google-play-100rb",
  category: "voucher",
  // gameSlug: REMOVED
  platformSlug: "google-play",
  // … field lain tetap
}
```

`lib/data/mock-platforms.ts` — minimal 5 entry: Steam, Google Play, PlayStation Store, App Store, Xbox.

---

## Components & Module Design

### Komponen Baru

#### `Game_Card` — `app/products/_components/game-card.tsx`

```ts
interface GameCardProps {
  game: Game;
  /** Tujuan klik, ditentukan oleh halaman induk. */
  href: string;
  /** Label produk: "12 akun" | "8 paket topup". */
  countLabel: string;
}
```

- Single `<Link>` membungkus seluruh card (REQ-10.1).
- Visual ikut `popular-game-grid.tsx` agar konsisten (gambar/cover game, accent gradient, name, count).
- Tidak ada penanda visual perbedaan tujuan; konteks `Category_Landing_Page` yang menentukan (REQ-2.1).
- Hit area minimal 44×44px (REQ-10.3).
- Focus ring `--color-violet-400`.

#### `Platform_Card` — `app/products/_components/platform-card.tsx`

```ts
interface PlatformCardProps {
  platform: Platform;
  href: string; // selalu /products/voucher/{slug}
  countLabel: string; // "12 voucher"
}
```

- Struktur identik `Game_Card`, namun ikon Lucide (bukan cover image) dengan gradient `accent`.
- Reuse pola dari `popular-game-grid.tsx` namun dengan ikon-led layout.

#### `Game_Grid` & `Platform_Grid` — wrapper grid

- `app/products/_components/game-grid.tsx` — menerima `games: Game[]`, `category: "account" | "topup"`, render `Game_Card` dengan `href` yang sesuai (`/products/account/{slug}` atau `/checkout?category=topup&game={slug}`).
- `app/products/_components/platform-grid.tsx` — render `Platform_Card`.
- Empty state via prop `emptyText` (REQ-1.5).

#### `Category_Chooser` — `app/products/_components/category-chooser.tsx`

3 kartu kategori (Akun, Topup, Voucher). Bertindak sebagai pengganti listing flat di `/products`. Tidak punya state, hanya 3 `<Link>`.

#### `Topup_Picker` — `app/checkout/_components/topup-picker.tsx`

`"use client"`. Section di `Checkout_Form` yang muncul **hanya** saat `searchParams.category === "topup"` dan `game` valid.

```ts
interface TopupPickerProps {
  game: Game;
  denominations: Product[]; // pre-fetched di server, dilempar via prop
  selectedId: string | null;
  onSelect: (productId: string) => void;
}
```

- Render daftar `Topup_Denomination` sebagai `<input type="radio">` card-style (visual mirip `payment-method-section.tsx`).
- Setiap card: title, `PriceTag`, highlight singkat.
- Empty state "Belum ada paket topup untuk {Game.name}" + tombol kembali (REQ-4.8).

### Komponen yang Diubah

#### `app/products/page.tsx` — sekarang **category chooser**

- Hapus parse `searchParams` listing flat.
- Render `<CategoryChooser />`.
- Jika `searchParams` membawa `q=…` (search global), redirect ke `/products?q=…` tetap berfungsi → di Tahap implementasi, query `q` disambut dengan komponen sub-listing yang berbeda (di luar scope spec ini, tapi `q` tidak boleh memutus alur).

> **Migrasi:** logika `searchProducts(query)` saat ini di `app/products/page.tsx` dipindah ke `Game_Detail_Page` Akun dan `Platform_Detail_Page` (yang memang butuh sort/filter/pagination). Di chooser, tidak ada filter.

#### `app/checkout/page.tsx` — dukung dua mode

- Mode **Cart** (default, existing): baca `cart-store`, render `CheckoutForm` dengan ringkasan item dari cart.
- Mode **Topup** (`?category=topup&game={gameSlug}`): fetch `Game` + `Topup_Denomination[]` di server, lempar ke `CheckoutForm`. **Lewati** `cart-store` (REQ-4.9).

```ts
type Params = Promise<Record<string, string | string[] | undefined>>;

export default async function CheckoutPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const isTopupFlow = sp.category === "topup" && typeof sp.game === "string";

  if (isTopupFlow) {
    const game = await getGameBySlug(sp.game as string);
    if (!game) redirect("/products/topup");        // REQ-4.7
    const denominations = await getTopupsByGame(game.slug);
    return <CheckoutForm mode="topup" game={game} denominations={denominations} />;
  }

  return <CheckoutForm mode="cart" />;
}
```

#### `app/checkout/_components/checkout-form.tsx`

Tambahkan prop `mode: "cart" | "topup"` + `game?: Game` + `denominations?: Product[]`.

Behavior delta saat `mode === "topup"`:

1. `Topup_Picker` ter-render di posisi paling atas.
2. `selectedId` masuk Zustand `checkout-store` sebagai `topupSelectedId` (state baru).
3. `OrderSummary` bersumber dari denominasi terpilih, bukan dari cart.
4. `customer-info-section.tsx` mempelakukan `gameId` & `gameServer` sebagai required (REQ-4.6).
5. Tombol "Bayar Sekarang" disabled sampai: denominasi terpilih + customer info valid + payment method terpilih (REQ-4.5).
6. Submit handler tetap `delay(1500ms)` lalu `setOrderResult` → `router.push("/checkout/confirmation")`.
7. **Tidak** memanggil `cart-store.clear()` (cart tidak tersentuh).
8. **Fallback `checkout-store` save** (REQ-4.10): bungkus `setOrderResult` di try/catch; jika throw, simpan `OrderResult` ke `sessionStorage` key `gm-pending-order` dan navigate ke `/checkout/confirmation?fallback=session`. Halaman konfirmasi sudah punya `useHydrated` gating; akan diperluas untuk membaca dari sessionStorage saat flag fallback ada.

### Pure Helpers — `lib/utils/categorization.ts`

```ts
import type { Product, ProductCategory } from "@/lib/types/product";
import type { Game } from "@/lib/types/game";
import type { Platform } from "@/lib/types/platform";

/**
 * Mengelompokkan Product per Game untuk satu kategori.
 * Pure: tidak melakukan I/O, deterministic untuk input yang sama.
 *
 * Contract:
 *   - Output adalah list Game unik berdasarkan `gameSlug`.
 *   - `productCount` = jumlah Product dengan kategori `category` yang berbagi `gameSlug` tersebut.
 *   - `Product` tanpa `gameSlug` di-skip (bukan error).
 *   - `Product` dengan `category` ≠ parameter di-skip.
 *   - Order output: descending `productCount`, tie-breaker ascending `name` (REQ-1.6).
 *
 * @param products  Daftar produk lengkap.
 * @param category  Kategori target ("account" | "topup").
 * @param gameCatalog  Lookup Game by slug (untuk resolving `name`/`cover`).
 */
export function groupGamesByCategory(
  products: Product[],
  category: ProductCategory,
  gameCatalog: ReadonlyMap<string, Game>,
): Game[];

/**
 * Mengelompokkan Product voucher per Platform.
 * Pure. Aturan sama dengan groupGamesByCategory tapi key-nya `platformSlug`.
 *
 * Throws:
 *   - Error jika ditemukan Product dengan `category === "voucher"` tanpa `platformSlug`
 *     (kontrak hard-rule REQ-5.2).
 */
export function groupPlatformsForVouchers(
  products: Product[],
  platformCatalog: ReadonlyMap<string, Platform>,
): Platform[];
```

**Kandidat property invariants** (untuk Tahap testing nanti, tidak di-implement di spec ini):

1. **Sum-conservation:** `Σ groupGamesByCategory(products, c).productCount === products.filter(p => p.category === c && p.gameSlug).length`.
2. **Set-wise permutation invariance:** `groupGamesByCategory(shuffle(products), c)` setara dengan `groupGamesByCategory(products, c)` setelah di-sort by `slug`.
3. **Idempotence under re-projection:** apply ulang ke `products` yang sama menghasilkan list dengan `productCount` identik.

### Data Access Layer

`lib/data/games.ts` — penambahan:

```ts
export async function getGamesForCategory(
  category: "account" | "topup",
): Promise<Game[]> {
  // "use cache"; cacheLife("hours"); cacheTag("games", `games:${category}`);
  const products = MOCK_PRODUCTS.filter(
    (p) => p.category === category && p.gameSlug,
  );
  const catalog = new Map(MOCK_GAMES.map((g) => [g.slug, g] as const));
  return groupGamesByCategory(products, category, catalog);
}
```

`lib/data/platforms.ts` — file baru, paralel dengan `games.ts`:

```ts
export async function getPlatforms(): Promise<Platform[]> {
  /* groupPlatforms... */
}
export async function getPlatformBySlug(
  slug: string,
): Promise<Platform | null> {
  /* find */
}
export async function getVouchersByPlatform(
  platformSlug: string,
): Promise<Product[]> {
  // throw jika ada voucher tanpa platformSlug
}
```

`lib/data/products.ts` — penambahan:

```ts
export async function getAccountsByGame(gameSlug: string): Promise<Product[]>;
export async function getTopupsByGame(gameSlug: string): Promise<Product[]>;
```

Pola cached/uncached mengikuti existing (komentar `"use cache"` siap-aktif).

---

## URL Schema & Routing

| URL                                    | Page                                | Notes                                                            |
| -------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| `/products`                            | Category chooser (3 kartu)          | Static                                                           |
| `/products/account`                    | Game grid (Akun)                    | `params` tidak ada; `searchParams` hanya `?page=`                |
| `/products/account/{gameSlug}`         | Listing Akun untuk satu game        | Reuse filter sidebar (tanpa multi-select Game), sort, pagination |
| `/products/topup`                      | Game grid (Topup)                   | Klik card → `/checkout?category=topup&game=…`                    |
| `/products/voucher`                    | Platform grid                       |                                                                  |
| `/products/voucher/{platformSlug}`     | Listing Voucher untuk satu platform | Sort + pagination, **tanpa** filter game                         |
| `/products/{slug}`                     | Detail produk (existing)            | Tidak berubah                                                    |
| `/checkout?category=topup&game={slug}` | Checkout mode Topup                 | `Topup_Picker` aktif, cart dilewati                              |

**Konvensi Next 16:**

- `params: Promise<{ gameSlug: string }>` di Server Components — wajib `await` (sudah praktik di project ini).
- `searchParams: Promise<…>` sama.
- `notFound()` dipanggil jika `gameSlug`/`platformSlug` tidak ada di catalog (REQ-2.5, REQ-3.5).
- `error.tsx` segment menangkap exception lain (data fetch error, parsing error).

### Redirects (`next.config.ts`)

```ts
async redirects() {
  return [
    { source: "/products", has: [{ type: "query", key: "category", value: "account" }],
      destination: "/products/account", permanent: true },
    { source: "/products", has: [{ type: "query", key: "category", value: "topup" }],
      destination: "/products/topup", permanent: true },
    { source: "/products", has: [{ type: "query", key: "category", value: "voucher" }],
      destination: "/products/voucher", permanent: true },
  ];
}
```

`permanent: true` → HTTP 308. Backward compat tidak dianggap selesai sampai redirect aktif (REQ-12.1).

`/products?q=…` **tidak** di-redirect; tetap routable sebagai pencarian lintas kategori (REQ-6.6, REQ-12.2). Implementasi pencarian di chooser-page boleh di-tunda atau diserahkan ke `Game_Detail_Page`-nya masing-masing tergantung scope tasks.

### Metadata per Route

| Route                              | `title`                    | `robots`  |
| ---------------------------------- | -------------------------- | --------- |
| `/products`                        | "Kategori Produk"          | indexable |
| `/products/account`                | "Akun Game"                | indexable |
| `/products/account/[gameSlug]`     | `${Game.name} — Akun`      | indexable |
| `/products/topup`                  | "Top Up Game"              | indexable |
| `/products/voucher`                | "Voucher Digital"          | indexable |
| `/products/voucher/[platformSlug]` | `Voucher ${Platform.name}` | indexable |
| `/checkout?category=topup&...`     | "Checkout"                 | `noindex` |

`generateMetadata` async (memanfaatkan `params` Promise) untuk dynamic routes.

---

## State Management

### Zustand Stores

- `cart-store` — **tidak diubah**, tidak terlibat di alur Topup.
- `checkout-store` — penambahan field:
  ```ts
  topupSelectedId: string | null;
  setTopupSelectedId: (id: string | null) => void;
  ```
  Field ini tetap ephemeral (no `persist`).
- `filter-store` — tetap dipakai di `Game_Detail_Page` Akun dan `Platform_Detail_Page`. Field `game` (multi-select) masih ada tapi **tidak di-render** di `product-filter-form.tsx` saat scope adalah game-detail (URL sudah memfix `gameSlug`).

### URL-as-State

`Game_Detail_Page` Akun dan `Platform_Detail_Page` tetap memakai `searchParams` sebagai sumber kebenaran (sort, min/max, page). Filter Game di-drop dari sidebar (REQ-8.5).

---

## Error, Loading, Empty States

### `loading.tsx` per route baru

Skeleton mengikuti pola existing:

- `Category_Landing_Page` (Akun/Topup/Voucher): grid skeleton 8 kartu (mobile 2 kolom, desktop 4 kolom).
- `Game_Detail_Page` Akun: header skeleton + filter sidebar skeleton + grid 12 produk.
- `Platform_Detail_Page`: serupa, tanpa filter game.

### `error.tsx` per segment

Pakai pola `app/products/error.tsx`: tombol `reset()` + link kembali ke parent route.

### Empty States (Bahasa Indonesia)

| Kondisi                                                 | Teks                                       | CTA                          |
| ------------------------------------------------------- | ------------------------------------------ | ---------------------------- |
| `Category_Landing_Page` Akun/Topup tanpa Game (REQ-1.5) | "Belum ada {akun/topup} tersedia saat ini" | Kembali ke beranda           |
| `Category_Landing_Page` Voucher tanpa Platform          | "Belum ada voucher tersedia saat ini"      | Kembali ke beranda           |
| `Game_Detail_Page` Akun valid tapi 0 produk (REQ-2.6)   | "Belum ada akun untuk {Game.name}"         | Kembali ke daftar Game Akun  |
| `Platform_Detail_Page` valid tapi 0 produk (REQ-3.6)    | "Belum ada voucher untuk {Platform.name}"  | Kembali ke daftar Platform   |
| `Topup_Picker` 0 denominasi (REQ-4.8)                   | "Belum ada paket topup untuk {Game.name}"  | Kembali ke daftar Game Topup |

### Error Propagation (REQ-9.4)

Data access functions **melempar `Error`** dengan pesan deskriptif jika fetch/parse/validasi gagal. Tidak ada silent swallow. `error.tsx` di segment terdekat menangkap.

---

## Accessibility

- `Game_Card` & `Platform_Card`: single `<a>` (Next.js `<Link>`), aria-label deskriptif: `Lihat ${count} ${kategori} untuk ${name}`.
- Focus ring `outline: 2px solid var(--color-violet-400)` (sudah ada di `globals.css`).
- Hit area minimal 44×44px (mobile).
- Kontras ≥ 4.5:1 (sudah dipenuhi token saat ini).
- `Topup_Picker`: radio group dengan `<fieldset>` + `<legend>`, label per item, keyboard navigable (Tab + Space).

---

## Migration & Backward Compatibility

### Urutan Implementasi (Fase A–F)

| Fase | Lingkup                                                                                              | Shippable?                        |
| ---- | ---------------------------------------------------------------------------------------------------- | --------------------------------- |
| A    | Tipe `Platform`, `mock-platforms.ts`, `lib/data/platforms.ts`, migrasi voucher di `mock-products.ts` | Ya (build hijau, belum di-render) |
| B    | `/products/account`, `/products/topup` (Game grid) + `Game_Card` + `getGamesForCategory`             | Ya                                |
| C    | `/products/account/[gameSlug]` (Game_Detail_Page Akun) + filter form tweak                           | Ya                                |
| D    | `/products/voucher` + `/products/voucher/[platformSlug]` + `Platform_Card`                           | Ya                                |
| E    | `Topup_Picker` di `/checkout` + `checkout-form.tsx` mode dual + sessionStorage fallback              | Ya                                |
| F    | `next.config.ts` redirects + `/products` jadi chooser + polish QA                                    | Ya                                |

Setiap fase wajib lulus `npm run lint` dan `npm run build` sebelum lanjut.

### Backward Compatibility Checks

- Redirect 308 dari `/products?category=…` ke route baru — di-test manual atau via cURL: `curl -I 'http://localhost:3000/products?category=account'` harus mengembalikan `308 Permanent Redirect` ke `/products/account`.
- `/products?q=…` tetap berfungsi sebagai pencarian global (tidak dihapus).
- `app/products/page.tsx` tidak dihapus, hanya diubah perannya jadi chooser.

---

## Guideline Updates (Deliverable Lapis 1)

Bagian ini adalah **deliverable utama** spec sesuai permintaan user. Tasks turunan akan mengeksekusi tiga update berikut sebelum kode aplikasi disentuh.

### `guideline/project-description.md` — section "Halaman 2: Product Listing Page"

**Sebelum:** deskripsi listing flat dengan filter kategori sidebar.

**Sesudah:** mendeskripsikan two-step browse per kategori. Struktur yang ditambahkan:

```md
### Halaman 2: Product Listing — Two-Step Browse

#### 2A. Pemilihan Kategori (`/products`)

3 kartu: Akun · Topup · Voucher. Tidak ada listing flat.

#### 2B. Akun (`/products/account` → `/products/account/{gameSlug}`)

- Step 1: grid `Game_Card` berisi game yang punya akun.
- Step 2: listing akun untuk game terpilih (sort + filter harga/stok + pagination).

#### 2C. Topup (`/products/topup` → `/checkout?category=topup&game={gameSlug}`)

- Step 1: grid `Game_Card` berisi game yang punya paket topup.
- Step 2: langsung ke checkout dengan `Topup_Picker`. Cart dilewati.

#### 2D. Voucher (`/products/voucher` → `/products/voucher/{platformSlug}`)

- Step 1: grid `Platform_Card` (Steam, Google Play, dst.).
- Step 2: listing voucher untuk platform terpilih.
```

### `guideline/feature-guideline.md` — bagian terdampak

1. **§5 "Halaman 2 — Product Listing"** → diganti dengan §5A–5D mengikuti struktur di atas.
2. **§3 "Struktur Folder"** → tambahkan `app/products/account/`, `app/products/topup/`, `app/products/voucher/` dengan `[gameSlug]` / `[platformSlug]` segments.
3. **§ Tipe Domain (baru atau dikembangkan)** → definisi `Platform` + perubahan `Product.platformSlug` + kontrak hard-rule.
4. **§2 "Strategi Rendering & Caching"** → tambah baris untuk 5 route baru (lihat tabel di atas).
5. **§1 "Roadmap Pengerjaan"** → tambahkan **Tahap 8 — Restrukturisasi Kategori** dengan checklist Fase A–F.
6. **Catatan migrasi (baru)** → bagian khusus yang menjelaskan dampak ke `app/products/page.tsx`, `app/products/_components/product-filter-sidebar.tsx`, `app/_components/popular-game-grid.tsx`.
7. **Cross-reference ke `styling-guideline.md`** untuk resep `Game_Card` & `Platform_Card`.

### `guideline/styling-guideline.md` — section baru

Tambahkan **§6.9 Game Card / Platform Card** dengan resep:

```md
### 6.9 Game Card & Platform Card

Card entitas pada `Category_Landing_Page` Akun/Topup/Voucher.

Struktur dasar:

- Single `<Link>` membungkus seluruh card.
- Aspect 4/3 atau square; `Platform_Card` boleh icon-led (Lucide 32–48px) dengan gradient `accent`.
- Title: `text-base font-semibold`.
- Count: `text-xs text-fg-subtle tabular-nums`, contoh "12 akun" / "8 paket topup" / "5 voucher".
- Hover: `hover:border-violet-500/60 hover:shadow-glow`, lift `-translate-y-0.5`.
- Focus ring: `--color-violet-400`.
- Hit area mobile ≥ 44×44px.
```

Tambahkan ke §13 (Quick Snippets) contoh markup Game_Card / Platform_Card.

### Verifikasi Guideline Update (REQ-7.7)

Setelah ketiga file selesai:

1. `npm run lint` di root project — pastikan tidak ada error baru (markdown lint optional).
2. Manual review: setiap referensi `/products?category=…` di guideline diganti ke route baru.
3. Cross-reference link antar guideline document tetap resolve.

---

## Open Questions / Risks

1. **`platformSlug` validation site:** apakah cukup di runtime data layer, atau perlu juga di build-time script? — Default: runtime saja (sederhana). Jika dataset bertambah, tambahkan smoke test.
2. **`/products?q=…` placement:** di chooser page, hasil pencarian belum punya UX yang dijelaskan. — Default: redirect klik hasil pencarian ke `/products/{slug}` langsung; tidak perlu "search results page" baru di scope ini.
3. **Light mode untuk `Platform_Card` icon-led:** belum diuji di light mode. Risiko kecil, di-defer ke Tahap 7 polish.

---

## Definition of Done (Spec)

- [ ] `requirements.md` review-approved (sudah).
- [ ] `design.md` review-approved (file ini).
- [ ] `tasks.md` di-generate dengan checklist Fase A–F + 3 task khusus update guideline (sebelum Fase A).
- [ ] User mengkonfirmasi siap lanjut ke Phase Tasks.
