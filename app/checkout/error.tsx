"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CheckoutErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Per-segment error boundary for `/checkout`.
 */
export default function CheckoutError({ error, reset }: CheckoutErrorProps) {
  useEffect(() => {
    console.error("[checkout] error", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-md place-items-center rounded-2xl border border-danger/30 bg-danger-soft/40 px-6 py-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-danger/15 text-danger">
            <AlertTriangle className="size-7" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
            Terjadi Kesalahan
          </h2>
          <p className="text-sm text-fg-muted">
            Maaf, terjadi gangguan saat memproses checkout. Silakan coba lagi.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button onClick={reset} variant="primary" size="md">
              <RotateCcw className="size-4" aria-hidden />
              Coba lagi
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/products">Kembali ke produk</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
