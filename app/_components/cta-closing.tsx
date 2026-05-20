import {
  ArrowRight,
  Headphones,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CTA_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Garansi anti-minus",
    description:
      "Setiap akun premium dikurasi manual dan dilindungi garansi resmi GameVault.",
  },
  {
    icon: Zap,
    title: "Top up 1-3 menit",
    description:
      "Sistem otomatis 24/7. Diamond, UC, Genesis Crystals langsung masuk ke ID-mu.",
  },
  {
    icon: Headphones,
    title: "Support 24 jam",
    description:
      "Tim CS siap bantu via live chat, WhatsApp, atau Discord — kapan pun grindnya.",
  },
] as const;

/**
 * Closing CTA section for the landing page. Reinforces brand promise (anti-minus,
 * fast top up, 24h support) and funnels users toward the product listing or the
 * top-up flow. Pure server component — no interactivity required.
 */
export function CtaClosing() {
  return (
    <section
      aria-labelledby="cta-closing-heading"
      className="container-page py-16 sm:py-20"
    >
      <div className="relative isolate overflow-hidden rounded-2xl border border-violet-500/30 bg-bg-elevated px-6 py-12 shadow-lg sm:rounded-[2rem] sm:px-10 sm:py-16 lg:px-16">
        {/* Ambient gradient & orbs to echo the hero treatment */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-violet-900/60 via-bg-elevated to-bg-elevated" />
          <div className="absolute -left-24 top-1/3 size-72 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute -right-16 -top-20 size-80 rounded-full bg-accent-pink/25 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 size-72 rounded-full bg-violet-700/40 blur-3xl" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          {/* Copy + CTAs */}
          <div className="space-y-6">
            <Badge variant="primary" className="uppercase tracking-widest">
              <Sparkles className="size-3.5" strokeWidth={2.25} aria-hidden />
              Mulai sekarang
            </Badge>

            <h2
              id="cta-closing-heading"
              className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Saatnya naik level.
              <span className="block bg-linear-to-r from-violet-200 via-accent-pink to-violet-300 bg-clip-text text-transparent">
                Top up & beli akun tanpa drama.
              </span>
            </h2>

            <p className="max-w-xl text-base text-fg-muted sm:text-lg">
              Bergabung bareng ribuan gamer yang sudah pakai GameVault untuk top
              up harian, voucher resmi, hingga akun mythic. Cepat, aman, dan
              transparan dari awal sampai akhir transaksi.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/products">
                  Jelajahi Semua Produk
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/products?category=topup">Top Up Sekarang</Link>
              </Button>
            </div>

            <p className="text-xs text-fg-subtle">
              Tanpa biaya tersembunyi. Pembayaran via QRIS, e-wallet, virtual
              account, dan kartu kredit.
            </p>
          </div>

          {/* Highlight cards */}
          <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {CTA_HIGHLIGHTS.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-bg-overlay/70 p-5 backdrop-blur transition-colors duration-(--duration-base) ease-snappy hover:border-violet-500/60"
              >
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-violet-500/15 text-violet-300"
                  >
                    <item.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div className="space-y-1">
                    <p className="font-display text-sm font-semibold text-fg">
                      {item.title}
                    </p>
                    <p className="text-sm leading-6 text-fg-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
