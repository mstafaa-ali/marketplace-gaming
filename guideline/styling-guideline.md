# Styling Guideline — Digital Gaming Marketplace

Design system untuk Digital Gaming Marketplace. Identitas visual: **gaming, modern, premium, dark-first, dengan biru-ungu (cyan-purple) sebagai warna utama**. Stack styling: **Tailwind CSS v4 + shadcn/ui + Radix primitives + Lucide React**.

> Stack di project ini sudah Tailwind v4 (`@tailwindcss/postcss`). **Tidak ada** `tailwind.config.js`. Token didefinisikan langsung di `app/globals.css` melalui `@theme`. Jangan buat `tailwind.config.js` kecuali benar-benar diperlukan.

---

## 1. Brand Personality

| Atribut         | Penjelasan                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------- |
| **Energetic**   | Mengangkat vibe gaming yang dinamis, ada gradient & glow halus pada CTA dan hero.            |
| **Trustworthy** | Tipografi jelas, kontras tinggi, status keamanan ("100% Anti-Minus") menonjol tanpa berisik. |
| **Premium**     | Spasi longgar, ornamentasi minimal, surface gelap dengan aksen cyan-purple neon.             |
| **Accessible**  | Semua warna dipasangkan dengan kontras AA minimal. Focus ring jelas.                         |

Mood reference: cyber-cyan, neon arcade, neo-tokyo lite. Hindari kesan "kid gaming" yang terlalu kartun.

---

## 2. Color System

### 2.1 Brand Palette — Cyan-Purple (Biru-Ungu)

Skala 50–950 untuk warna utama (cyan). Nilai sudah dicek kontrasnya pada surface gelap default.

| Token        | HEX       | Penggunaan                                                 |
| ------------ | --------- | ---------------------------------------------------------- |
| `violet-50`  | `#F0F9FF` | Highlight teks pada surface gelap, hover background terang |
| `violet-100` | `#D9F2FF` | Soft chip background                                       |
| `violet-200` | `#A8E4FF` | Border subtle, badge soft                                  |
| `violet-300` | `#5FD4FF` | Secondary accent, link hover                               |
| `violet-400` | `#22C5E0` | Aksen sekunder, ikon aktif                                 |
| `violet-500` | `#06B6D4` | **Primary brand color** — CTA, active state                |
| `violet-600` | `#0891B2` | CTA hover/pressed                                          |
| `violet-700` | `#0E7490` | CTA pressed, ring offset                                   |
| `violet-800` | `#155E75` | Surface elevated kontras                                   |
| `violet-900` | `#164E63` | Surface deep, hero gradient stop                           |
| `violet-950` | `#0C2D3A` | Background utama (alternatif), gradient deep               |

Skala purple (secondary brand):

| Token        | HEX       | Penggunaan                     |
| ------------ | --------- | ------------------------------ |
| `purple-500` | `#A855F7` | Secondary brand, gradient stop |
| `purple-600` | `#9333EA` | Secondary hover                |
| `purple-700` | `#7E22CE` | Secondary pressed              |
| `purple-800` | `#6B21A8` | Accent surface                 |

### 2.2 Neutral — Deep Ocean

Surface dan teks utama.

| Token           | HEX       | Penggunaan                           |
| --------------- | --------- | ------------------------------------ |
| `bg`            | `#070B14` | Background utama (dark mode default) |
| `bg-elevated`   | `#0C1222` | Card, sheet, header                  |
| `bg-overlay`    | `#111A33` | Modal, dropdown, popover             |
| `border`        | `#1A2744` | Border default                       |
| `border-strong` | `#264060` | Border emphasis, divider             |
| `fg`            | `#F0F8FF` | Teks primer                          |
| `fg-muted`      | `#A8C4E0` | Teks sekunder                        |
| `fg-subtle`     | `#6B8AAD` | Teks tertiary, placeholder           |

### 2.3 Accent — Plasma

Untuk highlight CTA sekunder, badge promo, glow.

| Token          | HEX       | Penggunaan                          |
| -------------- | --------- | ----------------------------------- |
| `accent-pink`  | `#D946EF` | Badge flash sale, glow              |
| `accent-cyan`  | `#00E5FF` | Highlight info, link sekunder       |
| `accent-amber` | `#F5B544` | Rating bintang, badge "Best Seller" |

### 2.4 Semantic

| Token          | HEX       | Penggunaan                            |
| -------------- | --------- | ------------------------------------- |
| `success`      | `#10B981` | Status `Ready`, success toast         |
| `success-soft` | `#0F3D2E` | Background badge ready                |
| `danger`       | `#EF4444` | Error, status `Sold Out`, harga coret |
| `danger-soft`  | `#3F1717` | Background badge sold out             |
| `warning`      | `#F59E0B` | Notice, warning                       |
| `info`         | `#3B82F6` | Notice info                           |

### 2.5 Light Mode (opsional, tahap berikut)

Prioritas saat ini adalah **dark-first**. Light mode boleh ditambahkan setelah dark mode stabil. Mapping yang disarankan:

- `bg` → `#F4FAFF`, `bg-elevated` → `#FFFFFF`, `bg-overlay` → `#FFFFFF`
- `fg` → `#0C1A2E`, `fg-muted` → `#3D5A7A`, `fg-subtle` → `#6B8AAD`
- `border` → `#D4E8F7`, `border-strong` → `#A8D4F0`
- Brand cyan tetap, tapi `--color-primary` ke `violet-600` untuk kontras yang cukup pada surface terang.

---

## 3. Token Implementation (Tailwind v4)

Tulis langsung di `app/globals.css`. Ini menggantikan `tailwind.config.js`.

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  /* Brand — Cyan (primary) */
  --color-violet-50: #f0f9ff;
  --color-violet-100: #d9f2ff;
  --color-violet-200: #a8e4ff;
  --color-violet-300: #5fd4ff;
  --color-violet-400: #22c5e0;
  --color-violet-500: #06b6d4;
  --color-violet-600: #0891b2;
  --color-violet-700: #0e7490;
  --color-violet-800: #155e75;
  --color-violet-900: #164e63;
  --color-violet-950: #0c2d3a;

  /* Brand — Purple (secondary) */
  --color-purple-50: #faf5ff;
  --color-purple-100: #f3e8ff;
  --color-purple-200: #e9d5ff;
  --color-purple-300: #d8b4fe;
  --color-purple-400: #c084fc;
  --color-purple-500: #a855f7;
  --color-purple-600: #9333ea;
  --color-purple-700: #7e22ce;
  --color-purple-800: #6b21a8;
  --color-purple-900: #581c87;
  --color-purple-950: #3b0764;

  /* Semantic aliases — pakai utility seperti bg-primary, text-fg, border-border */
  --color-primary: var(--color-violet-500);
  --color-primary-hover: var(--color-violet-600);
  --color-primary-active: var(--color-violet-700);
  --color-primary-soft: color-mix(
    in oklab,
    var(--color-violet-500) 20%,
    transparent
  );

  --color-bg: #070b14;
  --color-bg-elevated: #0c1222;
  --color-bg-overlay: #111a33;
  --color-border: #1a2744;
  --color-border-strong: #264060;

  --color-fg: #f0f8ff;
  --color-fg-muted: #a8c4e0;
  --color-fg-subtle: #6b8aad;

  --color-accent-pink: #d946ef;
  --color-accent-cyan: #00e5ff;
  --color-accent-amber: #f5b544;

  --color-success: #10b981;
  --color-success-soft: #0f3d2e;
  --color-danger: #ef4444;
  --color-danger-soft: #3f1717;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;

  /* Typography */
  --font-sans: var(--font-geist-sans);
  --font-display:
    "Space Grotesk", var(--font-geist-sans), ui-sans-serif, system-ui;
  --font-mono: var(--font-geist-mono);

  /* Radius */
  --radius-xs: 0.25rem;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;

  /* Shadow & glow */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.4);
  --shadow-md: 0 8px 24px -8px rgb(0 0 0 / 0.45);
  --shadow-lg: 0 24px 48px -12px rgb(0 0 0 / 0.55);
  --shadow-glow:
    0 0 0 1px color-mix(in oklab, var(--color-violet-500) 40%, transparent),
    0 8px 32px -8px
      color-mix(in oklab, var(--color-violet-500) 60%, transparent);

  /* Motion */
  --ease-snappy: cubic-bezier(0.32, 0.72, 0, 1);
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 360ms;
}

:root {
  color-scheme: dark;
  --background: var(--color-bg);
  --foreground: var(--color-fg);
}

body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Subtle ambient gradient background untuk hero/landing */
.bg-aurora {
  background:
    radial-gradient(
      80% 60% at 80% 0%,
      color-mix(in oklab, var(--color-violet-500) 35%, transparent) 0%,
      transparent 60%
    ),
    radial-gradient(
      60% 50% at 0% 0%,
      color-mix(in oklab, var(--color-accent-pink) 20%, transparent) 0%,
      transparent 55%
    ),
    var(--color-bg);
}

/* Focus ring konsisten */
@layer base {
  :focus-visible {
    outline: 2px solid var(--color-violet-400);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
}
```

Dengan `@theme`, utility seperti `bg-primary`, `text-fg-muted`, `border-border-strong`, `rounded-md`, `shadow-glow` langsung tersedia di Tailwind.

---

## 4. Typography

### 4.1 Font Family

- **Sans (UI)**: Geist Sans (sudah dipasang di `layout.tsx`).
- **Display (heading hero/section)**: Space Grotesk via `next/font/google`. Tambahkan saat dibutuhkan:

  ```ts
  // app/layout.tsx
  import { Space_Grotesk } from "next/font/google";
  const spaceGrotesk = Space_Grotesk({
    variable: "--font-display",
    subsets: ["latin"],
    display: "swap",
  });
  // tambahkan ke className root: `${spaceGrotesk.variable}`
  ```

- **Mono**: Geist Mono untuk angka harga jika ingin highlight.

### 4.2 Skala

Gunakan utility Tailwind. Skala yang konsisten:

| Role              | Class                                                                                              | Catatan                     |
| ----------------- | -------------------------------------------------------------------------------------------------- | --------------------------- |
| Display XL (hero) | `text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight font-[family-name:var(--font-display)]` | Hanya untuk hero            |
| Display L         | `text-4xl md:text-5xl font-semibold tracking-tight`                                                | Section title halaman       |
| H1 page           | `text-3xl md:text-4xl font-semibold`                                                               | Listing/detail header       |
| H2                | `text-2xl md:text-3xl font-semibold`                                                               | Section title               |
| H3                | `text-xl font-semibold`                                                                            | Card title                  |
| Body              | `text-base leading-7`                                                                              | Default paragraf            |
| Body-sm           | `text-sm leading-6 text-fg-muted`                                                                  | Sekunder                    |
| Caption           | `text-xs uppercase tracking-wider text-fg-subtle`                                                  | Eyebrow, metadata           |
| Numeric (harga)   | `font-semibold tabular-nums`                                                                       | Hindari font kerning loncat |

### 4.3 Aturan

- Maksimal lebar paragraf 72ch.
- Kontras teks vs background ≥ 4.5:1 untuk body, ≥ 3:1 untuk teks ≥ 18px bold.
- Hindari `text-gray-*` mentah; pakai token (`text-fg`, `text-fg-muted`, `text-fg-subtle`).

---

## 5. Spacing, Radius, & Layout

- **Spacing scale**: ikuti default Tailwind (`0.5`, `1`, ..., `24`). Untuk konsistensi card gunakan `p-4` mobile, `p-6` desktop.
- **Container**: pakai `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`. Buat helper class `.container` di `globals.css` jika berulang.
- **Radius**:
  - Button & input: `rounded-md` (12px).
  - Card: `rounded-xl` (16px) → `rounded-2xl` (24px) untuk hero card.
  - Pill / badge: `rounded-full`.
- **Grid produk**: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6`.

---

## 6. Component Recipes

### 6.1 Button

Variants minimum: `primary`, `secondary`, `ghost`, `outline`, `destructive`. Sizes: `sm`, `md`, `lg`, `icon`.

Contoh primary:

```
inline-flex items-center justify-center gap-2 rounded-md px-4 h-10
bg-primary text-white font-medium
shadow-glow
transition-colors duration-[var(--duration-base)] ease-[var(--ease-snappy)]
hover:bg-primary-hover active:bg-primary-active
disabled:opacity-50 disabled:pointer-events-none
focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-2
```

Outline:

```
border border-border-strong text-fg hover:bg-bg-overlay hover:border-violet-400
```

Ghost:

```
text-fg hover:bg-bg-overlay
```

### 6.2 Input / Form Field

```
w-full h-10 rounded-md bg-bg-elevated border border-border
px-3 text-sm text-fg placeholder:text-fg-subtle
focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-500/40
disabled:opacity-60
```

### 6.3 Card (Product, Promo)

```
group relative overflow-hidden rounded-xl bg-bg-elevated border border-border
transition-all duration-[var(--duration-base)] ease-[var(--ease-snappy)]
hover:border-violet-500/60 hover:shadow-glow
```

Image area: `aspect-[4/3]` atau `aspect-square`, `next/image` dengan `fill`, `sizes` yang tepat.

### 6.4 Badge

- `Ready`: `bg-success-soft text-success border border-success/40`
- `Sold Out`: `bg-danger-soft text-danger border border-danger/40`
- `Diskon`: `bg-accent-pink/15 text-accent-pink border border-accent-pink/40`
- `Best Seller`: `bg-accent-amber/15 text-accent-amber border border-accent-amber/40`

Layout: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums`.

### 6.5 Price Tag

- Harga setelah diskon: `text-xl font-semibold text-violet-300`.
- Harga sebelum diskon: `text-sm text-fg-subtle line-through`.
- Persen diskon: badge accent-pink.

### 6.6 Header / Navigation

- Sticky `sticky top-0 z-40`.
- Background `bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60` untuk efek glass.
- Border bawah `border-b border-border`.
- Logo ikon Lucide + wordmark; ukuran ikon 20–24px.
- Cart & Profile: tombol icon (`size-9 rounded-full`), badge cart kecil `bg-accent-pink`.

### 6.7 Footer

- Background `bg-bg-elevated`, padding `py-12`.
- Grid 4 kolom (`md:grid-cols-4`) untuk Brand, Kategori, Bantuan, Legal.

### 6.8 Skeleton

- Background `bg-bg-overlay` + `animate-pulse`.
- Untuk shimmer halus, opsional pakai gradient kustom.

### 6.9 Game Card & Platform Card

Card entitas yang dipakai di `Category_Landing_Page` Akun, Topup, dan Voucher (lihat `feature-guideline.md` §5). Keduanya berbagi anatomi yang sama; perbedaannya hanya pada media (cover image vs ikon-led).

**Struktur dasar (kontrak wajib):**

- **Single `<Link>` (next/link)** membungkus seluruh area card. Tidak ada link nested di dalamnya — anatomi card harus tetap satu target klik agar pembaca layar membaca satu landmark per item.
- **aria-label deskriptif** di `<Link>`, format: `"Lihat {count} {kategori} untuk {name}"`. Contoh: `"Lihat 12 akun untuk Mobile Legends"`, `"Lihat 5 voucher untuk Steam"`. Jangan andalkan teks visual saja.
- **Hit area minimum 44×44px** pada mobile. Card grid sudah jauh di atas threshold ini, namun pastikan tidak ada `padding` yang menyusutkan target di breakpoint kecil.
- **Focus ring** mengikuti rule global `:focus-visible` di `app/globals.css` (`outline: 2px solid var(--color-violet-400); outline-offset: 2px;`). Tidak perlu re-deklarasi per komponen — cukup pastikan `<Link>` adalah elemen fokusable utama dan tidak ada `outline-none` yang menimpa.
- **Kontras teks vs background** memenuhi WCAG AA (≥ 4.5:1). Title pakai `text-fg`, count pakai `text-fg-muted` atau `text-fg-subtle` — keduanya sudah dicek terhadap `bg-bg-elevated` (lihat §2.2).
- **Hover lift**: card terangkat halus + glow ungu, mengikuti pola §6.3 (Card).

**Container utility (umum untuk Game_Card & Platform_Card):**

```
group relative block overflow-hidden rounded-xl bg-bg-elevated border border-border
transition-all duration-(--duration-base) ease-snappy
hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-glow
focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-2
```

> Catatan Tailwind v4: gunakan `duration-(--duration-base)` dan `ease-snappy` (token `--ease-snappy` ter-register lewat `@theme`), bukan bracket syntax `[var(--…)]` lama.

#### Game_Card (akun & topup)

- **Media**: cover game via `next/image` dengan `fill`, di dalam wrapper `relative aspect-4/3 overflow-hidden` (atau `aspect-square` jika cover bersifat ikonik). `object-cover` agar memenuhi frame.
- **Overlay scrim** opsional di bawah cover untuk menjaga kontras count badge: `bg-linear-to-t from-bg/80 to-transparent`.
- **Body** padding `p-4`:
  - Title `text-base font-semibold line-clamp-1 text-fg`.
  - Count `text-xs text-fg-muted tabular-nums` — contoh `"12 akun"`, `"8 paket topup"`.

#### Platform_Card (voucher)

- **Media**: ikon Lucide 32–48px (mis. `Gamepad2`, `Smartphone`, `Store`) di tengah panel `aspect-square` atau `aspect-4/3` dengan gradient accent dari `Platform.accent` (`bg-linear-to-br from-violet-500 to-accent-pink`, dst.).
- Ikon pakai `text-white` di atas gradient; `strokeWidth={1.75}` mengikuti §7. Hindari teks di dalam panel media — biarkan grafis bersih.
- **Body** identik dengan `Game_Card`:
  - Title `text-base font-semibold text-fg` (nama platform: "Steam", "Google Play").
  - Count `text-xs text-fg-muted tabular-nums` — contoh `"24 voucher"`.

> Catatan migrasi: `app/_components/popular-game-grid.tsx` sudah mengandung pola visual yang mirip. `Game_Card` baru di `app/products/_components/game-card.tsx` boleh meminjam tata letaknya — yang penting kontrak di atas (single Link, aria-label, fokus ring, hit area) terpenuhi.

---

## 7. Iconography

- **Library**: Lucide React. Hanya gunakan icon dari Lucide untuk konsistensi stroke.
- **Stroke width**: default 1.75 (sedikit lebih halus). Set props `strokeWidth={1.75}` global di komponen helper jika perlu.
- **Ukuran**: 16 (text-sm context), 20 (default), 24 (header/CTA).
- **Warna**: ikut `currentColor`. Gunakan `text-fg-muted` untuk inactive, `text-violet-400` untuk active.

---

## 8. Imagery

- **Format**: WebP/AVIF via `next/image`.
- **Cover akun game**: aspect `4/3` atau `16/9` konsisten di listing.
- **Hero**: gunakan ilustrasi/karakter game dengan latar transparent atau gradient ungu. Aplikasikan `object-contain` jika ilustrasi penuh, `object-cover` untuk foto.
- **Placeholder**: `placeholder="blur"` saat sumber lokal; untuk remote, sediakan `blurDataURL` ringan.
- **Overlay**: pada banner, tambahkan gradient `from-bg via-bg/40 to-transparent` di sisi teks supaya kontras teks aman.

---

## 9. Motion

Prinsip: cepat, halus, hemat. Hindari animasi panjang yang ganggu.

- **Durasi**: 120ms untuk hover/microinteraction, 200ms untuk transisi card, 360ms untuk drawer/sheet.
- **Easing**: `cubic-bezier(0.32, 0.72, 0, 1)` (sudah jadi token `--ease-snappy`).
- **Hover card**: `translate-y-0` → `-translate-y-0.5`, plus `shadow-glow`.
- **CTA pulse**: opsional, hanya pada CTA hero. Pakai `@keyframes` di `globals.css`, jangan dipasang ke semua tombol.
- **Reduced motion**: hormati `@media (prefers-reduced-motion: reduce)` — set semua animation/transition durasi mendekati nol.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. shadcn/ui Integration

Saat menambahkan shadcn/ui, gunakan tema warna kustom (bukan default neutral). Mapping yang dipakai untuk shadcn tokens (`--primary`, `--ring`, dll) bisa ditambahkan ke `:root` agar primitives ikut palette ungu:

```css
:root {
  --background: var(--color-bg);
  --foreground: var(--color-fg);
  --card: var(--color-bg-elevated);
  --card-foreground: var(--color-fg);
  --popover: var(--color-bg-overlay);
  --popover-foreground: var(--color-fg);
  --primary: var(--color-violet-500);
  --primary-foreground: #ffffff;
  --secondary: var(--color-bg-overlay);
  --secondary-foreground: var(--color-fg);
  --muted: var(--color-bg-overlay);
  --muted-foreground: var(--color-fg-muted);
  --accent: var(--color-violet-800);
  --accent-foreground: var(--color-fg);
  --destructive: var(--color-danger);
  --destructive-foreground: #ffffff;
  --border: var(--color-border);
  --input: var(--color-border);
  --ring: var(--color-violet-400);
  --radius: 0.75rem;
}
```

Saat init shadcn (`npx shadcn@latest init`), pilih:

- Style: **New York** atau **Default** (ikuti konsensus tim).
- Base color: **Violet** (akan kita override dengan token di atas).
- CSS variables: **Yes**.
- React Server Components: **Yes**.
- Components dir: `components/ui`.

---

## 11. Aksesibilitas

- **Kontras**: cek tiap pasangan warna teks/background dengan tools seperti axe atau Lighthouse. Token sudah dipilih dengan margin AA, tetap verifikasi setelah rakit.
- **Focus ring**: jangan dihilangkan. Gunakan `focus-visible` agar tetap muncul untuk keyboard user tanpa mengganggu klik mouse.
- **Hit area**: tombol minimal 40×40px (mobile).
- **Color is not the only signal**: badge status selain warna, sertakan ikon/teks (`Ready`, `Sold Out`).
- **Form**: tiap input punya `<label>` terkait (eksplisit `htmlFor` atau membungkus). Error message via `aria-describedby`.
- **Komponen interaktif kustom**: pakai primitives Radix dari shadcn, jangan recreate dropdown dari nol.

---

## 12. Do & Don't

**Do**

- Gunakan token (`bg-bg-elevated`, `text-fg-muted`) — bukan warna mentah.
- Tarik utility ke component helper saat dipakai di banyak tempat (mis. variant button).
- Jaga hierarchy: 1 hero per halaman, 1 primary CTA per section.
- Pakai `next/image` dengan `sizes` yang tepat.

**Don't**

- Jangan campur dark + light di satu komponen tanpa strategi tema.
- Jangan ada `bg-purple-*` atau `bg-[#xxxxxx]` mentah berulang. Tambahkan ke token kalau berulang.
- Jangan pakai gradient + glow + shadow sekaligus pada elemen yang sama (overstimulasi visual).
- Jangan pakai animasi looping panjang di area konten (terutama listing).

---

## 13. Quick Snippets

### 13.1 Hero Wrapper

```
<section class="bg-aurora relative overflow-hidden">
  <div class="container py-20 md:py-28 lg:py-32 grid gap-10 lg:grid-cols-2 lg:items-center">
    {/* copy + cta */}
    {/* artwork */}
  </div>
</section>
```

### 13.2 Product Card (struktur)

```
<article class="group relative overflow-hidden rounded-xl bg-bg-elevated border border-border hover:border-violet-500/60 hover:shadow-glow transition-all">
  <div class="relative aspect-[4/3] overflow-hidden">
    {/* next/image fill */}
    <div class="absolute left-3 top-3 flex gap-2">
      {/* badges */}
    </div>
  </div>
  <div class="p-4 space-y-2">
    <h3 class="text-base font-semibold line-clamp-2">...</h3>
    <p class="text-xs text-fg-subtle line-clamp-1">...</p>
    <div class="flex items-baseline gap-2">
      <span class="text-lg font-semibold text-violet-300 tabular-nums">Rp1.250.000</span>
      <span class="text-xs text-fg-subtle line-through tabular-nums">Rp1.500.000</span>
    </div>
  </div>
</article>
```

### 13.3 Game Card (struktur)

Lihat resep di §6.9. `href` ditentukan halaman induk: `/products/account/{slug}` untuk Akun atau `/checkout?category=topup&game={slug}` untuk Topup.

```tsx
import Image from "next/image";
import Link from "next/link";

<Link
  href={href}
  aria-label={`Lihat ${countLabel} untuk ${game.name}`}
  className="group relative block overflow-hidden rounded-xl bg-bg-elevated border border-border transition-all duration-(--duration-base) ease-snappy hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-glow"
>
  <div className="relative aspect-4/3 overflow-hidden">
    <Image
      src={game.cover}
      alt=""
      fill
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
      className="object-cover transition-transform duration-(--duration-base) group-hover:scale-[1.02]"
    />
    <div className="absolute inset-0 bg-linear-to-t from-bg/80 to-transparent" />
  </div>
  <div className="p-4 space-y-1">
    <h3 className="text-base font-semibold text-fg line-clamp-1">
      {game.name}
    </h3>
    <p className="text-xs text-fg-muted tabular-nums">{countLabel}</p>
  </div>
</Link>;
```

### 13.4 Platform Card (struktur)

Lihat resep di §6.9. Ikon-led dengan gradient `Platform.accent`.

```tsx
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

<Link
  href={`/products/voucher/${platform.slug}`}
  aria-label={`Lihat ${countLabel} untuk ${platform.name}`}
  className="group relative block overflow-hidden rounded-xl bg-bg-elevated border border-border transition-all duration-(--duration-base) ease-snappy hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-glow"
>
  <div
    className={`relative aspect-square flex items-center justify-center bg-linear-to-br ${platform.accent}`}
  >
    <Gamepad2
      className="size-10 text-white"
      strokeWidth={1.75}
      aria-hidden="true"
    />
  </div>
  <div className="p-4 space-y-1">
    <h3 className="text-base font-semibold text-fg line-clamp-1">
      {platform.name}
    </h3>
    <p className="text-xs text-fg-muted tabular-nums">{countLabel}</p>
  </div>
</Link>;
```

### 13.5 CTA Primary

```
<button class="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md bg-primary text-white font-medium shadow-glow transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none">
  Beli Sekarang
</button>
```

---

## 14. Maintenance

- Setiap kali menambah warna, **masukkan ke `@theme`** dulu, baru pakai. Tidak ada warna ad-hoc.
- Komponen baru: tulis state (`default`, `hover`, `active`, `focus`, `disabled`) sekaligus saat membuatnya.
- Setelah ada 5+ komponen, buat halaman `app/_dev/styleguide/page.tsx` (private, di-`gate` dengan env) untuk preview semua komponen.
- Audit visual ketika menambah section baru — pastikan tidak ada drift dari palette ungu.
