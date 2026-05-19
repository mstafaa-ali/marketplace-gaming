import {
  ArrowRight,
  BadgeCheck,
  Crown,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TRUST_PILLS = [
  { icon: ShieldCheck, label: "Garansi 100% Anti-Minus" },
  { icon: Zap, label: "Top Up Otomatis 1-3 Menit" },
  { icon: Sparkles, label: "Akun Premium Terkurasi" },
] as const;

const HERO_STATS = [
  { value: "120K+", label: "Transaksi sukses" },
  { value: "4.9/5", label: "Rating pelanggan" },
  { value: "24 jam", label: "Support real-time" },
] as const;

const HERO_CARDS = [
  {
    title: "Top Up Diamond",
    subtitle: "1.000 Diamond · Mobile Legends",
    badge: "Auto · 1 menit",
    accent: "from-violet-600 via-violet-500 to-fuchsia-500",
    icon: Zap,
    rotate: "-rotate-3",
    offset: "lg:-translate-x-6 lg:-translate-y-2",
    z: "z-30",
  },
  {
    title: "Akun Mythic Glory",
    subtitle: "1.247 Skin · Bind Moonton",
    badge: "Anti-Minus",
    accent: "from-fuchsia-600 via-violet-700 to-violet-900",
    icon: Crown,
    rotate: "rotate-2",
    offset: "lg:translate-x-10 lg:translate-y-4",
    z: "z-20",
  },
  {
    title: "Voucher Resmi",
    subtitle: "Google Play · Steam · PSN",
    badge: "Instan via email",
    accent: "from-cyan-500 via-violet-600 to-violet-900",
    icon: Ticket,
    rotate: "-rotate-2",
    offset: "lg:translate-x-2 lg:translate-y-16",
    z: "z-10",
  },
] as const;

export function HeroSection() {
  return (
    <section className="bg-aurora relative isolate overflow-hidden">
      {/* Subtle ambient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
      >
        <div className="absolute -top-32 left-1/3 size-72 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 size-80 rounded-full bg-accent-pink/20 blur-3xl" />
      </div>

      <div className="container-page grid gap-12 py-20 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:py-28">
        {/* Copy */}
        <div className="space-y-6">
          <Badge variant="primary" className="uppercase tracking-wider">
            <BadgeCheck className="size-3.5" strokeWidth={2.25} aria-hidden />
            Marketplace Gaming Tepercaya
          </Badge>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-fg md:text-5xl lg:text-6xl">
            Top up game, voucher, dan akun premium
            <span className="bg-linear-to-r from-violet-300 via-accent-pink to-violet-400 bg-clip-text text-transparent">
              {" "}
              tanpa drama.
            </span>
          </h1>

          <p className="max-w-xl text-base text-fg-muted md:text-lg">
            GameVault menyediakan transaksi gaming yang cepat, transparan, dan
            aman. Cocok buat tryhard maupun grinding santai — semua kategori
            populer ada di satu tempat.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/products">
                Jelajahi Produk
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products?category=topup">Mulai Top Up</Link>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm text-fg-muted">
            {TRUST_PILLS.map((item) => (
              <li key={item.label} className="inline-flex items-center gap-2">
                <item.icon
                  className="size-4 text-violet-300"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {item.label}
              </li>
            ))}
          </ul>

          {/* Trust stats */}
          <dl className="grid grid-cols-3 gap-2 pt-4 sm:max-w-md">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-bg-elevated/70 px-3 py-3 backdrop-blur"
              >
                <dt className="text-xs uppercase tracking-wider text-fg-subtle">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-fg">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Artwork — stacked product cards */}
        <div
          aria-hidden
          className="relative mx-auto aspect-4/3 w-full max-w-md lg:max-w-none"
        >
          {/* Soft halo */}
          <div className="absolute inset-x-6 inset-y-10 rounded-3xl bg-violet-500/15 blur-2xl" />

          {HERO_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className={`absolute left-0 right-0 mx-auto w-[78%] sm:w-[72%] lg:w-[80%] ${card.rotate} ${card.offset} ${card.z}`}
                style={{
                  top: `${idx * 18}%`,
                }}
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg-elevated/90 shadow-lg backdrop-blur">
                  <div
                    className={`relative bg-linear-to-br ${card.accent} p-5 text-white`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider backdrop-blur">
                        <Star
                          className="size-3"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                        {card.badge}
                      </span>
                      <span className="grid size-9 place-items-center rounded-full bg-white/20 backdrop-blur">
                        <Icon className="size-4" strokeWidth={2} aria-hidden />
                      </span>
                    </div>
                    <p className="mt-6 text-xs uppercase tracking-widest text-white/80">
                      {card.subtitle}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold tracking-tight">
                      {card.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-border bg-bg-elevated/95 px-5 py-3">
                    <span className="text-xs text-fg-subtle">Mulai dari</span>
                    <span className="font-display text-sm font-semibold tabular-nums text-violet-300">
                      Rp{(45 + idx * 90).toLocaleString("id-ID")}.000
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
