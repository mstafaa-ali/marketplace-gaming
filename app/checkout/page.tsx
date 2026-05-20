import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "./_components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Selesaikan pembelian Anda di Gaming Marketplace.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
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
        <CheckoutForm />
      </div>
    </div>
  );
}
