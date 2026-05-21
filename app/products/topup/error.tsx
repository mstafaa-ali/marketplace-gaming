"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface TopupLandingErrorProps {
  /** Error yang ditangkap React; `digest` hadir saat error berasal dari server. */
  error: Error & { digest?: string };
  /** Soft-retry — me-render ulang segment tanpa berpindah route. */
  reset: () => void;
}

/**
 * Error boundary segment untuk `/products/topup` (REQ-9.2).
 *
 * Mengikuti pola visual `app/products/error.tsx`: panel danger soft di
 * tengah, ikon `AlertTriangle`, headline + paragraf deskriptif, dan dua
 * CTA berdampingan. Tone copy dijaga konsisten — singkat, ramah, dan
 * mengakui bahwa gangguan biasanya sementara.
 *
 * Komponen ini wajib `"use client"` karena props `reset` adalah callback
 * yang hanya bisa dipanggil dari client. Logging ke `console.error`
 * sengaja kasar — di production nanti bisa diganti dengan telemetry sink
 * (mis. Sentry) tanpa mengubah UI.
 */
export default function TopupLandingError({
  error,
  reset,
}: TopupLandingErrorProps) {
  useEffect(() => {
    console.error("[products/topup] landing failed", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-md place-items-center rounded-2xl border border-danger/30 bg-danger-soft/40 px-6 py-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-danger/15 text-danger">
            <AlertTriangle className="size-7" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
            Gagal memuat top up
          </h2>
          <p className="text-sm text-fg-muted">
            Sepertinya ada gangguan sebentar saat mengambil daftar game top up.
            Coba muat ulang, atau kembali ke beranda untuk menjelajah lewat
            kategori populer.
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
