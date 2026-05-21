import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getGameBySlug } from "@/lib/data/games";
import { getTopupsByGame } from "@/lib/data/products";

import { CheckoutForm } from "./_components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Selesaikan pembelian Anda di Gaming Marketplace.",
  robots: { index: false, follow: false },
};

/**
 * Bentuk `searchParams` Next.js 16 untuk Server Component: selalu sebuah
 * `Promise` yang me-resolve ke object key→value. Sebuah key bisa muncul
 * sebagai array saat URL berisi parameter yang sama lebih dari sekali
 * (mis. `?game=a&game=b`).
 */
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface CheckoutPageProps {
  searchParams: SearchParams;
}

/**
 * Ambil nilai string pertama dari sebuah entri `searchParams`. Saat
 * parameter berupa array (`?game=a&game=b`), Next.js menyerahkan urutan
 * sesuai URL — kita konsisten memilih elemen pertama agar deterministik
 * dan sejalan dengan helper internal lain di repo.
 */
function firstString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * `Checkout_Page` mendukung dua mode (REQ-4.1):
 *
 * - **`mode="cart"`** (default) — alur keranjang existing. Sumber item
 *   berasal dari `cart-store` di sisi klien.
 * - **`mode="topup"`** — alur Topup single-shot, aktif saat URL berisi
 *   `?category=topup&game={gameSlug}` (REQ-4.2). Server Component ini
 *   memuat `Game` dan daftar `Topup_Denomination` lebih dulu, lalu
 *   meneruskannya ke `Checkout_Form` agar `Topup_Picker` dapat di-render
 *   tanpa fetch tambahan di klien.
 *
 * Kontrak invariant gameSlug (REQ-4.7): bila `gameSlug` tidak ada di
 * `Game_Catalog` (`getGameBySlug` mengembalikan `null`), halaman
 * melakukan redirect via `next/navigation#redirect` ke
 * `/products/topup`. Helper `redirect()` Next.js menerbitkan respons
 * 307 di Server Component, memenuhi rentang 302/307 yang ditetapkan
 * pada acceptance criteria.
 */
export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const sp = await searchParams;
  const category = firstString(sp.category);
  const gameSlug = firstString(sp.game);

  const isTopupFlow =
    category === "topup" && typeof gameSlug === "string" && gameSlug.length > 0;

  // Pre-fetch data untuk mode topup di Server Component.
  // Pada mode cart, `game`/`denominations` tetap `null` agar form
  // memilih varian `mode="cart"`.
  let game: Awaited<ReturnType<typeof getGameBySlug>> = null;
  let denominations: Awaited<ReturnType<typeof getTopupsByGame>> = [];

  if (isTopupFlow) {
    // gameSlug dipersempit ke `string` lewat predikat `isTopupFlow` di atas.
    game = await getGameBySlug(gameSlug as string);

    // REQ-4.7: gameSlug invalid → redirect ke landing Topup. `redirect()`
    // melempar internal sehingga eksekusi setelah baris ini tidak berjalan.
    if (!game) {
      redirect("/products/topup");
    }

    denominations = await getTopupsByGame(game.slug);
  }

  return (
    <div className="container-page py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-sm text-fg-muted">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-fg focus-visible:text-fg"
            >
              Home
            </Link>
          </li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li>
            <span className="font-medium text-fg" aria-current="page">
              Checkout
            </span>
          </li>
        </ol>
      </nav>

      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Checkout
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        Lengkapi data di bawah untuk menyelesaikan pesanan.
      </p>

      <div className="mt-8">
        {isTopupFlow && game ? (
          <CheckoutForm
            mode="topup"
            game={game}
            denominations={denominations}
          />
        ) : (
          <CheckoutForm mode="cart" />
        )}
      </div>
    </div>
  );
}
