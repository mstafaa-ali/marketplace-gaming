import { Ghost } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page grid place-items-center py-24 text-center">
      <div className="max-w-md space-y-4">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-bg-elevated text-violet-300">
          <Ghost className="size-8" aria-hidden />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Halaman tidak ditemukan
        </h1>
        <p className="text-fg-muted">
          Halaman yang kamu cari sudah hilang ke void. Coba kembali ke beranda
          atau lihat katalog produk.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button asChild>
            <Link href="/">Ke Beranda</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">Lihat Produk</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
