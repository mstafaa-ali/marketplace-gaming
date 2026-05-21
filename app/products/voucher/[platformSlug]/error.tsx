"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface VoucherDetailErrorProps {
  /** Error yang ditangkap React; `digest` hadir saat error berasal dari server. */
  error: Error & { digest?: string };
  /** Soft-retry — me-render ulang segment tanpa berpindah route. */
  reset: () => void;
}

/**
 * Error boundary segment untuk `/products/voucher/[platformSlug]`
 * (REQ-9.2).
 *
 * Boundary ini menangkap exception non-`notFound()` dari
 * `Platform_Detail_Page`: data layer (`getPlatformBySlug`,
 * `getVouchersByPlatform`) yang gagal fetch/parse, maupun hard-rule
 * REQ-5.2 yang melempar `Error` saat menemukan voucher tanpa
 * `platformSlug`. Pemisahan dengan `notFound()` (slug platform memang
 * tidak ada di catalog) dijaga di level page — sini hanya untuk
 * gangguan teknis, tanpa silent catch (REQ-9.4).
 *
 * Mengikuti pola visual `app/products/voucher/error.tsx`: panel danger
 * soft di tengah, ikon `AlertTriangle`, headline + paragraf deskriptif,
 * dan dua CTA berdampingan ("Coba lagi" + link ke daftar Platform).
 * CTA sekunder mengarah ke `/products/voucher` (Category_Landing_Page
 * Voucher) bukan ke beranda — supaya pengguna yang gagal di detail satu
 * platform bisa cepat kembali ke daftar platform lainnya.
 *
 * Komponen ini wajib `"use client"` karena props `reset` adalah callback
 * yang hanya bisa dipanggil dari client. Logging ke `console.error`
 * sengaja kasar — di production nanti bisa diganti dengan telemetry sink
 * (mis. Sentry) tanpa mengubah UI.
 */
export default function VoucherDetailError({
  error,
  reset,
}: VoucherDetailErrorProps) {
  useEffect(() => {
    console.error("[products/voucher/[platformSlug]] detail failed", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-md place-items-center rounded-2xl border border-danger/30 bg-danger-soft/40 px-6 py-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-danger/15 text-danger">
            <AlertTriangle className="size-7" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
            Gagal memuat voucher
          </h2>
          <p className="text-sm text-fg-muted">
            Sepertinya ada gangguan sebentar saat menyiapkan daftar voucher
            untuk platform ini. Coba muat ulang, atau kembali ke daftar platform
            untuk menjelajah opsi lain.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button onClick={reset} variant="primary" size="md">
              <RotateCcw className="size-4" aria-hidden />
              Coba lagi
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/products/voucher">Kembali ke daftar Platform</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
