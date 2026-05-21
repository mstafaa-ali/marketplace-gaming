"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface VoucherLandingErrorProps {
  /** Error yang ditangkap React; `digest` hadir saat error berasal dari server. */
  error: Error & { digest?: string };
  /** Soft-retry — me-render ulang segment tanpa berpindah route. */
  reset: () => void;
}

/**
 * Error boundary segment untuk `/products/voucher` (REQ-9.2).
 *
 * Boundary ini menangkap `Error` deskriptif yang dilempar oleh data
 * layer (`getPlatforms()` → `groupPlatformsForVouchers`) saat ditemukan
 * voucher tanpa `platformSlug` (kontrak hard-rule REQ-5.2) maupun saat
 * fetch/parse data gagal (REQ-9.4) — tanpa silent catch, supaya pengguna
 * mendapat feedback yang jelas alih-alih layar putih.
 *
 * Mengikuti pola visual `app/products/error.tsx`: panel danger soft di
 * tengah, ikon `AlertTriangle`, headline + paragraf deskriptif, dan dua
 * CTA berdampingan ("Coba lagi" + "Kembali ke beranda"). Tone copy
 * dijaga konsisten dengan `/products/account/error.tsx` &
 * `/products/topup/error.tsx` — singkat, ramah, mengakui gangguan
 * biasanya sementara.
 *
 * Komponen ini wajib `"use client"` karena props `reset` adalah callback
 * yang hanya bisa dipanggil dari client. Logging ke `console.error`
 * sengaja kasar — di production nanti bisa diganti dengan telemetry sink
 * (mis. Sentry) tanpa mengubah UI.
 */
export default function VoucherLandingError({
  error,
  reset,
}: VoucherLandingErrorProps) {
  useEffect(() => {
    console.error("[products/voucher] landing failed", error);
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
            Sepertinya ada gangguan sebentar saat menyiapkan daftar platform
            voucher. Coba muat ulang, atau kembali ke beranda untuk menjelajah
            lewat kategori populer.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button onClick={reset} variant="primary" size="md">
              <RotateCcw className="size-4" aria-hidden />
              Coba lagi
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/">Kembali ke beranda</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
