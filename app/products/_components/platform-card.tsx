import {
  Apple,
  Gamepad,
  Gamepad2,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Platform } from "@/lib/types/platform";

/**
 * Map nama ikon Lucide (string PascalCase di `Platform.icon`) ke komponen
 * ikon konkret. Disengaja sempit agar penambahan platform baru yang memakai
 * ikon di luar map ini gagal-loud (fallback ke `Gamepad2`) — bukan crash.
 *
 * Catatan: Steam & Xbox tidak punya ikon brand di Lucide, sehingga keduanya
 * memetakan ke `Gamepad2` di `mock-platforms.ts`.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Gamepad2,
  Smartphone,
  Gamepad,
  Apple,
};

export interface PlatformCardProps {
  /** Entitas `Platform` yang dirender (lihat `lib/types/platform.ts`). */
  platform: Platform;
  /**
   * Label jumlah voucher untuk platform ini, contoh: `"24 voucher"`. Sudah
   * di-format oleh halaman induk (mis. `Platform_Grid`) agar `Platform_Card`
   * tetap presentational dan tidak melakukan i18n/format ganda.
   */
  countLabel: string;
}

/**
 * `Platform_Card` — kartu entitas `Platform` di `Category_Landing_Page` Voucher
 * (`/products/voucher`). Selalu menavigasi ke `Platform_Detail_Page`
 * (`/products/voucher/{slug}`), sehingga `href` dihitung internal dan TIDAK
 * diekspos sebagai prop (mengikuti kontrak Task 8.1).
 *
 * Anatomi (per `styling-guideline.md` §6.9):
 * - Single `<Link>` membungkus seluruh card; tidak ada link nested.
 * - Media area `aspect-square` ber-gradient `Platform.accent` dengan ikon
 *   Lucide 32–48px di tengah, sebagai pengganti cover image di `Game_Card`.
 * - Body identik `Game_Card`: title `Platform.name` + label jumlah voucher.
 * - aria-label deskriptif `"Lihat {count} untuk {name}"` dibaca pembaca layar
 *   sebagai satu landmark per item.
 *
 * Server Component murni (tanpa `"use client"`) — prop sederhana dan tidak
 * butuh state browser.
 */
export function PlatformCard({ platform, countLabel }: PlatformCardProps) {
  const href = `/products/voucher/${platform.slug}`;
  const Icon = ICON_MAP[platform.icon] ?? Gamepad2;

  return (
    <Link
      href={href}
      aria-label={`Lihat ${countLabel} untuk ${platform.name}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-border bg-bg-elevated",
        "transition-all duration-(--duration-base) ease-snappy",
        "hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-glow",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "relative flex aspect-square items-center justify-center overflow-hidden",
          !platform.image && "bg-linear-to-br",
          !platform.image && platform.accent,
        )}
      >
        {platform.image ? (
          <Image
            src={platform.image}
            alt=""
            fill
            className="object-cover transition-transform duration-(--duration-base) ease-snappy group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <Icon
            className="size-10 text-white"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="space-y-1 p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-fg">
          {platform.name}
        </h3>
        <p className="text-xs tabular-nums text-fg-muted">{countLabel}</p>
      </div>
    </Link>
  );
}
