"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AccountLandingErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary per-segment untuk `/products/account`.
 *
 * Dipasang sesuai REQ-9.2: setiap route segment baru wajib punya
 * `error.tsx` dengan tombol `reset()` dan link kembali ke beranda,
 * mengikuti pola `app/products/error.tsx`.
 *
 * Boundary ini menangkap `Error` deskriptif yang dilempar oleh data
 * layer (`getGamesForCategory("account")`) saat fetch/parse/validasi
 * gagal (REQ-9.4) — tanpa silent catch, supaya pengguna mendapat
 * feedback yang jelas alih-alih layar putih.
 */
export default function AccountLandingError({
  error,
  reset,
}: AccountLandingErrorProps) {
  useEffect(() => {
    console.error("[products/account] landing failed", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-md place-items-center rounded-2xl border border-danger/30 bg-danger-soft/40 px-6 py-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-danger/15 text-danger">
            <AlertTriangle className="size-7" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
            Gagal memuat akun
          </h2>
          <p className="text-sm text-fg-muted">
            Sepertinya ada gangguan sebentar saat menyiapkan daftar game. Coba
            muat ulang, atau kembali ke beranda untuk menjelajah lewat kategori
            populer.
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
