"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ProductListingErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Per-segment error boundary for `/products`. Logs to console (replace with a
 * real telemetry sink later) and offers a soft retry without leaving the
 * route.
 */
export default function ProductListingError({
  error,
  reset,
}: ProductListingErrorProps) {
  useEffect(() => {
    console.error("[products] listing failed", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-md place-items-center rounded-2xl border border-danger/30 bg-danger-soft/40 px-6 py-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-danger/15 text-danger">
            <AlertTriangle className="size-7" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
            Gagal memuat daftar produk
          </h2>
          <p className="text-sm text-fg-muted">
            Sepertinya ada gangguan sebentar. Coba muat ulang, atau kembali ke
            beranda untuk menjelajah lewat kategori populer.
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
