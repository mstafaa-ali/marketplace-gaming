import { Coins, Gamepad2, Ticket, type LucideIcon } from "lucide-react";
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
  /** Komponen ikon Lucide yang ditaruh di tengah panel gradient. */
  readonly Icon: LucideIcon;
  /** Tailwind utility `from-… to-…` untuk panel gradient (lihat §6.9). */
  readonly accent: string;
  /** Judul kartu (mis. "Akun Game"). */
  readonly title: string;
  /** Deskripsi singkat 1–2 kalimat tentang kategori. */
  readonly description: string;
  /** Teks `aria-label` lengkap untuk dibaca screen reader. */
  readonly ariaLabel: string;
  /** Optional video URL to replace the icon panel with a video background. */
  readonly video?: string;
}

/**
 * Daftar 3 kategori utama. Urutan **stabil** (Akun → Top Up → Voucher) supaya
 * tata letak grid konsisten lintas render dan pengguna terbiasa dengan posisi
 * setiap kartu. Tidak ada filter, sort, atau state — semua sumbernya statis.
 */
const CATEGORY_CARDS: readonly CategoryCard[] = [
  {
    href: "/products/account",
    Icon: Gamepad2,
    accent: "from-violet-500 to-blue-500",
    title: "Akun Game",
    description: "Pilih akun game terverifikasi dengan garansi anti-minus.",
    ariaLabel: "Buka kategori Akun Game",
    video: "/video/akun-video.MOV",
  },
  {
    href: "/products/topup",
    Icon: Coins,
    accent: "from-emerald-500 to-violet-600",
    title: "Top Up Game",
    description:
      "Top up diamond, UC, VP, dan lainnya. Proses 1-3 menit langsung ke akun.",
    ariaLabel: "Buka kategori Top Up Game",
  },
  {
    href: "/products/voucher",
    Icon: Ticket,
    accent: "from-amber-500 to-pink-500",
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
      {CATEGORY_CARDS.map(
        ({ href, Icon, accent, title, description, ariaLabel, video }) => (
          <li key={href}>
            <Link
              href={href}
              aria-label={ariaLabel}
              className={cn(
                "group relative block h-full overflow-hidden rounded-xl border border-border",
                video ? "bg-transparent" : "bg-bg-elevated",
                "transition-all duration-(--duration-base) ease-snappy",
                "hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-glow",
                "focus-visible:-translate-y-0.5 focus-visible:border-violet-400",
              )}
            >
              {/* Video background covering the entire card */}
              {video && (
                <video
                  src={video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              )}

              <div
                aria-hidden
                className={cn(
                  "relative aspect-4/3 w-full overflow-hidden",
                  !video && "bg-linear-to-br",
                  !video && accent,
                )}
              >
                {!video && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-white/10" />
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="grid size-14 place-items-center rounded-2xl bg-white/15 text-white shadow-md backdrop-blur transition-transform duration-(--duration-base) ease-snappy group-hover:scale-105 sm:size-16">
                        <Icon
                          className="size-7 sm:size-8"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div
                className={cn(
                  "relative space-y-1 p-4 sm:p-5",
                  video && "bg-bg-elevated/60 backdrop-blur-sm",
                )}
              >
                <h3 className="font-display text-base font-semibold tracking-tight text-fg sm:text-lg">
                  {title}
                </h3>
                <p className="text-sm text-fg-muted">{description}</p>
              </div>
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
