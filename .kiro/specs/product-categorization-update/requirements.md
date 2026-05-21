# Requirements Document

## Introduction

Fitur ini merestrukturisasi cara penjelajahan katalog produk di Digital Gaming Marketplace dari listing flat berbasis produk menjadi **browse two-step berbasis entitas (Game atau Platform) per kategori**. Setiap kategori utama (Akun, Topup, Voucher) mendapat alur navigasi yang berbeda:

- **Akun**: pengguna memilih `Game` lebih dulu, lalu melihat daftar `Akun` yang tersedia untuk `Game` tersebut.
- **Topup**: pengguna memilih `Game` lebih dulu, lalu memilih `Topup_Denomination` (mis. 1000 Diamond ML) di `Checkout_Page`.
- **Voucher**: pengguna memilih `Platform` lebih dulu (Steam, Google Play, PlayStation Store, dll.), lalu melihat daftar `Voucher` untuk `Platform` tersebut.

Bagian terpenting dari permintaan: **`Guideline_Documents` di folder `guideline/` harus diperbarui terlebih dahulu** untuk merefleksikan struktur baru (scope, routing, model data, urutan pengerjaan), sebelum perubahan kode dimulai. Spec ini hanya menghasilkan dokumen guideline + spec planning; perubahan implementasi (kode aplikasi) ditangani lewat spec turunan setelah guideline disepakati.

Cakupan in-scope:

- Update tiga `Guideline_Documents`: `project-description.md`, `feature-guideline.md`, `styling-guideline.md` (yang terakhir hanya jika ada perubahan token visual, mis. kartu Platform).
- Definisi alur browse baru per kategori.
- Definisi entitas data baru (`Platform`) dan perubahan kontrak pada `Product` kategori `voucher`.
- Definisi skema URL/routing dua-tingkat per kategori.
- Definisi metadata SEO per halaman baru.
- Definisi empty state, loading, dan error state per halaman baru.
- Definisi strategi migrasi data mock existing.

Cakupan out-of-scope:

- Implementasi UI baru di `app/products/**` (akan dilakukan di spec turunan setelah guideline approved).
- Integrasi backend / payment gateway nyata.
- Light mode / tema tambahan.
- Auth & user account.

## Glossary

- **Browse_System**: subsistem front-end yang menangani penjelajahan katalog (kategori → entitas → produk). Mencakup route `/products/**` dan komponen di `app/products/**`.
- **Product**: entitas produk yang dijual, sesuai `lib/types/product.ts`. Memiliki `category ∈ {"account","topup","voucher"}`.
- **Akun**: `Product` dengan `category = "account"`.
- **Topup**: `Product` dengan `category = "topup"`.
- **Voucher**: `Product` dengan `category = "voucher"`.
- **Game**: judul permainan (mis. Mobile Legends, Valorant), sesuai `lib/types/game.ts`. Diidentifikasi oleh `gameSlug` unik.
- **Platform**: penyedia ekosistem digital tempat `Voucher` ditukar (mis. Steam, Google Play, PlayStation Store, App Store, Xbox). **Entitas baru** yang akan ditambahkan di `lib/types/platform.ts`. Diidentifikasi oleh `platformSlug` unik.
- **Topup_Denomination**: paket nominal `Topup` untuk satu `Game` (mis. "1000 Diamond Mobile Legends"). Direpresentasikan sebagai `Product` `category = "topup"` yang terikat ke satu `Game`.
- **Category_Landing_Page**: halaman entry per kategori. Tiga URL: `/products/account`, `/products/topup`, `/products/voucher`.
- **Game_Detail_Page**: halaman daftar produk per `Game`. Dua varian: `/products/account/{gameSlug}` (daftar `Akun`) dan `/products/topup/{gameSlug}` (memicu alur Topup; lihat REQ-4).
- **Platform_Detail_Page**: halaman daftar `Voucher` per `Platform`, di `/products/voucher/{platformSlug}`.
- **Checkout_Page**: halaman `/checkout` yang sudah ada. Akan diperluas untuk mendukung pemilihan `Topup_Denomination` saat alur Topup.
- **Topup_Picker**: section di `Checkout_Page` yang muncul khusus saat `Checkout_Page` dipanggil dari alur Topup; berisi pemilihan `Topup_Denomination` per `Game` terpilih.
- **Game_Card**: card UI yang merepresentasikan satu `Game` di `Category_Landing_Page` Akun/Topup.
- **Platform_Card**: card UI yang merepresentasikan satu `Platform` di `Category_Landing_Page` Voucher.
- **Guideline_Documents**: file Markdown di `guideline/` yang menjadi sumber kebenaran panduan kerja: `project-description.md`, `feature-guideline.md`, `styling-guideline.md`.
- **Spec_Author**: penulis spec/dokumentasi yang memproduksi `Guideline_Documents` (deliverable utama spec ini).

## Requirements

### Requirement 1: Restrukturisasi Halaman Entry Kategori

**User Story:** Sebagai pengunjung marketplace, saya ingin setiap kategori utama (Akun, Topup, Voucher) menampilkan pilihan entitas yang relevan (Game atau Platform) terlebih dahulu, sehingga saya bisa mempersempit pilihan saya secara terstruktur tanpa di-overload daftar produk mentah.

#### Acceptance Criteria

1. WHEN pengguna membuka `Category_Landing_Page` Akun (URL `/products/account`) DAN HANYA pada route tersebut, THE Browse_System SHALL menampilkan grid `Game_Card` berisi daftar `Game` yang memiliki minimal satu `Akun` dengan `stockStatus` apa pun, dan TIDAK menampilkan `Product` apa pun di halaman tersebut.
2. WHEN pengguna membuka `Category_Landing_Page` Topup (URL `/products/topup`) DAN HANYA pada route tersebut, THE Browse_System SHALL menampilkan grid `Game_Card` berisi daftar `Game` yang memiliki minimal satu `Topup`, dan TIDAK menampilkan `Product` apa pun di halaman tersebut.
3. WHEN pengguna membuka `Category_Landing_Page` Voucher (URL `/products/voucher`) DAN HANYA pada route tersebut, THE Browse_System SHALL menampilkan grid `Platform_Card` berisi daftar `Platform` yang memiliki minimal satu `Voucher`, dan TIDAK menampilkan `Product` apa pun di halaman tersebut.
4. THE Browse_System SHALL menampilkan jumlah produk per entitas (mis. "12 akun" / "8 topup" / "5 voucher") pada setiap `Game_Card` dan `Platform_Card`.
5. IF tidak ada `Game` atau `Platform` yang memenuhi kriteria pada satu `Category_Landing_Page`, THEN THE Browse_System SHALL menampilkan empty state dengan teks "Belum ada {kategori} tersedia saat ini" dan tombol kembali ke beranda.
6. THE Browse_System SHALL meng-sort entitas pada `Category_Landing_Page` berdasarkan jumlah produk descending sebagai default, dengan tie-breaker alfabetis ascending pada `name`.

### Requirement 2: Alur Browse Akun (Game → Daftar Akun)

**User Story:** Sebagai pembeli akun game, saya ingin memilih Game terlebih dahulu lalu melihat daftar Akun yang tersedia untuk Game tersebut, sehingga saya bisa fokus pada katalog yang relevan.

#### Acceptance Criteria

1. WHEN pengguna mengklik satu `Game_Card` pada `Category_Landing_Page` Akun, THE Browse_System SHALL menavigasi ke `Game_Detail_Page` Akun pada URL `/products/account/{gameSlug}`. Visual `Game_Card` di halaman Akun dan halaman Topup SHALL identik; perbedaan tujuan navigasi ditentukan oleh konteks `Category_Landing_Page` saat ini, bukan oleh penanda visual pada `Game_Card` itu sendiri.
2. WHEN `Game_Detail_Page` Akun dimuat, THE Browse_System SHALL menampilkan hanya `Akun` yang `gameSlug`-nya sama dengan parameter URL.
3. THE Browse_System SHALL menampilkan header `Game_Detail_Page` Akun yang berisi nama `Game`, breadcrumb "Beranda > Akun > {Game.name}", dan jumlah `Akun` yang ditampilkan.
4. WHEN pengguna mengklik satu `Akun` di `Game_Detail_Page` Akun, THE Browse_System SHALL menavigasi ke halaman detail produk existing pada `/products/{slug}`.
5. IF `gameSlug` di URL tidak ditemukan di `Game_Catalog`, THEN THE Browse_System SHALL mengizinkan navigasi tetap berlangsung lalu memanggil `notFound()` (HTTP 404) dari Server Component sehingga halaman 404 standar Next.js tampil.
6. IF `gameSlug` valid namun tidak memiliki `Akun`, THEN THE Browse_System SHALL menampilkan empty state dengan teks "Belum ada akun untuk {Game.name}" dan tombol kembali ke daftar Game Akun.
7. WHERE `Game_Detail_Page` Akun memiliki lebih dari 12 `Akun`, THE Browse_System SHALL menyediakan kontrol filter (rentang harga, status stok) dan pagination yang konsisten dengan listing existing di `app/products/_components/`.

### Requirement 3: Alur Browse Voucher (Platform → Daftar Voucher)

**User Story:** Sebagai pembeli voucher digital, saya ingin memilih Platform tujuan voucher terlebih dahulu (Steam, Google Play, PlayStation, dll.) lalu melihat voucher yang tersedia untuk Platform tersebut, sehingga saya tidak salah platform.

#### Acceptance Criteria

1. WHEN pengguna mengklik satu `Platform_Card` pada `Category_Landing_Page` Voucher, THE Browse_System SHALL menavigasi ke `Platform_Detail_Page` pada URL `/products/voucher/{platformSlug}`.
2. WHEN `Platform_Detail_Page` dimuat, THE Browse_System SHALL menampilkan hanya `Voucher` yang `platformSlug`-nya sama dengan parameter URL.
3. THE Browse_System SHALL menampilkan header `Platform_Detail_Page` yang berisi nama `Platform`, breadcrumb "Beranda > Voucher > {Platform.name}", dan jumlah `Voucher` yang ditampilkan.
4. WHEN pengguna mengklik satu `Voucher` di `Platform_Detail_Page`, THE Browse_System SHALL menavigasi ke halaman detail produk existing pada `/products/{slug}`.
5. IF `platformSlug` di URL tidak ditemukan di `Platform_Catalog`, THEN THE Browse_System SHALL memanggil `notFound()` (HTTP 404). Kondisi `notFound()` SHALL hanya dipicu oleh ketidakhadiran `Platform_Catalog`; error lain (mis. data fetch gagal, parameter ter-encode salah) SHALL dilempar sebagai `Error` dan ditangkap oleh `error.tsx` segment terdekat (lihat REQ-9).
6. IF `platformSlug` valid namun tidak memiliki `Voucher`, THEN THE Browse_System SHALL menampilkan empty state dengan teks "Belum ada voucher untuk {Platform.name}" dan tombol kembali ke daftar Platform, TANPA merender kontrol filter/sort.

### Requirement 4: Alur Topup (Game → Pemilihan Denominasi di Checkout)

**User Story:** Sebagai pembeli topup, saya ingin memilih Game terlebih dahulu, lalu langsung diarahkan ke halaman checkout di mana saya memilih nominal topup (mis. 100 Diamond, 1000 Diamond) dan mengisi data pemesanan dalam satu alur, sehingga proses topup cepat tanpa langkah listing tambahan.

#### Acceptance Criteria

1. WHEN pengguna mengklik satu `Game_Card` pada `Category_Landing_Page` Topup, THE Browse_System SHALL menavigasi ke `Checkout_Page` dengan parameter `?category=topup&game={gameSlug}`.
2. WHEN `Checkout_Page` dipanggil dengan parameter `category=topup` dan `game={gameSlug}` valid, THE Checkout_Page SHALL menampilkan section `Topup_Picker` di posisi teratas form yang berisi daftar semua `Topup_Denomination` (yaitu `Topup` dengan `gameSlug` sama) dalam bentuk kartu pilihan radio.
3. THE Topup_Picker SHALL menampilkan judul, harga (`PriceTag`), dan highlight singkat per `Topup_Denomination`.
4. WHEN pengguna memilih satu `Topup_Denomination` di `Topup_Picker`, THE Checkout_Page SHALL memperbarui ringkasan order (`OrderSummary`) untuk merefleksikan harga `Topup_Denomination` terpilih, menggantikan item topup sebelumnya jika ada.
5. THE Checkout_Page SHALL men-disable tombol "Bayar Sekarang" SAMPAI semua kondisi berikut terpenuhi: (a) ada `Topup_Denomination` terpilih pada `Topup_Picker`, (b) seluruh field required di `customer-info-section.tsx` valid, dan (c) ada `PaymentMethod` terpilih.
6. WHILE alur Topup aktif (parameter `category=topup` dan `game` ada), THE Checkout_Page SHALL menampilkan field `gameId` dan `gameServer` sebagai required di `customer-info-section.tsx`.
7. IF `gameSlug` parameter `Checkout_Page` tidak ditemukan di `Game_Catalog`, THEN THE Checkout_Page SHALL melakukan redirect ke `/products/topup` dengan kode 302/307.
8. IF `gameSlug` valid namun tidak ada `Topup_Denomination` yang tersedia, THEN THE Checkout_Page SHALL menampilkan empty state Topup_Picker dengan teks "Belum ada paket topup untuk {Game.name}" dan tombol kembali ke daftar Game Topup.
9. WHERE alur Topup aktif, THE Checkout_Page SHALL TIDAK membaca atau menambahkan item ke `cart-store` (alur Topup bersifat single-shot, tidak melalui keranjang).
10. WHERE alur Topup aktif dan submit berhasil, THE Checkout_Page SHALL berusaha menyimpan `OrderResult` ke `checkout-store` lalu navigasi ke `/checkout/confirmation`. IF penyimpanan ke `checkout-store` gagal (mis. exception), THEN THE Checkout_Page SHALL tetap melakukan navigasi ke `/checkout/confirmation` dengan menyertakan `OrderResult` melalui jalur fallback (mis. `sessionStorage` atau parameter route) sehingga halaman konfirmasi tetap dapat me-render data order.

### Requirement 5: Entitas Data Platform

**User Story:** Sebagai developer, saya ingin entitas Platform yang terdefinisi jelas di tipe domain dan data layer, sehingga voucher bisa dikelompokkan per Platform alih-alih dipaksa memakai field `gameSlug`.

#### Acceptance Criteria

1. THE Spec_Author SHALL mendefinisikan tipe `Platform` di `lib/types/platform.ts` dengan field minimal: `slug: string`, `name: string`, `icon: string` (nama ikon Lucide), `accent: string` (Tailwind gradient), `productCount: number`.
2. THE Spec_Author SHALL menambahkan field opsional `platformSlug: string` di interface `Product` (`lib/types/product.ts`) yang wajib diisi ketika `category === "voucher"` dan harus kosong saat `category === "account" | "topup"`. THE Spec_Author SHALL menetapkan kontrak ini sebagai hard rule: `Voucher` tanpa `platformSlug` SHALL ditolak oleh data layer (mis. `getVouchersByPlatform` melempar `Error` jika menemukan `Voucher` dengan `platformSlug` kosong), tidak ada periode tenggang migrasi.
3. THE Spec_Author SHALL mendefinisikan data mock `Platform` minimal di `lib/data/mock-platforms.ts` untuk: Steam, Google Play, PlayStation Store, App Store, Xbox.
4. THE Spec_Author SHALL mendefinisikan fungsi data access `getPlatforms()`, `getPlatformBySlug(slug)`, `getVouchersByPlatform(platformSlug)` di `lib/data/platforms.ts` mengikuti pola cached/uncached yang sama dengan `lib/data/games.ts` dan `lib/data/products.ts`.
5. THE Spec_Author SHALL memutakhirkan mock voucher existing di `lib/data/mock-products.ts` (mis. `voucher-google-play-100rb`) untuk menggunakan `platformSlug = "google-play"` alih-alih `gameSlug = "free-fire"`.
6. THE Spec_Author SHALL mendokumentasikan kontrak data baru (`Platform`, perubahan `Product`) di `feature-guideline.md` bagian "Tipe Domain (Kontrak Data)".

### Requirement 6: Skema URL Routing Dua Tingkat

**User Story:** Sebagai developer dan SEO-aware, saya ingin URL yang konsisten dan share-able untuk setiap level (kategori, entitas, produk), sehingga refresh dan link sharing menampilkan konten yang sama.

#### Acceptance Criteria

1. THE Spec_Author SHALL mendefinisikan skema URL berikut di `feature-guideline.md`:
   - `/products` → halaman pengantar / pemilihan kategori (3 kartu kategori).
   - `/products/account` → `Category_Landing_Page` Akun (grid Game).
   - `/products/account/{gameSlug}` → `Game_Detail_Page` Akun.
   - `/products/topup` → `Category_Landing_Page` Topup (grid Game).
   - `/products/voucher` → `Category_Landing_Page` Voucher (grid Platform).
   - `/products/voucher/{platformSlug}` → `Platform_Detail_Page`.
   - `/products/{slug}` → halaman detail produk existing (tidak berubah).
   - `/checkout?category=topup&game={gameSlug}` → `Checkout_Page` mode Topup.
2. THE Spec_Author SHALL mendokumentasikan bahwa parameter route segment menggunakan konvensi Next.js 16 (`params: Promise<{...}>` di Server Components) dan harus di-`await` sebelum digunakan.
3. THE Spec_Author SHALL mendokumentasikan strategi rendering per route baru di `feature-guideline.md` bagian "Strategi Rendering & Caching" dengan ketentuan:
   - `Category_Landing_Page` Akun/Topup/Voucher → cached dengan `cacheTag('games')` atau `cacheTag('platforms')`.
   - `Game_Detail_Page` Akun → uncached (stok real-time, konsisten dengan kebijakan existing untuk `/products/[slug]`).
   - `Platform_Detail_Page` → cached dengan `cacheTag('voucher', platformSlug)`.
   - `Checkout_Page` mode Topup → uncached, `robots: noindex` (konsisten dengan existing).
4. THE Spec_Author SHALL mendokumentasikan strategi `metadata` / `generateMetadata` per route baru: title unik, description, OG image, dan `robots: noindex` untuk halaman dinamis yang tidak SEO-relevan.
5. WHERE listing existing `/products?category=X` masih bisa diakses lewat link lama, THE Spec_Author SHALL mendokumentasikan DAN mewajibkan implementasi redirect 308 (permanent) dari `/products?category=account` ke `/products/account`, dari `/products?category=topup` ke `/products/topup`, dan dari `/products?category=voucher` ke `/products/voucher`. Implementasi konkret dideklarasikan di `next.config.ts` `redirects()` dan dianggap bagian dari Definition of Done backward compatibility (lihat REQ-12.1).
6. WHERE pencarian global tetap dibutuhkan, THE Spec_Author SHALL mendokumentasikan bahwa `/products?q={keyword}` tetap berfungsi sebagai pencarian lintas kategori (tidak dihapus), namun tidak dijadikan entry default dari nav header.

### Requirement 7: Update Guideline Documents Sebelum Implementasi

**User Story:** Sebagai developer yang akan mengerjakan fitur ini, saya ingin guideline diperbarui terlebih dahulu agar saya punya rujukan tunggal yang konsisten sebelum menulis kode.

#### Acceptance Criteria

1. THE Spec_Author SHALL memutakhirkan `guideline/project-description.md` bagian "Halaman 2: Product Listing Page" untuk mendeskripsikan alur browse two-step per kategori, menggantikan deskripsi listing flat existing.
2. THE Spec_Author SHALL memutakhirkan `guideline/feature-guideline.md` dengan minimal section berikut:
   - "Halaman 2 — Product Listing" diganti / dipecah menjadi: "2A Pemilihan Kategori", "2B Akun: Game → Daftar Akun", "2C Topup: Game → Checkout dengan Topup_Picker", "2D Voucher: Platform → Daftar Voucher".
   - "Tipe Domain" ditambah definisi `Platform` dan perubahan pada `Product` (`platformSlug`).
   - "Roadmap Pengerjaan" ditambah Tahap baru (mis. "Tahap 8 — Restrukturisasi Kategori") dengan checklist sub-tugas yang dapat dieksekusi.
   - "Strategi Rendering & Caching" diperbarui dengan baris untuk route baru.
3. THE Spec_Author SHALL memutakhirkan `guideline/styling-guideline.md` dengan resep visual untuk `Game_Card` dan `Platform_Card` (struktur, ukuran, hover state, ikon Lucide, gradient accent) jika resep belum tercakup oleh `popular-game-grid.tsx` existing.
4. THE Spec_Author SHALL menyertakan catatan migrasi di `feature-guideline.md` yang menjelaskan dampak terhadap kode existing: `app/products/page.tsx` (listing flat), `app/products/_components/product-filter-sidebar.tsx` (filter game multi-select), `app/_components/popular-game-grid.tsx` (mungkin di-reuse).
5. THE Spec_Author SHALL menambahkan referensi silang antar dokumen guideline (mis. di `feature-guideline.md` mengarah ke section `styling-guideline.md` untuk `Game_Card`/`Platform_Card`).
6. THE Spec_Author SHALL menyelesaikan update guideline sebagai deliverable terpisah dari, dan mendahului, implementasi kode aplikasi. Update `Guideline_Documents` BOLEH ditandai selesai sebelum `npm run lint` dijalankan.
7. WHEN update `Guideline_Documents` selesai, THE Spec_Author SHALL menjalankan `npm run lint` pada repo sebagai langkah verifikasi terpisah, dan memastikan tidak ada error baru yang ditimbulkan oleh perubahan guideline (Markdown lint tidak diwajibkan jika tidak terkonfigurasi).

### Requirement 8: Perilaku Sort, Filter, dan Pagination per Halaman Baru

**User Story:** Sebagai pengunjung, saya ingin halaman daftar entitas dan halaman daftar produk per entitas tetap memiliki kontrol yang konsisten dengan listing existing, sehingga kurva belajarnya rendah.

#### Acceptance Criteria

1. THE Spec_Author SHALL mendokumentasikan bahwa `Category_Landing_Page` (Akun, Topup, Voucher) TIDAK menyediakan filter harga atau filter stok karena belum bekerja pada level Product.
2. WHERE jumlah `Game` atau `Platform` melebihi 24 pada satu `Category_Landing_Page`, THE Browse_System SHALL menyediakan pagination fungsional (link-based dengan `?page=N` di URL) ATAU "load more" yang bekerja end-to-end; dokumentasi pola pagination di guideline TIDAK cukup — implementasi harus tersedia sebelum threshold tercapai di production.
3. THE Spec_Author SHALL mendokumentasikan bahwa `Game_Detail_Page` Akun mendukung `sort` (price_asc, price_desc, newest), filter rentang harga (`min`/`max`), filter `stockStatus`, dan pagination, mereuse komponen di `app/products/_components/`.
4. THE Spec_Author SHALL mendokumentasikan bahwa `Platform_Detail_Page` mendukung `sort` dan pagination, namun TIDAK menampilkan filter Game (karena Voucher tidak terikat ke Game).
5. THE Spec_Author SHALL mendokumentasikan bahwa filter "Game" pada listing existing dihapus dari `Game_Detail_Page` Akun (karena `gameSlug` sudah ditetapkan oleh URL).

### Requirement 9: Empty, Loading, dan Error State per Halaman Baru

**User Story:** Sebagai pengunjung, saya ingin setiap halaman baru memberi feedback yang jelas saat data kosong, sedang dimuat, atau gagal, sehingga saya tidak melihat layar putih atau crash.

#### Acceptance Criteria

1. THE Spec_Author SHALL mendokumentasikan file `loading.tsx` skeleton untuk setiap route baru: `/products/account`, `/products/account/[gameSlug]`, `/products/topup`, `/products/voucher`, `/products/voucher/[platformSlug]`.
2. THE Spec_Author SHALL mendokumentasikan file `error.tsx` dengan tombol `reset` untuk setiap route segment baru, mengikuti pola `app/products/error.tsx`.
3. THE Spec_Author SHALL mendokumentasikan teks empty state Bahasa Indonesia untuk setiap kondisi yang tertulis di REQ-1 (poin 5), REQ-2 (poin 6), REQ-3 (poin 6), dan REQ-4 (poin 8).
4. WHEN data fetching `getGamesByCategory(category)`, `getPlatforms()`, `getAccountsByGame(gameSlug)`, `getTopupsByGame(gameSlug)`, atau `getVouchersByPlatform(platformSlug)` gagal karena alasan apa pun (network, parsing, validasi), THE Browse_System SHALL melempar `Error` deskriptif (TIDAK menelan exception secara silent) sehingga ditangkap oleh `error.tsx` segment terdekat.

### Requirement 10: Aksesibilitas Game Card dan Platform Card

**User Story:** Sebagai pengguna keyboard atau pembaca layar, saya ingin Game_Card dan Platform_Card dapat dinavigasi dan dipahami dengan baik, sehingga alur browse baru tetap inklusif.

#### Acceptance Criteria

1. THE Spec_Author SHALL menetapkan bahwa `Game_Card` dan `Platform_Card` keduanya merupakan `<a>` (atau `next/link`) tunggal yang membungkus seluruh area klik, dengan teks deskriptif yang dibaca pembaca layar (mis. "Lihat 12 akun untuk Mobile Legends").
2. THE Spec_Author SHALL menetapkan focus ring yang konsisten dengan token `--color-violet-400` dari `styling-guideline.md`.
3. THE Spec_Author SHALL menetapkan minimal hit area 44×44 px pada mobile.
4. THE Spec_Author SHALL menetapkan kontras teks vs background memenuhi WCAG AA (≥ 4.5:1) di kedua tema (saat ini dark-first).

### Requirement 11: Property-Based Testable Helpers

**User Story:** Sebagai developer, saya ingin fungsi data layer baru memiliki kontrak yang dapat diuji secara properti, sehingga regresi pada agregasi entitas dapat ditangkap otomatis.

#### Acceptance Criteria

1. THE Spec_Author SHALL mendefinisikan fungsi pure `groupGamesByCategory(products: Product[], category: ProductCategory): Game[]` di `lib/utils/categorization.ts` yang mengembalikan daftar `Game` unik berdasarkan `gameSlug` (TIDAK ADA `Game` duplikat dalam hasil) dengan `productCount` yang mencerminkan jumlah `Product` per `Game` pada kategori tersebut.
2. THE Spec_Author SHALL mendefinisikan fungsi pure `groupPlatformsForVouchers(products: Product[]): Platform[]` di `lib/utils/categorization.ts` yang mengembalikan daftar `Platform` unik berdasarkan `platformSlug` untuk `Product` `category === "voucher"` dengan `productCount` yang akurat.
3. THE Spec_Author SHALL mendokumentasikan invariant berikut sebagai kandidat property test di tahap design:
   - Jumlah total `productCount` dari hasil `groupGamesByCategory(products, c)` SAMA DENGAN jumlah `products.filter(p => p.category === c)`.
   - `groupGamesByCategory` idempoten: `groupGamesByCategory(groupGamesByCategory(products, c).flatMap(...))` menghasilkan list dengan `productCount` yang konsisten ketika input dipanggil ulang dengan dataset sama.
   - Untuk dua input list yang permutasinya sama, output `groupGamesByCategory` setara setelah di-sort by `slug` (urut input tidak mengubah hasil set-wise).

### Requirement 12: Backward Compatibility dan Migrasi Bertahap

**User Story:** Sebagai pemilik produk, saya ingin perubahan ini tidak memutus link existing dan menyediakan jalur migrasi yang jelas, sehingga pengguna lama tidak menemui broken link.

#### Acceptance Criteria

1. THE Spec_Author SHALL mendokumentasikan DAN mewajibkan implementasi redirect 308 (permanent) dari `/products?category=account|topup|voucher` ke route baru yang sesuai (lihat REQ-6 poin 5), dideklarasikan di `next.config.ts` `redirects()`. Backward compatibility tidak dianggap selesai sampai redirect ini terbukti aktif (mis. uji manual atau e2e).
2. WHERE `/products?q={keyword}` digunakan sebagai pencarian lintas kategori, THE Spec_Author SHALL menetapkan bahwa hasil pencarian tetap mengarah ke halaman detail produk existing tanpa perlu melewati `Category_Landing_Page`.
3. THE Spec_Author SHALL mendokumentasikan urutan migrasi pekerjaan implementasi (di Tahap baru `feature-guideline.md`) sebagai checklist yang `shippable` per fase, mis. "Fase A: Definisi tipe + data Platform", "Fase B: Category_Landing_Page Akun + Topup", "Fase C: Game_Detail_Page Akun", "Fase D: Category_Landing_Page Voucher + Platform_Detail_Page", "Fase E: Topup_Picker di Checkout_Page", "Fase F: Redirect dan polish".
4. THE Spec_Author SHALL menyertakan catatan eksplisit di guideline bahwa `app/products/page.tsx` existing diubah perannya menjadi "category chooser" (3 kartu kategori) dan logika filter+listing flat dipindahkan/diganti, bukan dihapus tanpa pengganti.
