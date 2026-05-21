import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ConfirmationContent } from "./_components/confirmation-content";

export const metadata: Metadata = {
  title: "Pesanan Berhasil",
  description: "Konfirmasi pesanan Gaming Marketplace Anda.",
  robots: { index: false, follow: false },
};

export default function CheckoutConfirmationPage() {
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
            <Link
              href="/checkout"
              className="transition-colors hover:text-fg focus-visible:text-fg"
            >
              Checkout
            </Link>
          </li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li>
            <span className="font-medium text-fg" aria-current="page">
              Konfirmasi
            </span>
          </li>
        </ol>
      </nav>

      <Suspense fallback={null}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
