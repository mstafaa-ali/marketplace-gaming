"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AccountDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary per-segment untuk `/products/account/[gameSlug]`.
 *
 * Dipasang sesuai REQ-9.2: setiap route segment baru wajib punya
 * `error.tsx` dengan tombol `reset()` dan link kembali ke parent route,
 * mengikuti pola `app/products/error.tsx` dan
 * `app/products/account/error.tsx`.
 *
 * Boundary ini menangkap `Error` deskriptif yang dilempar oleh data
 * layer (`getGameBySlug`, `searchProducts`, `getAccountsByGame`) saat
 * fetch/parse/validasi gagal (REQ-9.4) — tanpa silent catch, supaya
 * pengguna mendapat feedback yang jelas alih-alih layar putih.
 *
 * CTA secondary mengarah ke `/products/account` (bukan beranda) supaya
 * user bisa kembali memilih game lain dari daftar landing tanpa harus
 * memulai navigasi dari nol.
 */
export default function AccountDetailError({
  error,
  reset,
}: AccountDetailErrorProps) {
  useEffect(() => {
    console.error("[products/account/[gameSlug]] detail failed", error);
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
            Sepertinya ada gangguan sebentar saat menyiapkan daftar akun untuk
            game ini. Coba muat ulang, atau kembali ke daftar game untuk memilih
            kategori lain.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button onClick={reset} variant="primary" size="md">
              <RotateCcw className="size-4" aria-hidden />
              Coba lagi
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/products/account">Kembali ke daftar Game</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
