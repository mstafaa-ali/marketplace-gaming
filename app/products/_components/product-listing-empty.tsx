import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ProductQuery } from "@/lib/types/product";

interface ProductListingEmptyProps {
  query: ProductQuery;
}

/**
 * Friendly empty state for the listing. Tone follows the rest of the site:
 * concise Bahasa Indonesia, primary CTA to clear filters and browse again.
 */
export function ProductListingEmpty({ query }: ProductListingEmptyProps) {
  const hasFilters =
    Boolean(query.q) ||
    query.games.length > 0 ||
    Boolean(query.category) ||
    typeof query.min === "number" ||
    typeof query.max === "number";

  return (
    <div
      role="status"
      className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-16 text-center"
    >
      <div className="mx-auto max-w-md space-y-4">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-violet-500/10 text-violet-300">
          <PackageSearch className="size-7" strokeWidth={1.75} aria-hidden />
        </div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
          Belum ada produk yang cocok
        </h2>
        <p className="text-sm text-fg-muted">
          {hasFilters
            ? "Coba kurangi filter atau ubah kata kunci pencarianmu. Kami punya banyak akun, top up, dan voucher di kategori lain."
            : "Stok untuk kombinasi ini sedang kosong. Coba lagi sebentar atau jelajahi kategori lain."}
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {hasFilters ? (
            <Button asChild variant="primary" size="md">
              <Link href="/products">Reset filter</Link>
            </Button>
          ) : null}
          <Button asChild variant="outline" size="md">
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
