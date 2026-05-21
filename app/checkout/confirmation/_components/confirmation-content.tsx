"use client";

import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Home,
  Package,
  Receipt,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCheckoutStore } from "@/stores/checkout-store";
import { formatIDR } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { OrderResult } from "@/lib/types/checkout";

/** REQ-4.10 — Key `sessionStorage` untuk fallback `OrderResult`. */
const PENDING_ORDER_KEY = "gm-pending-order";

/**
 * Type guard ringan untuk hasil `JSON.parse` dari `sessionStorage` —
 * memastikan minimal field yang dipakai render (`orderId`, `summary`,
 * `paymentInstructions`, `estimatedDelivery`) bertipe sesuai kontrak.
 * Dipakai pada jalur fallback REQ-4.10 supaya tidak melempar di runtime.
 */
function isOrderResultLike(value: unknown): value is OrderResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.orderId === "string" &&
    typeof v.orderDate === "string" &&
    typeof v.estimatedDelivery === "string" &&
    Array.isArray(v.paymentInstructions) &&
    typeof v.summary === "object" &&
    v.summary !== null
  );
}

/**
 * Order confirmation content with celebratory UI.
 *
 * Sumber data `OrderResult` (urutan prioritas):
 *   1. `checkout-store` (Zustand) — jalur normal.
 *   2. **REQ-4.10 fallback** — saat query `?fallback=session` dipakai
 *      (artinya `setOrderResult` di `checkout-form.tsx` melempar dan
 *      data disimpan ke `sessionStorage` key `gm-pending-order`),
 *      baca dari `sessionStorage` setelah hidrasi lalu hapus key-nya
 *      supaya tidak ter-replay saat refresh.
 *   3. Tidak ada data → redirect ke `/products`.
 */
export function ConfirmationContent() {
  const router = useRouter();
  const hydrated = useHydrated();
  const searchParams = useSearchParams();
  const isFallback = searchParams.get("fallback") === "session";
  const orderResult = useCheckoutStore((s) => s.orderResult);
  const reset = useCheckoutStore((s) => s.reset);

  const [snapshot, setSnapshot] = useState<OrderResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Capture order during render (React 19 pattern — avoids set-state-in-effect).
  if (hydrated && orderResult && !snapshot) {
    setSnapshot(orderResult);
  }

  // REQ-4.10 — Jalur fallback `sessionStorage`. Hanya membaca + parse di
  // fase render (idempoten, aman dipanggil ulang oleh StrictMode); operasi
  // destruktif `removeItem` ditunda ke `useEffect` di bawah supaya hanya
  // berjalan satu kali setelah commit dan tidak menghapus key dua kali
  // saat StrictMode me-render ganda.
  if (hydrated && isFallback && !snapshot && !orderResult) {
    try {
      const raw = sessionStorage.getItem(PENDING_ORDER_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isOrderResultLike(parsed)) {
          setSnapshot(parsed);
        }
      }
    } catch (err) {
      // Mode privat / quota / JSON rusak — diamkan; redirect berikutnya
      // akan menangani.
      console.error(
        "[confirmation] gagal membaca fallback sessionStorage",
        err,
      );
    }
  }

  // Setelah snapshot ter-capture: reset checkout draft + (REQ-4.10) hapus
  // key sessionStorage supaya tidak ter-replay pada refresh.
  useEffect(() => {
    if (!snapshot) return;
    reset();
    try {
      sessionStorage.removeItem(PENDING_ORDER_KEY);
    } catch {
      // Worst-case: key tidak terhapus — risikonya hanya replay saat
      // refresh; tidak menghentikan render konfirmasi.
    }
  }, [snapshot, reset]);

  // Redirect bila tidak ada data sama sekali. Pada jalur fallback dengan
  // `sessionStorage` valid, `snapshot` akan terisi sebelum efek ini
  // berjalan sehingga redirect tidak ter-trigger.
  useEffect(() => {
    if (!hydrated) return;
    if (orderResult || snapshot) return;
    router.replace("/products");
  }, [hydrated, orderResult, snapshot, router]);

  if (!snapshot) {
    return null;
  }

  const {
    orderId,
    orderDate,
    summary,
    paymentInstructions,
    estimatedDelivery,
  } = snapshot;

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(orderDate));

  async function handleCopyOrderId() {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fallback for insecure contexts.
    }
  }

  return (
    <div className="space-y-8">
      {/* ─── Success Hero ─── */}
      <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border border-border bg-bg-elevated px-6 py-10 text-center sm:py-14">
        {/* Decorative gradient glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Confetti dots */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-2 rounded-full animate-confetti-fall"
              style={{
                left: `${8 + i * 7.5}%`,
                top: "-8px",
                animationDelay: `${i * 0.1}s`,
                backgroundColor:
                  i % 3 === 0
                    ? "var(--color-violet-400)"
                    : i % 3 === 1
                      ? "var(--color-accent-pink)"
                      : "var(--color-success)",
              }}
            />
          ))}
        </div>

        {/* Animated success icon */}
        <div className="relative">
          <span
            className="absolute inset-0 rounded-full bg-success/20 animate-success-ring"
            aria-hidden
          />
          <div className="relative grid size-20 place-items-center rounded-full bg-success/15 animate-success-bounce">
            <CheckCircle2
              className="size-11 text-success"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
        </div>

        {/* Heading */}
        <div
          className="relative space-y-2 animate-fade-in-up"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Pembayaran Berhasil! 🎉
          </h1>
          <p className="mx-auto max-w-lg text-sm text-fg-muted sm:text-base">
            Terima kasih sudah berbelanja di Gaming Marketplace. Pesananmu
            sedang diproses dan akan segera dikirim.
          </p>
        </div>

        {/* Order ID badge */}
        <div
          className="relative inline-flex items-center gap-2 rounded-full border border-border bg-bg-overlay px-4 py-2 animate-fade-in-up"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          <Receipt className="size-4 text-violet-300" aria-hidden />
          <span className="font-mono text-sm font-semibold tracking-wide text-fg">
            {orderId}
          </span>
          <button
            type="button"
            onClick={handleCopyOrderId}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-fg-muted transition-all duration-(--duration-base)",
              "hover:bg-bg-overlay hover:text-fg",
              "focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-2",
              copied && "text-success",
            )}
            aria-label="Salin nomor pesanan"
          >
            <Copy className="size-3" aria-hidden />
            {copied ? "Disalin!" : "Salin"}
          </button>
        </div>
      </div>

      {/* ─── Status Timeline ─── */}
      <div className="rounded-2xl border border-border bg-bg-elevated p-5 sm:p-6">
        <h2 className="mb-5 text-base font-semibold text-fg">Status Pesanan</h2>
        <div className="relative flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between">
          {/* Connecting line (mobile: vertical, desktop: horizontal) */}
          <div
            className="absolute left-[15px] top-8 hidden h-[calc(100%-32px)] w-0.5 bg-linear-to-b from-success via-violet-400 to-border sm:left-0 sm:top-[15px] sm:block sm:h-0.5 sm:w-full"
            aria-hidden
          />
          <div
            className="absolute left-[15px] top-8 h-[calc(100%-32px)] w-0.5 bg-linear-to-b from-success via-violet-400 to-border sm:hidden"
            aria-hidden
          />

          {TIMELINE_STEPS.map((step, idx) => (
            <div
              key={step.label}
              className={cn(
                "relative flex items-start gap-3 pb-6 last:pb-0 sm:flex-col sm:items-center sm:gap-2 sm:pb-0 sm:text-center",
                "sm:flex-1",
              )}
            >
              <div
                className={cn(
                  "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2",
                  idx === 0
                    ? "border-success bg-success/15 text-success"
                    : idx === 1
                      ? "border-violet-400 bg-violet-500/15 text-violet-300"
                      : "border-border bg-bg-overlay text-fg-subtle",
                )}
              >
                <step.icon className="size-4" strokeWidth={2} aria-hidden />
              </div>
              <div className="pt-1 sm:pt-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    idx === 0
                      ? "text-success"
                      : idx === 1
                        ? "text-violet-300"
                        : "text-fg-subtle",
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-fg-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Order Meta Cards ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetaCard icon={Receipt} label="Nomor Pesanan" value={orderId} mono />
        <MetaCard
          icon={CalendarClock}
          label="Tanggal Pesanan"
          value={formattedDate}
        />
        <MetaCard
          icon={Clock}
          label="Estimasi Pengiriman"
          value={estimatedDelivery}
        />
      </div>

      {/* ─── Order Summary ─── */}
      <section
        aria-labelledby="confirmation-summary-heading"
        className="space-y-4 rounded-2xl border border-border bg-bg-elevated p-5 sm:p-6"
      >
        <h2
          id="confirmation-summary-heading"
          className="text-base font-semibold text-fg"
        >
          Ringkasan Pesanan
        </h2>

        <div className="divide-y divide-border">
          {summary.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-bg-overlay">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-xs text-fg-subtle">
                    —
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">
                  {item.title}
                </p>
                <p className="text-xs text-fg-muted">
                  {item.qty} × {formatIDR(item.price)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-fg">
                {formatIDR(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-fg-muted">Subtotal</span>
            <span className="tabular-nums text-fg">
              {formatIDR(summary.subtotal)}
            </span>
          </div>

          {summary.voucherDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-success">
                Diskon Voucher
                {summary.voucherCode ? ` (${summary.voucherCode})` : ""}
              </span>
              <span className="tabular-nums text-success">
                −{formatIDR(summary.voucherDiscount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-base font-semibold text-fg">
              Total Dibayar
            </span>
            <span className="text-xl font-bold tabular-nums text-fg">
              {formatIDR(summary.total)}
            </span>
          </div>
        </div>
      </section>

      {/* ─── Payment & Instructions ─── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment method */}
        <section
          aria-labelledby="confirmation-payment-heading"
          className="space-y-4 rounded-2xl border border-border bg-bg-elevated p-5 sm:p-6"
        >
          <h2
            id="confirmation-payment-heading"
            className="text-base font-semibold text-fg"
          >
            Metode Pembayaran
          </h2>
          <div className="flex items-center gap-3 rounded-xl border border-violet-400/40 bg-violet-500/10 p-4">
            <div className="grid size-10 place-items-center rounded-full bg-violet-500/20 text-violet-300">
              <CreditCard className="size-5" strokeWidth={1.75} aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-fg">
                {summary.paymentMethod.name}
              </p>
              {summary.paymentMethod.description && (
                <p className="text-xs text-fg-muted">
                  {summary.paymentMethod.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-bg-overlay/60 p-3 text-xs text-fg-muted">
            <Truck
              className="mt-0.5 size-4 shrink-0 text-violet-300"
              strokeWidth={1.75}
              aria-hidden
            />
            <span>
              Estimasi pengiriman:{" "}
              <span className="font-medium text-fg">{estimatedDelivery}</span>
            </span>
          </div>
        </section>

        {/* Instructions */}
        <section
          aria-labelledby="confirmation-instructions-heading"
          className="space-y-4 rounded-2xl border border-border bg-bg-elevated p-5 sm:p-6"
        >
          <h2
            id="confirmation-instructions-heading"
            className="text-base font-semibold text-fg"
          >
            Instruksi Pembayaran
          </h2>
          <ol className="space-y-3 text-sm text-fg-muted">
            {paymentInstructions.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-300"
                >
                  {idx + 1}
                </span>
                <span className="pt-1 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* ─── Customer Info ─── */}
      <section
        aria-labelledby="confirmation-customer-heading"
        className="space-y-4 rounded-2xl border border-border bg-bg-elevated p-5 sm:p-6"
      >
        <h2
          id="confirmation-customer-heading"
          className="text-base font-semibold text-fg"
        >
          Data Pemesan
        </h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <InfoField label="Nama" value={summary.customer.name} />
          <InfoField label="Email" value={summary.customer.email} truncate />
          <InfoField label="WhatsApp" value={summary.customer.whatsapp} />
          {summary.customer.gameId && (
            <InfoField
              label="ID Game"
              value={`${summary.customer.gameId}${summary.customer.gameServer ? ` · ${summary.customer.gameServer}` : ""}`}
            />
          )}
          {summary.customer.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
                Catatan
              </dt>
              <dd className="mt-1 whitespace-pre-line rounded-lg bg-bg-overlay/60 p-3 text-fg">
                {summary.customer.notes}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* ─── CTAs ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Button asChild variant="primary" size="lg">
          <Link href="/">
            <Home className="size-4" aria-hidden />
            Kembali ke Beranda
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/products">
            <ShoppingBag className="size-4" aria-hidden />
            Lihat Produk Lain
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

const TIMELINE_STEPS = [
  {
    icon: CheckCircle2,
    label: "Pembayaran Diterima",
    description: "Pesanan dikonfirmasi",
  },
  {
    icon: Package,
    label: "Sedang Diproses",
    description: "Menyiapkan pesanan",
  },
  {
    icon: Truck,
    label: "Dikirim",
    description: "Menunggu pengiriman",
  },
] as const;

function MetaCard({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-elevated p-4 sm:p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-fg-subtle">
        <Icon className="size-3.5" aria-hidden />
        <span>{label}</span>
      </div>
      <p
        className={cn(
          "mt-2 text-sm font-semibold text-fg",
          mono && "font-mono tracking-wide",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function InfoField({
  label,
  value,
  truncate,
}: {
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </dt>
      <dd className={cn("mt-0.5 text-fg", truncate && "truncate")}>{value}</dd>
    </div>
  );
}
