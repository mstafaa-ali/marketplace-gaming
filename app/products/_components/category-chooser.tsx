import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Definisi satu kartu kategori yang dirender oleh `Category_Chooser`.
 *
 * Sengaja dideklarasikan inline (bukan diekspor) supaya kontrak datanya
 * benar-benar internal — `Category_Chooser` tidak menerima prop apa pun
 * (REQ-6.1) dan kategori yang ditampilkan adalah 3 entri statis.
 */
interface CategoryCard {
  /** Tujuan navigasi kategori (`/products/{kategori}`). */
  readonly href: string;
  /** Gambar untuk panel kategori. */
  readonly image: string;
  /** Judul kartu (mis. "Akun Game"). */
  readonly title: string;
  /** Deskripsi singkat 1–2 kalimat tentang kategori. */
  readonly description: string;
  /** Teks `aria-label` lengkap untuk dibaca screen reader. */
  readonly ariaLabel: string;
}

/**
 * Daftar 3 kategori utama. Urutan **stabil** (Akun → Top Up → Voucher) supaya
 * tata letak grid konsisten lintas render dan pengguna terbiasa dengan posisi
 * setiap kartu. Tidak ada filter, sort, atau state — semua sumbernya statis.
 */
const CATEGORY_CARDS: readonly CategoryCard[] = [
  {
    href: "/products/account",
    image: "/image/category-chooser/valo-akun-lightmode.png",
    title: "Akun Game",
    description: "Pilih akun game terverifikasi dengan garansi anti-minus.",
    ariaLabel: "Buka kategori Akun Game",
  },
  {
    href: "/products/topup",
    image: "/image/category-chooser/ml-topup-lightmode.png",
    title: "Top Up Game",
    description:
      "Top up diamond, UC, VP, dan lainnya. Proses 1-3 menit langsung ke akun.",
    ariaLabel: "Buka kategori Top Up Game",
  },
  {
    href: "/products/voucher",
    image: "/image/category-chooser/voucher-lightmode.jpg",
    title: "Voucher Digital",
    description:
      "Voucher Steam, Google Play, PlayStation, dan App Store. Instan via email.",
    ariaLabel: "Buka kategori Voucher Digital",
  },
];

/**
 * `Category_Chooser` — pengganti listing flat di route `/products`.
 *
 * Menampilkan 3 kartu kategori (Akun, Top Up, Voucher) sebagai entry point
 * ke alur browse two-step per kategori (lihat `feature-guideline.md` §5A).
 * Komponen ini Server Component murni: tidak ada `"use client"`, tidak ada
 * prop, tidak ada state browser — seluruh data di-hardcode di
 * `CATEGORY_CARDS`.
 *
 * Kontrak visual (per `styling-guideline.md` §6.9):
 * - Setiap kartu dibungkus **single `<Link>`** (REQ-10.1) supaya pembaca
 *   layar mendengar satu landmark per item.
 * - **`aria-label`** eksplisit di setiap link (lebih informatif daripada
 *   teks visual di dalam kartu).
 * - **Hover lift** + **focus ring violet** + **border** + transition token
 *   `--duration-base` / `ease-snappy`, mengikuti `Game_Card` & `Platform_Card`.
 * - **Icon-led panel** `aspect-4/3` ber-gradient `from-… to-…`, body 2 baris
 *   (judul + deskripsi).
 *
 * Layout grid: 1 kolom di mobile, 3 kolom di ≥`sm`. Gap mengikuti rhythm
 * landing existing (`gap-4` mobile, `gap-6` desktop).
 */
export function CategoryChooser() {
  return (
    <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
      {CATEGORY_CARDS.map(({ href, image, title, description, ariaLabel }) => (
        <li key={href}>
          <Link
            href={href}
            aria-label={ariaLabel}
            className={cn(
              "group relative block h-full overflow-hidden rounded-xl border border-border bg-bg-elevated",
              "transition-all duration-(--duration-base) ease-snappy",
              "hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-glow",
              "focus-visible:-translate-y-0.5 focus-visible:border-violet-400",
            )}
          >
            {/* Image panel */}
            <div
              aria-hidden
              className="relative aspect-4/3 w-full overflow-hidden"
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover object-top"
              />
            </div>

            <div className="relative space-y-1 p-4 sm:p-5">
              <h3 className="font-display text-base font-semibold tracking-tight text-fg sm:text-lg">
                {title}
              </h3>
              <p className="text-sm text-fg-muted">{description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
