"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ProductDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Per-segment error boundary for `/products/[slug]`. Logs the error and
 * offers retry or navigation back to the listing.
 */
export default function ProductDetailError({
  error,
  reset,
}: ProductDetailErrorProps) {
  useEffect(() => {
    console.error("[products/slug] detail failed", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-md place-items-center rounded-2xl border border-danger/30 bg-danger-soft/40 px-6 py-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-danger/15 text-danger">
            <AlertTriangle className="size-7" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
            Gagal memuat detail produk
          </h2>
          <p className="text-sm text-fg-muted">
            Terjadi kesalahan saat memuat halaman ini. Coba muat ulang, atau
            kembali ke daftar produk.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button onClick={reset} variant="primary" size="md">
              <RotateCcw className="size-4" aria-hidden />
              Coba lagi
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/products">Lihat semua produk</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
